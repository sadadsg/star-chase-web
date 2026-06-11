import RouteCard from './RouteCard'

export default function RouteList({ routes, fromCity, destCity, date }) {
  if (!routes || routes.length === 0) return null

  return (
    <div>
      <h4 className="font-semibold text-[15px] mb-3" style={{ color: '#1E1B4B' }}>
        直达班次（共 {routes.length} 班）
      </h4>
      <div className="space-y-2">
        {routes.map((route, i) => (
          <RouteCard key={i} route={route} fromCity={fromCity} destCity={destCity} date={date} />
        ))}
      </div>
    </div>
  )
}
