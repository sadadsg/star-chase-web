import { artistInfo } from '../data/rjlData'

export default function HeroBanner() {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(192,132,252,0.12))' }}>
            <span className="text-[28px] sm:text-[32px] font-bold gradient-text" style={{ fontFamily: "'Newsreader', serif" }}>伦</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight" style={{ fontFamily: "'Newsreader', serif", color: '#1E1B4B' }}>
              {artistInfo.name}
            </h1>
            <p className="text-[13px] sm:text-[14px] mt-0.5" style={{ color: '#6B7280' }}>{artistInfo.englishName} · {artistInfo.fansName}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[13px] font-semibold px-3 py-1.5 rounded-xl"
              style={{ color: '#7C3AED', background: 'rgba(139,92,246,0.1)' }}>
              {artistInfo.fansCount} 粉丝
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
