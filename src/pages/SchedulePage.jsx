import ScheduleCalendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'

export default function SchedulePage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>行程日历</h1>
        <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>查看任嘉伦的全部行程安排，点击日期查看详情</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Sidebar />
        </div>
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="glass p-5">
            <ScheduleCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
