import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'CV Screening Completed',
    message: '3 CVs have been successfully screened.',
    time: '5 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'New CVs Uploaded',
    message: '5 new CVs are waiting for screening.',
    time: '20 min ago',
    unread: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'New User Registered',
    message: 'A new HR Manager account has been created.',
    time: '1 hour ago',
    unread: false,
  },
]

export default function Navbar({
  title = 'Welcome Back, Minindu!',
}) {
  const { user } = useAuth()

  const [showNotifications, setShowNotifications] =
    useState(false)

  const notificationRef = useRef(null)

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* PAGE TITLE */}

      <h1 className="text-lg text-slate-800">
        {title}
      </h1>

      <div className="flex h-full items-center gap-10">

        {/* NOTIFICATION */}

        <div
          ref={notificationRef}
          className="relative flex h-10 w-10 items-center justify-center"
        >

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (previous) => !previous
              )
            }
            className="relative items-center justify-center cursor-pointer text-slate-600"
            aria-label="Notifications"
          >

            <Bell
              size={25}
              strokeWidth={1.75}
            />

            {/* UNREAD DOT */}

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#172554]" />
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
                      {unreadCount} unread notification
                      {unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Notifications */}

              <div className="max-h-[360px] overflow-y-auto">

                {notifications.length > 0 ? (
                  notifications.map(
                    (notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    )
                  )
                ) : (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    No notifications
                  </div>
                )}

              </div>

              {/* Panel footer */}

              <div className="border-t border-slate-200 px-5 py-3">

                <button
                  type="button"
                  className="text-xs font-medium text-[#19295F] hover:text-blue-700"
                >
                  Mark all as read
                </button>

              </div>

            </div>
          )}

        </div>

        {/* USER PROFILE */}

        <div className="flex cursor-pointer items-center gap-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172554] text-xs font-semibold text-white">
            {user?.initials || 'MR'}
          </div>

          <div className="leading-tight">

            <p className="text-sm font-semibold text-slate-800">
              {user?.name || 'Minindu R.'}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role || 'HR Manager'}
            </p>

          </div>

        </div>

      </div>

    </header>
  )
}


/*NOTIFICATION ITEM*/

function NotificationItem({ notification }) {
  const getIcon = () => {
    if (notification.type === 'success') {
      return (
        <CheckCircle2
          size={20}
          className="text-green-600"
        />
      )
    }

    if (notification.type === 'warning') {
      return (
        <AlertCircle
          size={20}
          className="text-orange-500"
        />
      )
    }

    return (
      <Bell
        size={20}
        className="text-blue-600"
      />
    )
  }

  return (
    <div
      className={`flex gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 ${
        notification.unread
          ? 'bg-blue-50/40'
          : 'bg-white'
      }`}
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

          {notification.unread && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          )}

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {notification.message}
        </p>

        <p className="mt-1.5 text-[11px] text-slate-400">
          {notification.time}
        </p>

      </div>

    </div>
  )
}