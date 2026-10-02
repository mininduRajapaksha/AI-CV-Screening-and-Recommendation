const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

function getAuthHeaders() {
  const token = localStorage.getItem('cvision_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again shortly.')
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong.')
  }
  return payload
}

export const notificationApi = {
  /** Returns an array of notification objects derived from real DB data */
  getAll: () => request('/notifications'),

  /** Returns { count: number } — lightweight endpoint for badge polling */
  getCount: () => request('/notifications/count'),
}
