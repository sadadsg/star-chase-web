import ScheduleCalendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'

const ICS_URL = 'https://sadadsg.github.io/star-chase-web/api/schedule.ics'

export default function SchedulePage() {
  return (
    <div style={{ background: '#fff' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="section-title m-0">行程日历</h1>
            <p className="text-[15px] mt-1.5 mb-8 m-0" style={{ color: '#6e6e73' }}>
              全部行程安排，点击日期查看详情
            </p>
          </div>
          <a
            href={ICS_URL.replace('https://', 'webcal://')}
            title="在 iPhone / Mac / Google 日历中一键订阅行程"
            className="btn-pill btn-pill-primary mb-8"
          >
            订阅到系统日历
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Sidebar />
          </div>
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ScheduleCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
