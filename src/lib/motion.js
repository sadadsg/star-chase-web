// 动效令牌与标准 variants —— 全项目唯一动效节奏来源
// 原则：动效表达因果而非装饰；出比进快；只动 transform/opacity/filter；
//      微过冲弹簧只用于「物理感」控件；全量经 reduced-motion 门控

// 唯一位移曲线（easeOutExpo，项目事实标准）
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

// 物理感控件弹簧（开关/滑块），微过冲
export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 30 }

// 选中态 ring，无过冲快速吸附
export const SPRING_SNAP = { type: 'spring', stiffness: 420, damping: 34 }

// 时长档（秒）
export const D = {
  micro: 0.15,
  enter: 0.35,
  reveal: 0.55,
  page: 0.3,
}

// 列表子项间隔（ui-ux-pro-max §7: 30-50ms）
export const STAGGER = 0.045

// 标准入场：上浮淡入
export const fadeUp = (distance = 12) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
})

// 签名入场：模糊聚焦（hero 大标题用）
export const blurIn = (distance = 14) => ({
  initial: { opacity: 0, y: distance, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
})

// 子项依次入场容器：staggerChildren + 总量 cap（超过 8 个子项后不再递增延迟）
export const staggerParent = (interval = STAGGER, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: interval,
      delayChildren,
    },
  },
})

export const staggerChild = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

// 发丝线划出（origin left）
export const hairlineDraw = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
}
