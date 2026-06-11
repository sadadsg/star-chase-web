/**
 * 城市选择组件
 * 用于选择出发城市
 */

import { cities } from '../../data/rjlData'

export default function CityPicker({
  fromCity,
  onCityChange,
  destination,
  location,
  step = 2,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EDF0F5]">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-[13px] font-bold flex items-center justify-center">
          {step}
        </span>
        <h3 className="text-[16px] font-semibold text-[#2D3748]">选择你的出发城市</h3>
      </div>
      <div className="text-[14px] text-[#8E99A8] mb-3">
        目的地：<span className="text-[#2D3748] font-medium">{destination}</span>
        <span className="mx-2">·</span>
        {location}
      </div>
      <select
        value={fromCity}
        onChange={e => onCityChange(e.target.value)}
        className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-[#EDF0F5] bg-[#F7F9FC] text-[#2D3748] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#93B4F5] focus:border-[#5B8DEF] cursor-pointer"
      >
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  )
}
