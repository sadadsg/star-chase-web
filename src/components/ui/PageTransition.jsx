import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from '../../lib/motion'

const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 非对称节奏 + 方向感知（ui-ux-pro-max §7: exit-faster-than-enter / hierarchy-motion）
// direction: 1 = 前进（从下进入、向上退出）；-1 = 返回（从上进入、向下退出）
const variants = {
  initial: (direction) => ({
    opacity: 0,
    y: reducedMotion ? 0 : (direction >= 0 ? 12 : -12),
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EASE_OUT_EXPO },
  },
  exit: (direction) => ({
    opacity: 0,
    y: reducedMotion ? 0 : (direction >= 0 ? -6 : 6),
    transition: { duration: 0.18, ease: 'easeOut' },
  }),
}

export default function PageTransition({ children, direction = 1 }) {
  return (
    <motion.div
      variants={variants}
      custom={direction}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
