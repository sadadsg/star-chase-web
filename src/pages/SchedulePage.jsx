import ScheduleCalendar from '../components/ScheduleCalendar'
import ScheduleAside from '../components/ScheduleAside'
import SubscribeActions from '../components/SubscribeActions'

export default function SchedulePage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="section-title m-0">行程日历</h1>
        <p className="text-[15px] mt-1.5 mb-4 m-0" style={{ color: 'var(--color-text-secondary)' }}>
          全部行程安排，点击日期查看详情
        </p>
        <div className="mb-8">
          <SubscribeActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ScheduleAside />
          </div>
          <div className="lg:col-span-3 order-1 lg:order-2">
            <ScheduleCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
