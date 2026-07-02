import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { artistInfo } from '../data/rjlData'

export default function HeroBanner() {
  const [typedText, setTypedText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const fullText = artistInfo.bio
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    // 检查减弱动画偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedText(fullText)
      setIsDone(true)
      return
    }

    let i = 0
    const START_DELAY = 400
    const CHAR_DELAY = 50

    const startTimer = setTimeout(() => {
      const timer = setInterval(() => {
        if (i <= fullText.length) {
          setTypedText(fullText.slice(0, i))
          i++
        } else {
          clearInterval(timer)
          setIsDone(true)
        }
      }, CHAR_DELAY)
      return () => clearInterval(timer)
    }, START_DELAY)

    return () => clearTimeout(startTimer)
  }, [fullText])

  return (
    <motion.div
      className="glass-warm rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
        {/* 居中头像 */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(192,132,252,0.1))' }}>
          <span className="text-[32px] sm:text-[36px] font-bold gradient-text font-serif-display">伦</span>
        </motion.div>

        {/* 艺人名 */}
        <h1 className="text-[26px] sm:text-[32px] font-bold tracking-tight mb-1.5 font-serif-display"
          style={{ color: '#1C1917' }}>
          {artistInfo.name}
        </h1>
        <p className="text-[13px] sm:text-[15px] mb-6" style={{ color: '#78716C' }}>
          {artistInfo.englishName} · {artistInfo.fansName}
        </p>

        {/* 打字机简介 */}
        <div className="max-w-md mx-auto min-h-[44px]">
          <p className="text-[13px] sm:text-[14px] leading-relaxed" style={{ color: '#57534E' }}>
            {typedText}
            <span className={`typewriter-caret ${isDone ? 'is-done' : ''}`} />
          </p>
        </div>

        {/* 粉丝数 + 标签 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium"
            style={{ background: 'rgba(139,92,246,0.08)', color: '#7C3AED', border: '1px solid rgba(139,92,246,0.12)' }}>
            {artistInfo.fansCount} 粉丝
          </span>
          {artistInfo.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-[12px]"
              style={{ background: 'rgba(255,255,255,0.5)', color: '#78716C', border: '1px solid rgba(255,255,255,0.4)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
