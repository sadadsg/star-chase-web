// 智谱 GLM 开放平台 API 封装（open.bigmodel.cn/v4，OpenAI 兼容格式）
// 环境变量：ZHIPU_API_KEY（必填才启用）、GLM_API_BASE、GLM_TEXT_MODEL、GLM_VISION_MODEL

const DEFAULT_BASE = process.env.GLM_API_BASE || 'https://open.bigmodel.cn/api/paas/v4'

function apiKey() {
  return process.env.ZHIPU_API_KEY || ''
}

function textModel() {
  return process.env.GLM_TEXT_MODEL || 'glm-4-flash'
}

function visionModel() {
  return process.env.GLM_VISION_MODEL || 'glm-4v-flash'
}

async function chat({ model, messages, timeoutMs = 90000, temperature = 0.1 }) {
  const key = apiKey()
  if (!key) throw new Error('ZHIPU_API_KEY 未配置')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${DEFAULT_BASE}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ model, messages, temperature }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`GLM HTTP ${res.status}: ${body.slice(0, 200)}`)
    }
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content
    if (typeof content !== 'string') throw new Error('GLM 响应缺少 content')
    return content
  } finally {
    clearTimeout(timer)
  }
}

// 从模型输出中提取 JSON（容忍 ```json 围栏与前后杂文）
function extractJSON(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : content
  const start = raw.search(/[[{]/)
  if (start === -1) throw new Error('输出中未找到 JSON')
  const opener = raw[start]
  const closer = opener === '[' ? ']' : '}'
  const end = raw.lastIndexOf(closer)
  if (end <= start) throw new Error('JSON 不完整')
  return JSON.parse(raw.slice(start, end + 1))
}

module.exports = { chat, extractJSON, apiKey, textModel, visionModel, DEFAULT_BASE }
