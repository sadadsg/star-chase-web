import { useLocalStorage } from '../hooks'
import { CITIES } from '../data/cities'

// 「我的城市」选择器（localStorage 持久化，免账号）
// 空值 = 未设置（就近匹配关闭）
export default function CityPicker({ className = '' }) {
  const [myCity, setMyCity] = useLocalStorage('my-city')

  return (
    <label className={`inline-flex items-center gap-1.5 m-0 ${className}`}
      style={{ fontSize: 13, color: '#6e6e73' }}>
      <span className="whitespace-nowrap">我的城市</span>
      <select
        value={myCity}
        onChange={e => setMyCity(e.target.value)}
        className="cursor-pointer"
        style={{
          fontSize: 13,
          padding: '5px 26px 5px 12px',
          borderRadius: 980,
          border: 'none',
          background: myCity ? 'rgba(0,113,227,0.08)' : '#f5f5f7',
          color: myCity ? '#0066cc' : '#1d1d1f',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236e6e73' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
        }}
      >
        <option value="">全部</option>
        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  )
}
