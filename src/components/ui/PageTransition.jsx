import { motion } from 'framer-motion'

const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const variants = {
  initial: { opacity: 0, y: reducedMotion ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
