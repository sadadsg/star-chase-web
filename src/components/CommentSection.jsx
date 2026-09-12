import Giscus from '@giscus/react'

// 粉丝讨论区：GitHub Discussions 驱动，零服务器成本
// repoId/categoryId 来自 giscus.app 配置（sadadsg/star-chase-web，General 分类）
export default function CommentSection() {
  return (
    <div className="mt-12" style={{ borderTop: '1px solid #d2d2d7', paddingTop: 24 }}>
      <h3 className="text-[17px] font-semibold m-0 mb-1" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
        粉丝讨论区
      </h3>
      <p className="text-[13px] m-0 mb-4" style={{ color: '#86868b' }}>
        基于 GitHub Discussions，发言需登录 GitHub 账号
      </p>
      <Giscus
        repo="sadadsg/star-chase-web"
        repoId="R_kgDOS4kc_A"
        category="General"
        categoryId="DIC_kwDOS4kc_M4DFcrp"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
