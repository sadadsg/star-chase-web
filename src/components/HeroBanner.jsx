import { artistInfo } from '../data/rjlData'

export default function HeroBanner() {
  return (
    <div className="glass rounded-3xl mb-8 overflow-hidden">
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="w-24 h-24 sm:w-[130px] sm:h-[130px] rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(192,132,252,0.15))' }}>
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
              style={{ fontFamily: "'Newsreader', serif", color: '#1E1B4B' }}
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
              <span className="text-[14px] font-semibold px-3 py-1 rounded-full"
                style={{ color: '#7C3AED', background: 'rgba(139,92,246,0.1)' }}>
                {artistInfo.fansCount} 粉丝
              </span>
              <span className="text-[14px] font-semibold px-3 py-1 rounded-full"
                style={{ color: '#2563EB', background: 'rgba(37,99,235,0.08)' }}>
                {artistInfo.birthplace}
              </span>
              <span className="text-[14px] font-semibold px-3 py-1 rounded-full"
                style={{ color: '#D97706', background: 'rgba(245,158,11,0.08)' }}>
                {artistInfo.constellation}
              </span>
              {artistInfo.height && (
                <span className="text-[14px] font-semibold px-3 py-1 rounded-full"
                  style={{ color: '#059669', background: 'rgba(16,185,129,0.08)' }}>
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
