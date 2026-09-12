// 艺人与抓取配置的单一来源 —— fetch-data.cjs / fetch-weibo.cjs / extract-schedule.cjs / server 共用
// 新增艺人：在此追加一个条目即可，无需改任何抓取脚本

module.exports = {
  defaultArtistId: 'rjl',

  artists: [
    {
      id: 'rjl',
      name: '任嘉伦',
      englishName: 'Allen Ren',
      // 资讯匹配关键词：命中任一即视为该艺人相关
      keywords: [
        '任嘉伦', 'Allen Ren', '任国超', '嘉伦',
        '佳偶天成', '陆千乔', '暮色心约', '风与潮', '无忧渡', '深渊无间',
        '37·单枪匹马',
      ],
      // 行程正源：工作室微博（sina 镜像页免登录 SSR）
      weibo: {
        uid: '6135103753',
        accountName: '任嘉伦工作室',
        mirrorUrl: 'https://www.sina.cn/media/6135103753',
      },
      // 工作室帖文中值得做行程抽取的关键词
      schedulePostKeywords: ['行程', '嘉书', '日程', '档期', '日历'],
      // 工作室帖文并入资讯流的最大条数
      newsMaxPosts: 30,
    },
  ],

  // 行程类型关键词：按对象顺序命中即分类（先具体后宽泛）
  scheduleKeywords: {
    fanmeeting: ['演唱会', '音乐节', '见面会', '巡演', '签售', '生日会', '舞台', '演出'],
    filming: ['开机', '杀青', '拍摄', '剧组', '新剧', '定档', '开播', '追剧日历', '剧场', '锁定'],
    variety: ['综艺', '录制', '节目', '晚会', '春晚'],
    business: ['品牌', '代言', '发布会', '时装周', '秀场', '直播', '专辑', '杂志', '封面', '活动'],
  },

  typeNames: {
    filming: '影视拍摄',
    variety: '综艺录制',
    business: '商务活动',
    fanmeeting: '演出活动',
  },

  cities: [
    '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
    '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
    '昆明', '厦门', '福州', '合肥', '大理', '横店', '澳门', '香港',
    '台北', '米兰', '巴黎', '伦敦', '纽约', '东京', '首尔',
  ],

  // 资讯流保留窗口与容量
  news: {
    retentionDays: 90,
    maxItems: 60,
  },

  // 行程抽取
  extraction: {
    // 每次最多送去 GLM 的海报图张数（控制成本与 CI 时长）
    maxPicsPerRun: 2,
    // 月度行程图日期允许落在当前月份 ±N 个月内，超出视为幻觉丢弃
    dateWindowMonths: 1,
    // schedule.json 保留天数（过期行程出清）
    scheduleRetentionDays: 120,
  },
}
