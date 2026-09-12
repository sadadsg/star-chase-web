import NewsFeed from '../components/NewsFeed'

export default function NewsPage() {
  return (
    <div style={{ background: '#fff' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="section-title m-0">新闻资讯</h1>
            <p className="text-[15px] mt-1.5 mb-8 m-0" style={{ color: '#6e6e73' }}>
              最新动态、影视资讯与时尚活动
            </p>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}api/rss.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-apple text-[14px] mb-8"
          >
            RSS 订阅 <span className="chevron">›</span>
          </a>
        </div>
        <NewsFeed />
      </div>
    </div>
  )
}
