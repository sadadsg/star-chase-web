import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { artistInfo } from '../data/rjlData'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  const bioLines = artistInfo.bioFull ? artistInfo.bioFull.split('\n\n') : [artistInfo.bio]

  return (
    <aside className="sm:sticky sm:top-[68px]">
      <div className="glass-strong p-5 sm:p-6">
        <div className="text-center mb-5">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(192,132,252,0.1))' }}>
            <span className="text-[28px] gradient-text font-serif-display">伦</span>
          </div>
          <h2 className="text-xl font-bold font-serif-display" style={{ color: '#1C1917' }}>
            {artistInfo.name}
          </h2>
          <p className="text-[14px] mt-0.5" style={{ color: '#78716C' }}>{artistInfo.englishName}</p>
          {artistInfo.realName && (
            <p className="text-[13px]" style={{ color: '#A8A29E' }}>本名：{artistInfo.realName}</p>
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
              <span style={{ color: '#A8A29E' }}>{label}</span>
              <span className="text-right max-w-[60%]" style={{ color: '#44403C' }}>{value}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span style={{ color: '#A8A29E' }}>粉丝名</span>
            <span className="font-medium" style={{ color: '#E8A0BF' }}>{artistInfo.fansName}</span>
          </div>
        </div>

        {/* 人物简介 */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }}>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-2.5 font-serif-display" style={{ color: '#A8A29E' }}>人物简介</h3>
          <div className="text-[14px] leading-relaxed space-y-2" style={{ color: '#57534E' }}>
            <p>{bioLines[0]}</p>
            <AnimatePresence>
              {expanded && bioLines.slice(1).map((para, i) => (
                <motion.p
                  key={i + 1}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  {para}
                </motion.p>
              ))}
            </AnimatePresence>
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
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }}>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-2.5 font-serif-display" style={{ color: '#A8A29E' }}>代表作品</h3>
            <div className="space-y-1.5">
              {artistInfo.works.map((work, i) => (
                <div key={i} className="flex items-center justify-between text-[14px]">
                  <span className="font-medium" style={{ color: '#1C1917' }}>{work.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px]" style={{ color: '#A8A29E' }}>{work.role}</span>
                    <span className="text-[13px]" style={{ color: '#A8A29E' }}>{work.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 获奖记录 */}
        {artistInfo.awards && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }}>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-2.5 font-serif-display" style={{ color: '#A8A29E' }}>获奖记录</h3>
            <div className="space-y-1.5">
              {artistInfo.awards.map((award, i) => (
                <div key={i} className="text-[13px] leading-relaxed" style={{ color: '#57534E' }}>
                  {award}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }}>
          <div className="flex flex-wrap gap-1.5">
            {artistInfo.tags.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="px-2.5 py-1 rounded-lg text-[12px]"
                style={{ background: 'rgba(139,92,246,0.06)', color: '#57534E' }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* 夸克百科来源 */}
        {artistInfo.quarkUrl && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.35)' }}>
            <a
              href={artistInfo.quarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] transition-colors no-underline"
              style={{ color: '#A8A29E' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
