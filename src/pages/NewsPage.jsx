import NewsFeed from '../components/NewsFeed'

export default function NewsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>新闻资讯</h1>
        <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>任嘉伦最新动态、影视资讯、时尚活动一手掌握</p>
      </div>

      <NewsFeed />
    </div>
  )
}
