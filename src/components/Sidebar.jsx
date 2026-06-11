import { useState } from 'react'
import { artistInfo } from '../data/rjlData'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  const bioLines = artistInfo.bioFull ? artistInfo.bioFull.split('\n\n') : [artistInfo.bio]

  return (
    <aside className="sticky top-[68px]">
      <div className="glass-strong p-5">
        <div className="text-center mb-4">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(192,132,252,0.1))' }}>
            <span className="text-[32px] gradient-text" style={{ fontFamily: "'Newsreader', serif" }}>伦</span>
          </div>
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "'Newsreader', serif", color: '#1E1B4B' }}
          >
            {artistInfo.name}
          </h2>
          <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>{artistInfo.englishName}</p>
          {artistInfo.realName && (
            <p className="text-[13px]" style={{ color: '#9CA3AF' }}>本名：{artistInfo.realName}</p>
          )}
        </div>

        <div className="space-y-2.5 text-[14px]">
          {[
            ['生日', artistInfo.birthday],
            ['星座', artistInfo.constellation],
            ['出生地', artistInfo.birthplace],
            ['身高', artistInfo.height],
            ['学历', artistInfo.education],
            ['经纪公司', artistInfo.agency],
          ].filter(([, v]) => v).map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#8E99A8]">{label}</span>
              <span className="text-[#2D3748] text-right max-w-[60%]">{value}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-[#8E99A8]">粉丝名</span>
            <span className="text-[#E8A0BF] font-medium">{artistInfo.fansName}</span>
          </div>
        </div>

        {/* 人物简介 */}
        <div className="mt-4 pt-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
          <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9CA3AF' }}>人物简介</h3>
          <div className="text-[14px] leading-relaxed space-y-2" style={{ color: '#4B5563' }}>
            {(expanded ? bioLines : bioLines.slice(0, 1)).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {bioLines.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[13px] font-medium transition-colors"
              style={{ color: '#7C3AED' }}
            >
              {expanded ? '收起' : '展开全部'}
            </button>
          )}
        </div>

        {/* 代表作品 */}
        {artistInfo.works && (
          <div className="mt-4 pt-3.5 style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#9CA3AF' }}>代表作品</h3>
            <div className="space-y-1.5">
              {artistInfo.works.map((work, i) => (
                <div key={i} className="flex items-center justify-between text-[14px]">
                  <span className="font-medium" style={{ color: '#1E1B4B' }}>{work.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px]" style={{ color: '#9CA3AF' }}>{work.role}</span>
                    <span className="text-[13px]" style={{ color: '#9CA3AF' }}>{work.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 获奖记录 */}
        {artistInfo.awards && (
          <div className="mt-4 pt-3.5 style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}">
            <h3 className="text-[13px] font-semibold text-[#8E99A8] uppercase tracking-wider mb-2.5">获奖记录</h3>
            <div className="space-y-1.5">
              {artistInfo.awards.map((award, i) => (
                <div key={i} className="text-[13px] text-[#5A6577] leading-relaxed">
                  {award}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="mt-4 pt-3.5 style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}">
          <div className="flex flex-wrap gap-1.5">
            {artistInfo.tags.map((tag, i) => (
              <span key={i} className="bg-[#F7F9FC] text-[#5A6577] px-2.5 py-1 rounded-md text-[13px]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 夸克百科来源 */}
        {artistInfo.quarkUrl && (
          <div className="mt-4 pt-3.5 style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}">
            <a
              href={artistInfo.quarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[#8E99A8] hover:text-[#6366F1] transition-colors no-underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>资料来源：夸克百科</span>
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}
