import { artistInfo } from '../data/rjlData'

export default function HeroBanner() {
  return (
    <div className="gradient-hero rounded-2xl mb-8 overflow-hidden">
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="w-24 h-24 sm:w-[130px] sm:h-[130px] rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/60 flex-shrink-0">
            <span
              className="text-[36px] sm:text-[48px] font-bold gradient-text"
              style={{ fontFamily: "'Newsreader', serif" }}
            >
              伦
            </span>
          </div>

          <div className="min-w-0">
            <h1
              className="text-[30px] sm:text-[38px] font-bold tracking-tight mb-1 leading-tight"
              style={{ fontFamily: "'Newsreader', serif", color: '#881337' }}
            >
              {artistInfo.name}
            </h1>
            <p className="text-[15px] mb-1 tracking-wide" style={{ color: '#6B7280' }}>{artistInfo.englishName}</p>
            {artistInfo.realName && (
              <p className="text-[13px] mb-2" style={{ color: '#9CA3AF' }}>本名 {artistInfo.realName}</p>
            )}
            <p className="text-[14px] leading-relaxed max-w-lg hidden sm:block" style={{ color: '#6B7280' }}>
              {artistInfo.bio}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/80 text-[14px] font-semibold px-3 py-1 rounded-full" style={{ color: '#E11D48' }}>
                {artistInfo.fansCount} 粉丝
              </span>
              <span className="bg-white/80 text-[14px] font-semibold px-3 py-1 rounded-full" style={{ color: '#2563EB' }}>
                {artistInfo.birthplace}
              </span>
              <span className="bg-white/80 text-[14px] font-semibold px-3 py-1 rounded-full" style={{ color: '#D97706' }}>
                {artistInfo.constellation}
              </span>
              {artistInfo.height && (
                <span className="bg-white/80 text-[14px] font-semibold px-3 py-1 rounded-full" style={{ color: '#059669' }}>
                  {artistInfo.height}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
