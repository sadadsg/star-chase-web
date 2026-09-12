import NewsFeed from '../components/NewsFeed'

export default function NewsPage() {
  return (
    <div style={{ background: '#fff' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="section-title m-0">新闻资讯</h1>
        <p className="text-[15px] mt-1.5 mb-8" style={{ color: '#6e6e73' }}>
          最新动态、影视资讯与时尚活动
        </p>
        <NewsFeed />
      </div>
    </div>
  )
}
