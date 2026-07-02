import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function AnimateOnScroll({
  children,
  delay = 0,
  y = 20,
  duration = 0.4,
  once = true,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-40px' })

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
