import NewsFeed from '../components/NewsFeed'

export default function NewsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#2D3748]">新闻资讯</h1>
        <p className="text-[#8E99A8] text-[14px] mt-0.5">任嘉伦最新动态、影视资讯、时尚活动一手掌握</p>
      </div>

      <NewsFeed />
    </div>
  )
}
