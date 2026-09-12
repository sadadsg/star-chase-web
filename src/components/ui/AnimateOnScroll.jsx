import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT_EXPO, STAGGER } from '../../lib/motion'

const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 滚动入场容器。两种用法：
// 1. 默认：整体 fadeUp（y 可调，可加 blur 聚焦）
// 2. stagger: true 时容器淡入的同时向 motion 子组件传播 staggerChildren
//    （子项需配 variants={staggerChild}）
export default function AnimateOnScroll({
  children,
  delay = 0,
  y = 14,
  duration = 0.5,
  once = true,
  stagger = false,
  staggerInterval = STAGGER,
  blur = false,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-40px' })

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const blurTarget = blur ? { filter: 'blur(0px)' } : {}
  const variants = {
    initial: { opacity: 0, y, ...(blur ? { filter: 'blur(10px)' } : {}) },
    animate: {
      opacity: 1,
      y: 0,
      ...blurTarget,
      transition: stagger
        ? { duration, ease: EASE_OUT_EXPO, staggerChildren: staggerInterval, delayChildren: delay }
        : { duration, delay, ease: EASE_OUT_EXPO },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
    >
      {children}
    </motion.div>
  )
}
