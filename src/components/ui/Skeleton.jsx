/**
 * 通用骨架屏组件
 * 用于加载状态的占位符
 */

// 基础骨架块
export function SkeletonBlock({ className = '', ...props }) {
  return (
    <div
      className={`bg-[#F0F3F8] rounded animate-pulse ${className}`}
      {...props}
    />
  )
}

// 文本行骨架
export function SkeletonText({ width = 'full', height = '4', className = '' }) {
  const widthClass = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
  }[width] || `w-${width}`

  return (
    <SkeletonBlock className={`h-${height} ${widthClass} ${className}`} />
  )
}

// 卡片骨架
export function SkeletonCard({ hasImage = true, lines = 3, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden border border-[#EDF0F5] ${className}`}>
      {hasImage && (
        <div className="aspect-video bg-[#F0F3F8] animate-pulse" />
      )}
      <div className="p-4 space-y-3">
        <SkeletonText width="3/4" height="4" />
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonText
            key={i}
            width={i === lines - 1 ? '1/2' : 'full'}
            height="3"
          />
        ))}
        <div className="flex justify-between">
          <SkeletonText width="16" height="3" />
          <SkeletonText width="20" height="3" />
        </div>
      </div>
    </div>
  )
}

// 列表项骨架
export function SkeletonListItem({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 border border-[#EDF0F5] flex items-center gap-4 ${className}`}>
      <SkeletonBlock className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonText width="3/4" height="4" />
        <SkeletonText width="1/2" height="3" />
      </div>
      <SkeletonBlock className="w-16 h-8 rounded-lg" />
    </div>
  )
}

// 日历骨架
export function SkeletonCalendar({ className = '' }) {
  return (
    <div className={className}>
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <SkeletonBlock className="w-8 h-8 rounded-lg" />
        <SkeletonBlock className="w-24 h-6 rounded" />
        <SkeletonBlock className="w-8 h-8 rounded-lg" />
      </div>

      {/* 星期头 */}
      <div className="grid grid-cols-7 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-4 mx-auto w-6" />
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className="h-16 rounded-lg"
            style={{ opacity: i < 7 || i > 28 ? 0.5 : 1 }}
          />
        ))}
      </div>
    </div>
  )
}

// 表格骨架
export function SkeletonTable({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#EDF0F5] overflow-hidden ${className}`}>
      {/* 表头 */}
      <div className="grid gap-4 p-4 border-b border-[#EDF0F5]" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBlock key={i} className="h-4 rounded" />
        ))}
      </div>

      {/* 表行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4 border-b border-[#EDF0F5] last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBlock
              key={colIndex}
              className="h-4 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// 网格骨架
export function SkeletonGrid({ count = 6, columns = 3, hasImage = true, className = '' }) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-3'

  return (
    <div className={`grid gap-3 ${gridClass} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasImage={hasImage} />
      ))}
    </div>
  )
}

export default SkeletonBlock
