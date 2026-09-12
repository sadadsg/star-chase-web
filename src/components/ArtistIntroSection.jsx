import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { artistInfo } from '../data/rjlData'
import { AnimateOnScroll } from './ui'
import { EASE_OUT_EXPO, staggerChild } from '../lib/motion'

// 生日 ISO → 本地化
function localizeDate(iso) {
  const m = typeof iso === 'string' && iso.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  return m ? `${m[1]} 年 ${+m[2]} 月 ${+m[3]} 日` : iso
}

// 首页「关于任嘉伦」收尾分段：左身份+规格，右简介+代表作
function ArtistIntroSection() {
  const [bioExpanded, setBioExpanded] = useState(false)
  const bioLines = artistInfo.bioFull ? artistInfo.bioFull.split('\n\n') : [artistInfo.bio]

  return (
    <section style={{ background: '#fff', padding: '64px 0 80px' }}>
      <div className="container-apple">
        <AnimateOnScroll y={10} duration={0.45}>
          <h2 className="section-title m-0 mb-2">关于任嘉伦</h2>
          <motion.div
            className="h-px mb-8 origin-left"
            style={{ background: '#d2d2d7' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          />
        </AnimateOnScroll>

        <AnimateOnScroll stagger staggerInterval={0.06} y={0} duration={0.45}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* 左：身份 + 规格 */}
            <motion.div variants={staggerChild}>
              <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f5f5f7' }}>
                  <span className="text-[28px] font-semibold" style={{ color: '#1d1d1f' }}>伦</span>
                </div>
                <div className="md:text-left md:mt-4 text-center md:text-left">
                  <p className="text-[21px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
                    {artistInfo.name}
                  </p>
                  <p className="text-[14px] m-0 mt-0.5" style={{ color: '#86868b' }}>
                    {artistInfo.englishName}{artistInfo.realName ? ` · 本名 ${artistInfo.realName}` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-6 hidden md:block">
                {[
                  ['生日', localizeDate(artistInfo.birthday)],
                  ['出生地', artistInfo.birthplace],
                  ['星座', artistInfo.constellation],
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
            </motion.div>

            {/* 右：简介 + 代表作品 */}
            <motion.div variants={staggerChild} className="md:col-span-2">
              <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>人物简介</h3>
              <div className="text-[15px] leading-relaxed" style={{ color: '#424245' }}>
                <p className="m-0">{bioLines[0]}</p>
                <AnimatePresence>
                  {bioExpanded && bioLines.slice(1).map((para, i) => (
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
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="mt-2 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0"
                  style={{ color: '#0066cc' }}
                >
                  {bioExpanded ? '收起' : '展开全部'}
                </button>
              )}

              {artistInfo.works && (
                <div className="mt-6">
                  <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>代表作品</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {artistInfo.works.map((work, i) => (
                      <div key={i} className="flex items-center justify-between text-[14px] py-1.5"
                        style={{ borderBottom: '1px solid #f0f0f2' }}>
                        <span className="font-medium" style={{ color: '#1d1d1f' }}>{work.title}</span>
                        <span className="text-[13px] flex-shrink-0 ml-3" style={{ color: '#86868b' }}>{work.role} · {work.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {artistInfo.tags && (
                <div className="flex flex-wrap gap-1.5 mt-6">
                  {artistInfo.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[12px]"
                      style={{ background: '#f5f5f7', color: '#424245' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}

export default ArtistIntroSection
