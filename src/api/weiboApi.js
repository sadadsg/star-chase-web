import { API_BASE } from '../config'

export async function fetchWeiboNews(count = 30) {
  try {
    const res = await fetch(`${API_BASE}/weibo/news?count=${count}`)
    if (!res.ok) return null
    const json = await res.json()
    if (json.data?.length > 0) return json.data
  } catch {
    // 后端未启动或网络异常，静默降级
  }
  return null
}

export async function fetchWeiboSchedule() {
  try {
    const res = await fetch(`${API_BASE}/weibo/schedule`)
    if (!res.ok) return null
    const json = await res.json()
    if (json.source === 'weibo' && json.data?.length > 0) return json.data
  } catch {
    // 静默降级
  }
  return null
}

export async function checkWeiboStatus() {
  try {
    const res = await fetch(`${API_BASE}/weibo/status`)
    if (!res.ok) return { configured: false, message: '请求失败' }
    return await res.json()
  } catch {
    return { configured: false, message: '后端未启动' }
  }
}
