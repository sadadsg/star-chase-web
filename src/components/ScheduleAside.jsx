import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { artistInfo } from '../data/rjlData'
import { useLocalStorage } from '../hooks'
import { fetchSchedule } from '../api/dataApi'
import { EASE_OUT_EXPO } from '../lib/motion'

const ICS_URL = 'https://sadadsg.github.io/star-chase-web/api/schedule.ics'
const hairline = '1px solid #d2d2d7'

// 生日 ISO → 本地化
function localizeDate(iso) {
  const m = typeof iso === 'string' && iso.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  return m ? `${m[1]} 年 ${+m[2]} 月 ${+m[3]} 日` : iso
}

function daysLater(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (isNaN(d.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d - today) / 86400000)
  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  return diff > 0 ? `${diff} 天后` : null
}

// 行程页左栏：行程速览（下一场/本月/城市命中/订阅）+ 完整资料折叠抽屉
// 替代原「完整艺人档案长卡」，高度与右侧月历平衡
export default function ScheduleAside() {
  const [expanded, setExpanded] = useState(false)
  const [myCity] = useLocalStorage('my-city')
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchSchedule().then(result => {
      if (!cancelled) setSchedule(result.data || [])
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const nextEvent = useMemo(() => {
    const now = new Date()
    return schedule
      .filter(s => new Date(s.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null
  }, [schedule])

  const monthCount = useMemo(() => {
    const prefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    return schedule.filter(s => s.date && s.date.startsWith(prefix)).length
  }, [schedule])

  const cityCount = myCity ? schedule.filter(s => s.city === myCity).length : 0
  const countdown = nextEvent ? daysLater(nextEvent.date) : null
  const bioLines = artistInfo.bioFull ? artistInfo.bioFull.split('\n\n') : [artistInfo.bio]

  return (
    <aside className="sm:sticky sm:top-[60px]">
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #d2d2d7' }}>
        {/* 身份条 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f5f5f7' }}>
            <span className="text-[18px] font-semibold" style={{ color: '#1d1d1f' }}>伦</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[16px] m-0" style={{ color: '#1d1d1f' }}>{artistInfo.name}</p>
            <p className="text-[13px] m-0" style={{ color: '#86868b' }}>{artistInfo.englishName} · {artistInfo.fansName}</p>
          </div>
        </div>

        {/* 下一场 */}
        <div className="rounded-xl p-3.5 mb-3" style={{ background: '#f5f5f7' }}>
          <p className="text-[12px] font-medium m-0 mb-1" style={{ color: '#86868b' }}>下一场</p>
          {nextEvent ? (
            <>
              <p className="font-semibold text-[14px] m-0 mb-0.5 truncate" style={{ color: '#1d1d1f' }}>
                {nextEvent.title}
              </p>
              <p className="text-[13px] m-0" style={{ color: '#6e6e73' }}>
                {nextEvent.date.slice(5).replace('-', '.')} {nextEvent.typeName}
                {nextEvent.city && nextEvent.city !== '待定' ? ` · ${nextEvent.city}` : ''}
                {countdown && <span style={{ color: '#0066cc', fontWeight: 500 }}> · {countdown}</span>}
              </p>
            </>
          ) : (
            <p className="text-[14px] m-0" style={{ color: '#6e6e73' }}>暂无待来的行程</p>
          )}
        </div>

        {/* 本月 / 城市统计 */}
        <div className="flex items-center justify-between text-[13px] mb-4" style={{ color: '#6e6e73' }}>
          <span>本月 <span className="font-semibold" style={{ color: '#1d1d1f' }}>{monthCount}</span> 条行程</span>
          {myCity && (
            <span>
              你的城市 <span className="font-semibold" style={{ color: cityCount > 0 ? '#0066cc' : '#1d1d1f' }}>{cityCount}</span> 条
            </span>
          )}
        </div>

        {/* 订阅入口 */}
        <a
          href={ICS_URL.replace('https://', 'webcal://')}
          title="在 iPhone / Mac / Google 日历中一键订阅行程"
          className="btn-pill btn-pill-primary w-full"
        >
          订阅到系统日历
        </a>

        {/* 完整资料折叠抽屉 */}
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between bg-transparent border-none p-0 cursor-pointer"
            style={{ fontSize: 14, color: '#1d1d1f' }}
          >
            <span className="font-medium">完整资料</span>
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
              className="inline-block"
              style={{ color: '#86868b', fontSize: 12 }}
            >
              ▸
            </motion.span>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                className="overflow-hidden"
              >
                <ProfileDetails bioLines={bioLines} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  )
}

// 原档案内容（信息行/简介/作品/获奖/标签/来源），收纳在折叠抽屉内
function ProfileDetails({ bioLines }) {
  const [bioExpanded, setBioExpanded] = useState(false)

  return (
    <div className="pt-4">
      <div>
        {[
          ['生日', localizeDate(artistInfo.birthday)],
          ['星座', artistInfo.constellation],
          ['出生地', artistInfo.birthplace],
          ['身高', artistInfo.height],
          ['学历', artistInfo.education],
          ['经纪公司', artistInfo.agency],
          ['粉丝名', artistInfo.fansName],
        ].filter(([, v]) => v).map(([label, value], i, arr) => (
          <div key={label} className="flex justify-between py-2.5 text-[14px]"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid #f0f0f2' : 'none' }}>
            <span className="flex-shrink-0 whitespace-nowrap" style={{ color: '#86868b' }}>{label}</span>
            <span className="text-right ml-4" style={{ color: '#1d1d1f' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* 人物简介 */}
      <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
        <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>人物简介</h3>
        <div className="text-[14px] leading-relaxed" style={{ color: '#424245' }}>
          <p className="m-0">{bioLines[0]}</p>
          <AnimatePresence>
            {bioExpanded && bioLines.slice(1).map((para, i) => (
              <motion.p
                key={i + 1}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                className="overflow-hidden m-0"
              >
                {para}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        {bioLines.length > 1 && (
          <button
            onClick={() => setBioExpanded(!bioExpanded)}
            className="mt-2 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0"
            style={{ color: '#0066cc' }}
          >
            {bioExpanded ? '收起' : '展开全部'}
          </button>
        )}
      </div>

      {/* 代表作品 */}
      {artistInfo.works && (
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>代表作品</h3>
          <div className="space-y-1.5">
            {artistInfo.works.map((work, i) => (
              <div key={i} className="flex items-center justify-between text-[14px]">
                <span className="font-medium" style={{ color: '#1d1d1f' }}>{work.title}</span>
                <span className="text-[13px]" style={{ color: '#86868b' }}>{work.role} · {work.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 获奖记录 */}
      {artistInfo.awards && (
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <h3 className="text-[13px] font-semibold m-0 mb-2" style={{ color: '#86868b' }}>获奖记录</h3>
          <div className="space-y-1.5">
            {artistInfo.awards.map((award, i) => (
              <div key={i} className="text-[13px] leading-relaxed" style={{ color: '#424245' }}>
                {award}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 标签 */}
      {artistInfo.tags && (
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <div className="flex flex-wrap gap-1.5">
            {artistInfo.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[12px]"
                style={{ background: '#f5f5f7', color: '#424245' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 资料来源 */}
      {artistInfo.quarkUrl && (
        <div className="mt-5 pt-4" style={{ borderTop: hairline }}>
          <a href={artistInfo.quarkUrl} target="_blank" rel="noopener noreferrer" className="link-apple text-[13px]">
            资料来源：夸克百科 <span className="chevron">›</span>
          </a>
        </div>
      )}
    </div>
  )
}
