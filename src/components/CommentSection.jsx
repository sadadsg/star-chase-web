import Giscus from '@giscus/react'
import { useTheme } from '../hooks/useTheme'

// 粉丝讨论区：GitHub Discussions 驱动，零服务器成本
// repoId/categoryId 来自 giscus.app 配置（sadadsg/star-chase-web，General 分类）
// 注意：giscus App 需先在仓库安装（github.com/apps/giscus），未安装时该区域不显示内容。
export default function CommentSection() {
  const { resolved } = useTheme()

  return (
    <div className="mt-12" style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: 24 }}>
      <h3 className="text-[17px] font-semibold m-0 mb-1" style={{ letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
        粉丝讨论区
      </h3>
      <p className="text-[13px] m-0 mb-4" style={{ color: 'var(--color-text-muted)' }}>
        基于 GitHub Discussions，发言需登录 GitHub 账号
      </p>
      {/* giscus 主题是 iframe 内的，不吃站点 CSS 变量。
          切主题时用 key 强制重挂载，让它按新的 theme 重新初始化。 */}
      <Giscus
        key={resolved}
        repo="sadadsg/star-chase-web"
        repoId="R_kgDOS4kc_A"
        category="General"
        categoryId="DIC_kwDOS4kc_M4DFcrp"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolved === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
