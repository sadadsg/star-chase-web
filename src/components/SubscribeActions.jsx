import { useCallback, useState } from 'react'

const ICS_HTTPS = 'https://sadadsg.github.io/star-chase-web/api/schedule.ics'
const REPO = 'sadadsg/star-chase-web'

/**
 * 订阅与投稿入口组。
 *
 * 背景：ICS 订阅是本站最有价值的能力（一次订阅，CI 每小时自动更新），
 * 但原先只有一个入口，在侧边栏深处。这里把它提到页面主位置，
 * 并补上「信息有误」投稿和分享，全部零后端：
 *   - 订阅走 webcal:// 协议，iPhone/Mac/Google 日历一键订阅
 *   - 投稿跳转预填的 GitHub Issue，人工维护，契合「宁缺毋滥」
 *   - 分享用 Web Share API，移动端原生面板，降级为复制链接
 */
export default function SubscribeActions({ date, title, className = '' }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = 'https://sadadsg.github.io/star-chase-web/schedule'
  const shareText = title
    ? `${date || ''} ${title} — 嘉期如梦行程`
    : '嘉期如梦 · 任嘉伦官方行程聚合与日历'

  const onShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl })
        return
      } catch {
        // 用户取消分享：静默，不当成错误
        if (typeof navigator.share === 'function') {
          try { await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ }
        }
        return
      }
    }
    // 不支持 Web Share 的桌面浏览器：复制链接
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 剪贴板不可用（非 HTTPS 等），静默
    }
  }, [shareText, shareUrl])

  const reportHref = useCallback(() => {
    const body = [
      '请描述需要修正的内容：',
      '',
      '- 当前显示：',
      date ? `  ${date}${title ? ` ${title}` : ''}` : '',
      '- 应为：',
      '- 官方来源链接：',
      '',
      '（提交后由维护者核对官方发布再修改）',
    ].filter(Boolean).join('\n')
    return `https://github.com/${REPO}/issues/new?title=${encodeURIComponent('[行程纠错] 请补充或修正')}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent('correction')}`
  }, [date, title])

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <a
        href={ICS_HTTPS.replace('https://', 'webcal://')}
        title="在 iPhone / Mac / Google 日历中一键订阅，CI 每小时自动更新"
        className="btn-pill btn-pill-primary"
        style={{ fontSize: 13 }}
      >
        订阅到系统日历
      </a>
      <button type="button" onClick={onShare} className="btn-pill" style={{ fontSize: 13, cursor: 'pointer' }}>
        {copied ? '已复制链接' : '分享'}
      </button>
      <a
        href={reportHref}
        target="_blank"
        rel="noopener noreferrer"
        title="发现日期或城市有误？跳转 GitHub 提交，核对官方发布后修正"
        className="btn-pill"
        style={{ fontSize: 13 }}
      >
        信息有误？
      </a>
    </div>
  )
}
