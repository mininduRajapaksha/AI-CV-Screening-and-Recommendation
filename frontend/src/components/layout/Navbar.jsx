import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  X,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationApi } from '../../services/notificationApi'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert an ISO timestamp to a human-readable relative string */
function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

// Main Component

export default function Navbar({ title }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  //first name from the stored user object
  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const resolvedTitle = title ?? `Welcome Back, ${firstName}!`

  const [showNotifications, setShowNotifications] = useState(false)

  //notification state
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('cvision_read_notifs') || '[]'))
    } catch {
      return new Set()
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const notificationRef = useRef(null)

  //Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notificationApi.getAll()
      setNotifications(res.data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount; refresh whenever the panel opens
  useEffect(() => {
    if (showNotifications) fetchNotifications()
  }, [showNotifications, fetchNotifications])

  //Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  //Derived state
  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id)
    const next = new Set([...readIds, ...allIds])
    setReadIds(next)
    localStorage.setItem('cvision_read_notifs', JSON.stringify([...next]))
  }

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* PAGE TITLE */}

      <h1 className="text-lg text-slate-800">
        {resolvedTitle}
      </h1>

      <div className="flex h-full items-center gap-10">

        {/* NOTIFICATION */}

        <div
          ref={notificationRef}
          className="relative flex h-10 w-10 items-center justify-center"
        >

          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative items-center justify-center cursor-pointer text-slate-600"
            aria-label="Notifications"
          >

            <Bell size={28} strokeWidth={1.75} />

            {/* UNREAD BADGE */}

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#172554] px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}

          </button>

          {/* NOTIFICATION PANEL */}

          {showNotifications && (
            <div className="absolute right-0 top-[48px] z-[9999] w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">

              {/* Panel header */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Notifications
                  </h2>

                  {unreadCount > 0 && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Notifications list */}

              <div className="max-h-[360px] overflow-y-auto">

                {loading ? (
                  <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-slate-400">
                    <Loader2 size={18} className="animate-spin" />
                    Loading…
                  </div>
                ) : error ? (
                  <div className="px-5 py-10 text-center text-sm text-red-500">
                    {error}
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isUnread={!readIds.has(notification.id)}
                      onRead={() => {
                        const next = new Set([...readIds, notification.id])
                        setReadIds(next)
                        localStorage.setItem('cvision_read_notifs', JSON.stringify([...next]))
                      }}
                    />
                  ))
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    No notifications
                  </div>
                )}

              </div>

              {/* Panel footer */}

              {notifications.length > 0 && !loading && (
                <div className="border-t border-slate-200 px-5 py-3">
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-medium text-[#19295F] hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* USER PROFILE */}

        <button
          type="button"
          onClick={() => navigate('/profile')}
          aria-label="Go to profile"
          className="flex cursor-pointer items-center gap-2.5"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172554] text-xs font-semibold text-white">
            {user?.initials ?? (user?.name ? user.name[0].toUpperCase() : '?')}
          </div>

          <div className="leading-tight text-left">

            <p className="text-sm font-semibold text-slate-800">
              {user?.name ?? 'Unknown User'}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role ?? 'User'}
            </p>

          </div>

        </button>

      </div>

    </header>
  )
}


// Notification Item

function NotificationItem({ notification, isUnread, onRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-green-600" />
      case 'warning':
        return <AlertCircle size={20} className="text-orange-500" />
      case 'error':
        return <XCircle size={20} className="text-red-500" />
      default:
        return <Info size={20} className="text-blue-600" />
    }
  }

  return (
    <button
      type="button"
      onClick={onRead}
      className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${isUnread ? 'bg-blue-50/40' : 'bg-white'}`}
    >

      {/* ICON */}

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
        {getIcon()}
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-2">

          <p className="text-sm font-medium text-slate-900">
            {notification.title}
          </p>

          {/* UNREAD INDICATOR */}

          {isUnread && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          )}

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {notification.message}
        </p>

        <p className="mt-1.5 text-[11px] text-slate-400">
          {timeAgo(notification.time)}
        </p>

      </div>

    </button>
  )
}