import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { artistInfo } from '../data/rjlData'
import { EASE_OUT_EXPO } from '../lib/motion'

// 生日 ISO → 本地化「1989 年 4 月 11 日」
function localizeDate(iso) {
  const m = typeof iso === 'string' && iso.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  return m ? `${m[1]} 年 ${+m[2]} 月 ${+m[3]} 日` : iso
}

const hairline = '1px solid #d2d2d7'

// Apple 式规格卡：白底、发丝线分区、系统排版
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  const bioLines = artistInfo.bioFull ? artistInfo.bioFull.split('\n\n') : [artistInfo.bio]

  return (
    <aside className="sm:sticky sm:top-[60px]">
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #d2d2d7' }}>
        <div className="text-center mb-5">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ background: '#f5f5f7' }}>
            <span className="text-[28px] font-semibold" style={{ color: '#1d1d1f' }}>伦</span>
          </div>
          <h2 className="text-[21px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
            {artistInfo.name}
          </h2>
          <p className="text-[14px] mt-0.5 m-0" style={{ color: '#86868b' }}>{artistInfo.englishName}</p>
          {artistInfo.realName && (
            <p className="text-[13px] m-0" style={{ color: '#aeaeb2' }}>本名：{artistInfo.realName}</p>
          )}
        </div>

        <div style={{ borderTop: hairline }}>
          {[
            ['生日', localizeDate(artistInfo.birthday)],
            ['星座', artistInfo.constellation],
            ['出生地', artistInfo.birthplace],
            ['身高', artistInfo.height],
            ['学历', artistInfo.education],
            ['经纪公司', artistInfo.agency],
            ['粉丝名', artistInfo.fansName],
          ].filter(([, v]) => v).map(([label, value], i, arr) => (
            <div key={label} className="flex justify-between py-2.5 text-[14px]"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f0f0f2' : 'none' }}>
              <span className="flex-shrink-0 whitespace-nowrap" style={{ color: '#86868b' }}>{label}</span>
              <span className="text-right ml-4" style={{ color: '#1d1d1f' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 人物简介 */}
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>人物简介</h3>
          <div className="text-[14px] leading-relaxed" style={{ color: '#424245' }}>
            <p className="m-0">{bioLines[0]}</p>
            <AnimatePresence>
              {expanded && bioLines.slice(1).map((para, i) => (
                <motion.p
                  key={i + 1}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                  className="overflow-hidden m-0"
                >
                  {para}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>
          {bioLines.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0"
              style={{ color: '#0066cc' }}
            >
              {expanded ? '收起' : '展开全部'}
            </button>
          )}
        </div>

        {/* 代表作品 */}
        {artistInfo.works && (
          <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
            <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>代表作品</h3>
            <div className="space-y-1.5">
              {artistInfo.works.map((work, i) => (
                <div key={i} className="flex items-center justify-between text-[14px]">
                  <span className="font-medium" style={{ color: '#1d1d1f' }}>{work.title}</span>
                  <span className="text-[13px]" style={{ color: '#86868b' }}>{work.role} · {work.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 获奖记录 */}
        {artistInfo.awards && (
          <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
            <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>获奖记录</h3>
            <div className="space-y-1.5">
              {artistInfo.awards.map((award, i) => (
                <div key={i} className="text-[13px] leading-relaxed" style={{ color: '#424245' }}>
                  {award}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 标签 */}
        {artistInfo.tags && (
          <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
            <div className="flex flex-wrap gap-1.5">
              {artistInfo.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[12px]"
                  style={{ background: '#f5f5f7', color: '#424245' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 资料来源 */}
        {artistInfo.quarkUrl && (
          <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
            <a
              href={artistInfo.quarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-apple text-[13px]"
            >
              资料来源：夸克百科 <span className="chevron">›</span>
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}
