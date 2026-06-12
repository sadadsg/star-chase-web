const BASE_URL = import.meta.env.VITE_API_BASE || 'https://sadadsg.github.io/star-chase-web/api'

export async function fetchSchedule() {
  try {
    const res = await fetch(`${BASE_URL}/schedule.json`)
    if (!res.ok) return { data: [], total: 0 }
    return await res.json()
  } catch {
    return { data: [], total: 0 }
  }
}

export async function fetchNews(count = 30) {
  try {
    const res = await fetch(`${BASE_URL}/news.json`)
    if (!res.ok) return { data: [], total: 0 }
    const json = await res.json()
    return { ...json, data: json.data.slice(0, count) }
  } catch {
    return { data: [], total: 0 }
  }
}

export async function fetchEvents() {
  try {
    const res = await fetch(`${BASE_URL}/events.json`)
    if (!res.ok) return { data: [], total: 0 }
    return await res.json()
  } catch {
    return { data: [], total: 0 }
  }
}
