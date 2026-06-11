import { cities } from '../../data/rjlData'

export default function CityPicker({ fromCity, onCityChange, destination, location, step = 2 }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full text-white text-[13px] font-bold flex items-center justify-center" style={{ background: '#7C3AED' }}>{step}</span>
        <h3 className="text-[16px] font-semibold" style={{ color: '#1E1B4B' }}>选择你的出发城市</h3>
      </div>
      <div className="text-[14px] mb-3" style={{ color: '#6B7280' }}>
        目的地：<span className="font-medium" style={{ color: '#1E1B4B' }}>{destination}</span>
        <span className="mx-2">·</span>
        {location}
      </div>
      <select value={fromCity} onChange={e => onCityChange(e.target.value)}
        className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-[15px] cursor-pointer"
        style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.4)', color: '#1E1B4B' }}>
        {cities.map(city => <option key={city} value={city}>{city}</option>)}
      </select>
    </div>
  )
}
