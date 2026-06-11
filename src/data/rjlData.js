// ===== 枢纽城市间交通数据 =====
// 从枢纽城市到活动城市的航班/高铁
export const hubToDestRoutes = {
  '北京': {
    flights: [
      { airline: '中国国航', flightNo: 'CA1502', depart: '07:30', arrive: '10:05', duration: '2h35m', price: 1280, from: '北京首都' },
      { airline: '东方航空', flightNo: 'MU5101', depart: '08:50', arrive: '11:20', duration: '2h30m', price: 1150, from: '北京首都' },
      { airline: '南方航空', flightNo: 'CZ3102', depart: '13:15', arrive: '15:50', duration: '2h35m', price: 980, from: '北京大兴' },
      { airline: '海南航空', flightNo: 'HU7602', depart: '16:00', arrive: '18:30', duration: '2h30m', price: 1050, from: '北京首都' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G2', depart: '06:36', arrive: '11:18', duration: '4h42m', price: 553, from: '北京南', seats: '二等座' },
      { type: '高铁', trainNo: 'G104', depart: '08:00', arrive: '13:12', duration: '5h12m', price: 553, from: '北京南', seats: '二等座' },
      { type: '高铁', trainNo: 'G116', depart: '10:20', arrive: '15:33', duration: '5h13m', price: 553, from: '北京南', seats: '二等座' },
    ],
  },
  '上海': {
    flights: [
      { airline: '中国国航', flightNo: 'CA1515', depart: '07:00', arrive: '09:25', duration: '2h25m', price: 1180, from: '上海虹桥' },
      { airline: '东方航空', flightNo: 'MU5106', depart: '09:30', arrive: '11:55', duration: '2h25m', price: 1050, from: '上海虹桥' },
      { airline: '南方航空', flightNo: 'CZ3108', depart: '14:00', arrive: '16:30', duration: '2h30m', price: 890, from: '上海浦东' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G21', depart: '07:05', arrive: '12:15', duration: '5h10m', price: 626, from: '上海虹桥', seats: '二等座' },
      { type: '高铁', trainNo: 'G163', depart: '09:17', arrive: '14:28', duration: '5h11m', price: 626, from: '上海虹桥', seats: '二等座' },
    ],
  },
  '广州': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ3101', depart: '07:20', arrive: '10:30', duration: '3h10m', price: 1080, from: '广州白云' },
      { airline: '深圳航空', flightNo: 'ZH9102', depart: '09:40', arrive: '12:45', duration: '3h05m', price: 960, from: '广州白云' },
      { airline: '海南航空', flightNo: 'HU7201', depart: '14:30', arrive: '17:40', duration: '3h10m', price: 880, from: '广州白云' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G72', depart: '08:05', arrive: '16:48', duration: '8h43m', price: 862, from: '广州南', seats: '二等座' },
      { type: '高铁', trainNo: 'G66', depart: '10:00', arrive: '18:36', duration: '8h36m', price: 862, from: '广州南', seats: '二等座' },
    ],
  },
  '成都': {
    flights: [
      { airline: '四川航空', flightNo: '3U8901', depart: '08:00', arrive: '10:50', duration: '2h50m', price: 960, from: '成都天府' },
      { airline: '成都航空', flightNo: 'EU6671', depart: '11:30', arrive: '14:25', duration: '2h55m', price: 880, from: '成都天府' },
      { airline: '中国国航', flightNo: 'CA4101', depart: '15:00', arrive: '17:40', duration: '2h40m', price: 1020, from: '成都天府' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G308', depart: '07:00', arrive: '15:10', duration: '8h10m', price: 780, from: '成都东', seats: '二等座' },
      { type: '高铁', trainNo: 'G572', depart: '09:30', arrive: '17:55', duration: '8h25m', price: 780, from: '成都东', seats: '二等座' },
    ],
  },
}

// 从其他城市到枢纽城市的交通（用于中转）
export const originToHubRoutes = {
  '广州': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ3101', depart: '07:00', arrive: '09:30', duration: '2h30m', price: 880, from: '广州白云' },
      { airline: '东方航空', flightNo: 'MU5302', depart: '09:15', arrive: '11:45', duration: '2h30m', price: 780, from: '广州白云' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G72', depart: '08:00', arrive: '14:10', duration: '6h10m', price: 528, from: '广州南', seats: '二等座' },
    ],
  },
  '深圳': {
    flights: [
      { airline: '深圳航空', flightNo: 'ZH9101', depart: '07:30', arrive: '10:10', duration: '2h40m', price: 920, from: '深圳宝安' },
      { airline: '南方航空', flightNo: 'CZ3156', depart: '10:00', arrive: '12:35', duration: '2h35m', price: 850, from: '深圳宝安' },
      { airline: '海南航空', flightNo: 'HU7102', depart: '14:20', arrive: '16:55', duration: '2h35m', price: 780, from: '深圳宝安' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G80', depart: '08:25', arrive: '14:55', duration: '6h30m', price: 553, from: '深圳北', seats: '二等座' },
    ],
  },
  '杭州': {
    flights: [
      { airline: '厦门航空', flightNo: 'MF8152', depart: '07:40', arrive: '09:55', duration: '2h15m', price: 750, from: '杭州萧山' },
      { airline: '东方航空', flightNo: 'MU5138', depart: '11:00', arrive: '13:10', duration: '2h10m', price: 680, from: '杭州萧山' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G34', depart: '08:15', arrive: '12:40', duration: '4h25m', price: 538, from: '杭州东', seats: '二等座' },
      { type: '高铁', trainNo: 'G164', depart: '10:30', arrive: '15:00', duration: '4h30m', price: 538, from: '杭州东', seats: '二等座' },
    ],
  },
  '南京': {
    flights: [
      { airline: '东方航空', flightNo: 'MU2851', depart: '08:00', arrive: '10:15', duration: '2h15m', price: 720, from: '南京禄口' },
      { airline: '深圳航空', flightNo: 'ZH9555', depart: '12:30', arrive: '14:45', duration: '2h15m', price: 650, from: '南京禄口' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G106', depart: '07:50', arrive: '11:45', duration: '3h55m', price: 463, from: '南京南', seats: '二等座' },
      { type: '高铁', trainNo: 'G148', depart: '09:25', arrive: '13:22', duration: '3h57m', price: 463, from: '南京南', seats: '二等座' },
    ],
  },
  '武汉': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ3131', depart: '07:20', arrive: '09:30', duration: '2h10m', price: 680, from: '武汉天河' },
      { airline: '东方航空', flightNo: 'MU2511', depart: '11:40', arrive: '13:50', duration: '2h10m', price: 620, from: '武汉天河' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G516', depart: '08:00', arrive: '11:20', duration: '3h20m', price: 428, from: '武汉', seats: '二等座' },
    ],
  },
  '重庆': {
    flights: [
      { airline: '四川航空', flightNo: '3U8801', depart: '07:50', arrive: '10:00', duration: '2h10m', price: 720, from: '重庆江北' },
      { airline: '华夏航空', flightNo: 'G52601', depart: '13:00', arrive: '15:10', duration: '2h10m', price: 650, from: '重庆江北' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G308', depart: '08:30', arrive: '12:45', duration: '4h15m', price: 463, from: '重庆西', seats: '二等座' },
    ],
  },
  '西安': {
    flights: [
      { airline: '东方航空', flightNo: 'MU2151', depart: '07:30', arrive: '09:45', duration: '2h15m', price: 680, from: '西安咸阳' },
      { airline: '海南航空', flightNo: 'HU7531', depart: '12:00', arrive: '14:15', duration: '2h15m', price: 620, from: '西安咸阳' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G88', depart: '08:00', arrive: '12:30', duration: '4h30m', price: 515, from: '西安北', seats: '二等座' },
    ],
  },
  '长沙': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ3122', depart: '07:40', arrive: '09:20', duration: '1h40m', price: 580, from: '长沙黄花' },
      { airline: '厦门航空', flightNo: 'MF8216', depart: '11:30', arrive: '13:10', duration: '1h40m', price: 520, from: '长沙黄花' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G506', depart: '08:00', arrive: '10:50', duration: '2h50m', price: 314, from: '长沙南', seats: '二等座' },
    ],
  },
  '天津': {
    flights: [
      { airline: '天津航空', flightNo: 'GS7571', depart: '08:10', arrive: '10:20', duration: '2h10m', price: 650, from: '天津滨海' },
    ],
    trains: [
      { type: '高铁', trainNo: 'C2002', depart: '06:30', arrive: '07:00', duration: '30m', price: 55, from: '天津南', seats: '二等座' },
    ],
  },
  '苏州': {
    trains: [
      { type: '高铁', trainNo: 'G7032', depart: '07:00', arrive: '07:25', duration: '25m', price: 39.5, from: '苏州北', seats: '二等座' },
      { type: '高铁', trainNo: 'G7044', depart: '09:15', arrive: '09:42', duration: '27m', price: 39.5, from: '苏州北', seats: '二等座' },
    ],
  },
  '青岛': {
    flights: [
      { airline: '山东航空', flightNo: 'SC4651', depart: '07:00', arrive: '08:50', duration: '1h50m', price: 680, from: '青岛胶东' },
      { airline: '东方航空', flightNo: 'MU5251', depart: '10:30', arrive: '12:20', duration: '1h50m', price: 620, from: '青岛胶东' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G186', depart: '07:30', arrive: '12:50', duration: '5h20m', price: 520, from: '青岛北', seats: '二等座' },
    ],
  },
  '大连': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ6425', depart: '07:30', arrive: '09:10', duration: '1h40m', price: 650, from: '大连周水子' },
      { airline: '海南航空', flightNo: 'HU7107', depart: '11:00', arrive: '12:40', duration: '1h40m', price: 580, from: '大连周水子' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G476', depart: '07:40', arrive: '13:30', duration: '5h50m', price: 553, from: '大连北', seats: '二等座' },
    ],
  },
  '郑州': {
    flights: [
      { airline: '南方航空', flightNo: 'CZ3176', depart: '07:30', arrive: '09:00', duration: '1h30m', price: 550, from: '郑州新郑' },
      { airline: '西部航空', flightNo: 'PN6293', depart: '11:30', arrive: '13:00', duration: '1h30m', price: 480, from: '郑州新郑' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G90', depart: '08:00', arrive: '10:35', duration: '2h35m', price: 309, from: '郑州东', seats: '二等座' },
    ],
  },
  '昆明': {
    flights: [
      { airline: '东方航空', flightNo: 'MU5701', depart: '07:00', arrive: '09:30', duration: '2h30m', price: 780, from: '昆明长水' },
      { airline: '祥鹏航空', flightNo: '8L9901', depart: '11:00', arrive: '13:30', duration: '2h30m', price: 680, from: '昆明长水' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G404', depart: '08:00', arrive: '17:50', duration: '9h50m', price: 960, from: '昆明南', seats: '二等座' },
    ],
  },
  '厦门': {
    flights: [
      { airline: '厦门航空', flightNo: 'MF8101', depart: '07:15', arrive: '09:30', duration: '2h15m', price: 750, from: '厦门高崎' },
      { airline: '山东航空', flightNo: 'SC4951', depart: '12:00', arrive: '14:15', duration: '2h15m', price: 680, from: '厦门高崎' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G324', depart: '08:20', arrive: '14:15', duration: '5h55m', price: 586, from: '厦门北', seats: '二等座' },
    ],
  },
  '福州': {
    flights: [
      { airline: '厦门航空', flightNo: 'MF8107', depart: '07:30', arrive: '09:50', duration: '2h20m', price: 720, from: '福州长乐' },
      { airline: '东方航空', flightNo: 'MU5593', depart: '11:30', arrive: '13:50', duration: '2h20m', price: 650, from: '福州长乐' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G56', depart: '08:00', arrive: '13:00', duration: '5h00m', price: 541, from: '福州', seats: '二等座' },
    ],
  },
  '合肥': {
    flights: [
      { airline: '东方航空', flightNo: 'MU5471', depart: '07:45', arrive: '09:30', duration: '1h45m', price: 580, from: '合肥新桥' },
      { airline: '幸福航空', flightNo: 'JR1501', depart: '12:15', arrive: '14:00', duration: '1h45m', price: 520, from: '合肥新桥' },
    ],
    trains: [
      { type: '高铁', trainNo: 'G262', depart: '08:00', arrive: '11:10', duration: '3h10m', price: 353, from: '合肥南', seats: '二等座' },
    ],
  },
}

// 任嘉伦模拟数据
export const artistInfo = {
  id: 'rjl',
  name: '任嘉伦',
  englishName: 'Allen Ren',
  realName: '任国超',
  avatar: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=300&fit=crop',
  banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=500&fit=crop',
  birthday: '1989-04-11',
  constellation: '白羊座',
  birthplace: '山东青岛',
  height: '178cm',
  education: '毕业于山东省青岛艺术学校',
  agency: '欢瑞世纪',
  weibo: '@任嘉伦Allen',
  fansName: '嘉人',
  fansCount: '3682万',
  bio: '中国内地男演员、歌手。代表作《锦衣之下》《周生如故》《一生一世》《请君》《暮色心约》等。',
  bioFull: '任嘉伦，本名任国超，1989年4月11日出生于山东省青岛市，中国内地男演员、歌手。\n\n任嘉伦自幼练习乒乓球，曾是山东省乒乓球队队员，后因伤退役。2009年参加《先声夺金》选秀节目出道，2011年加入中韩组合并赴韩训练。2014年回国后开始参演影视作品。\n\n2017年，任嘉伦凭借古装剧《大唐荣耀》中广平王李俶一角走红，其俊朗的古装扮圈和深情的演绎赢得大量粉丝。此后陆续主演《天乩之白蛇传说》《锦衣之下》《暮白首》《周生如故》《一生一世》《请君》《暮色心约》《与凤行》等多部热播剧，成为古装剧领域的顶流演员。\n\n除演戏外，任嘉伦也活跃于音乐和综艺领域，发行多首个人单曲，参加《快乐大本营》《你好星期六》《现在就出发》《披荆斩棘的哥哥》等综艺节目，展现出多才多艺的一面。',
  quarkUrl: 'https://baike.quark.cn/w/任嘉伦',
  tags: ['演员', '歌手', '白羊座', '青岛', '古装', '乒乓球'],
  works: [
    { title: '大唐荣耀', year: 2017, role: '李俶', type: '电视剧' },
    { title: '锦衣之下', year: 2019, role: '陆绎', type: '电视剧' },
    { title: '周生如故', year: 2021, role: '周生辰', type: '电视剧' },
    { title: '一生一世', year: 2021, role: '周生辰', type: '电视剧' },
    { title: '请君', year: 2024, role: '陆炎', type: '电视剧' },
    { title: '暮色心约', year: 2025, role: '祁连山', type: '电视剧' },
    { title: '与凤行', year: 2025, role: '行止', type: '电视剧' },
    { title: '长风破浪', year: 2026, role: '待定', type: '电视剧（拍摄中）' },
  ],
  recentWorks: [
    { title: '暮色心约', year: 2025, role: '祁连山', type: '电视剧' },
    { title: '请君', year: 2024, role: '陆炎', type: '电视剧' },
    { title: '与凤行', year: 2024, role: '友情出演', type: '电视剧' },
  ],
  awards: [
    '2025 微博之夜 年度品质演员',
    '2025 金鹰奖 观众最喜爱男演员（提名）',
    '2021 国剧盛典 年度人气男演员',
    '2020 腾讯视频星光大赏 年度品质电视剧演员',
  ]
}

export const scheduleList = [
  // ===== 2026年2月 =====
  {
    id: 1, date: '2026-02-03', type: 'filming', typeName: '影视拍摄',
    title: '《暮色心约》补拍', location: '上海松江影视基地', city: '上海',
    description: '都市情感剧《暮色心约》部分室内戏份补拍', time: '全天'
  },
  {
    id: 2, date: '2026-02-04', type: 'filming', typeName: '影视拍摄',
    title: '《暮色心约》补拍', location: '上海松江影视基地', city: '上海',
    description: '继续补拍，今日重点拍摄结局戏份', time: '全天'
  },
  {
    id: 3, date: '2026-02-10', type: 'variety', typeName: '综艺录制',
    title: '央视春晚彩排', location: '中央电视台演播厅', city: '北京',
    description: '2026年央视春晚第三次联排', time: '10:00-20:00'
  },
  {
    id: 4, date: '2026-02-15', type: 'business', typeName: '商务活动',
    title: 'FENDI 新春限定系列发布', location: '北京SKP', city: '北京',
    description: 'FENDI品牌代言人出席新春限定系列发布活动', time: '14:00-17:00'
  },
  {
    id: 5, date: '2026-02-28', type: 'variety', typeName: '综艺录制',
    title: '央视春晚演出', location: '中央电视台一号演播厅', city: '北京',
    description: '2026年央视春晚正式演出，演唱《如愿》', time: '20:00-00:00'
  },
  // ===== 2026年3月 =====
  {
    id: 6, date: '2026-03-05', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧本围读', location: '横店影视城', city: '金华',
    description: '古装武侠剧《长风破浪》开机前剧本围读会', time: '09:00-17:00'
  },
  {
    id: 7, date: '2026-03-08', type: 'business', typeName: '商务活动',
    title: '雪花秀新品发布会', location: '上海外滩华尔道夫酒店', city: '上海',
    description: '雪花秀品牌代言人出席春季新品发布会', time: '15:00-18:00'
  },
  {
    id: 8, date: '2026-03-12', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》开机仪式', location: '横店影视城秦王宫', city: '金华',
    description: '古装武侠剧《长风破浪》正式开机，出席开机仪式', time: '08:00-12:00'
  },
  {
    id: 9, date: '2026-03-13', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '正式进入拍摄阶段，今日拍摄宫廷戏份', time: '全天'
  },
  {
    id: 10, date: '2026-03-14', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '继续拍摄宫廷戏份，包含多场文戏', time: '全天'
  },
  {
    id: 11, date: '2026-03-15', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄男主角首次出场戏份', time: '全天'
  },
  {
    id: 12, date: '2026-03-20', type: 'business', typeName: '商务活动',
    title: '微博之夜颁奖典礼', location: '北京国家体育馆', city: '北京',
    description: '出席2025微博之夜，获颁"年度品质演员"奖项', time: '18:00-22:00'
  },
  {
    id: 13, date: '2026-03-25', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄武侠打戏，武术指导现场编排动作', time: '全天'
  },
  {
    id: 14, date: '2026-03-26', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '继续拍摄武侠打戏，吊威亚特技镜头', time: '全天'
  },
  {
    id: 15, date: '2026-03-30', type: 'business', typeName: '商务活动',
    title: '巴黎时装周 FENDI 秀场', location: '巴黎', city: '巴黎',
    description: '受邀出席FENDI 2026秋冬大秀', time: '10:00-12:00'
  },
  // ===== 2026年4月 =====
  {
    id: 16, date: '2026-04-01', type: 'business', typeName: '商务活动',
    title: '巴黎时装周行程', location: '巴黎', city: '巴黎',
    description: '继续巴黎时装周行程，出席品牌晚宴', time: '19:00-22:00'
  },
  {
    id: 17, date: '2026-04-05', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '巴黎归来后回归剧组，拍摄文戏', time: '全天'
  },
  {
    id: 18, date: '2026-04-06', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄男女主对手戏', time: '全天'
  },
  {
    id: 19, date: '2026-04-07', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄雨中戏份，人工降雨', time: '全天'
  },
  {
    id: 20, date: '2026-04-11', type: 'business', typeName: '商务活动',
    title: '任嘉伦生日会', location: '上海梅赛德斯奔驰文化中心', city: '上海',
    description: '37岁生日粉丝见面会，含互动环节和特别舞台', time: '19:00-21:30'
  },
  {
    id: 21, date: '2026-04-15', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '回归剧组继续拍摄', time: '全天'
  },
  {
    id: 22, date: '2026-04-16', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄战场大戏', time: '全天'
  },
  {
    id: 23, date: '2026-04-18', type: 'business', typeName: '商务活动',
    title: '《暮色心约》开播发布会', location: '上海静安香格里拉酒店', city: '上海',
    description: '与白鹿一同出席《暮色心约》开播发布会', time: '14:00-17:00'
  },
  {
    id: 24, date: '2026-04-22', type: 'variety', typeName: '综艺录制',
    title: '博鳌亚洲论坛·青年对话', location: '博鳌亚洲论坛国际会议中心', city: '琼海',
    description: '作为文艺界青年代表参加博鳌亚洲论坛青年对话环节', time: '10:00-12:00'
  },
  {
    id: 25, date: '2026-04-25', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄古装夜戏', time: '全天'
  },
  {
    id: 26, date: '2026-04-26', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄竹林打戏', time: '全天'
  },
  {
    id: 27, date: '2026-04-27', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄感情戏份', time: '全天'
  },
  // ===== 2026年5月 =====
  {
    id: 28, date: '2026-05-01', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '五一假期照常拍摄', time: '全天'
  },
  {
    id: 29, date: '2026-05-02', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄群戏大场面', time: '全天'
  },
  {
    id: 30, date: '2026-05-03', type: 'business', typeName: '商务活动',
    title: '《时尚先生》封面拍摄', location: '北京798艺术区', city: '北京',
    description: '为《时尚先生》5月刊拍摄封面及内页大片', time: '09:00-18:00'
  },
  {
    id: 31, date: '2026-05-08', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '返回剧组拍摄', time: '全天'
  },
  {
    id: 32, date: '2026-05-09', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄水下戏份', time: '全天'
  },
  {
    id: 33, date: '2026-05-12', type: 'business', typeName: '商务活动',
    title: '雪花秀品牌直播', location: '线上直播', city: '北京',
    description: '雪花秀品牌代言人专场直播活动', time: '20:00-22:00'
  },
  {
    id: 34, date: '2026-05-15', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄重头戏——男主角身世揭露', time: '全天'
  },
  {
    id: 35, date: '2026-05-16', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '继续拍摄剧情高潮部分', time: '全天'
  },
  {
    id: 36, date: '2026-05-18', type: 'variety', typeName: '综艺录制',
    title: '《现在就出发》第三季', location: '云南大理', city: '大理',
    description: '旅行综艺外景录制，大理古城及洱海取景', time: '全天'
  },
  {
    id: 37, date: '2026-05-19', type: 'variety', typeName: '综艺录制',
    title: '《现在就出发》第三季', location: '云南大理', city: '大理',
    description: '继续大理外景录制，苍山取景', time: '全天'
  },
  {
    id: 38, date: '2026-05-22', type: 'business', typeName: '商务活动',
    title: 'FENDI 2026春夏大秀', location: '米兰', city: '米兰',
    description: '出席米兰时装周FENDI 2026春夏大秀', time: '10:00-12:00'
  },
  {
    id: 39, date: '2026-05-25', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '回归剧组，继续拍摄', time: '全天'
  },
  {
    id: 40, date: '2026-05-26', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '拍摄大结局戏份', time: '全天'
  },
  {
    id: 41, date: '2026-05-27', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '横店影视城', city: '金华',
    description: '继续拍摄大结局', time: '全天'
  },
  // ===== 2026年6月 =====
  {
    id: 42, date: '2026-06-01', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '六月开拍新一周戏份', time: '全天'
  },
  {
    id: 43, date: '2026-06-02', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄武打戏份', time: '全天'
  },
  {
    id: 44, date: '2026-06-05', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄客栈场景戏份', time: '全天'
  },
  {
    id: 45, date: '2026-06-08', type: 'variety', typeName: '综艺录制',
    title: '《你好星期六》录制', location: '湖南广电中心', city: '长沙',
    description: '作为嘉宾参与节目录制，宣传新剧《长风破浪》', time: '14:00-22:00'
  },
  {
    id: 46, date: '2026-06-12', type: 'business', typeName: '商务活动',
    title: 'FENDI 品牌活动', location: '上海恒隆广场', city: '上海',
    description: 'FENDI 2026秋冬新品发布会，品牌代言人出席', time: '15:00-18:00'
  },
  {
    id: 47, date: '2026-06-15', type: 'fanmeeting', typeName: '粉丝见面会',
    title: '「嘉人有约」粉丝见面会·北京站', location: '北京国家会议中心', city: '北京',
    description: '2026年度粉丝见面会北京站，含互动环节和签名会', time: '19:00-21:30'
  },
  {
    id: 48, date: '2026-06-18', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '继续横店拍摄，本周重点拍摄大战场面', time: '全天'
  },
  {
    id: 49, date: '2026-06-19', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄悬崖对决戏份', time: '全天'
  },
  {
    id: 50, date: '2026-06-20', type: 'variety', typeName: '综艺录制',
    title: '《现在就出发》第三季', location: '云南大理', city: '大理',
    description: '旅行综艺外景录制，大理古城及洱海取景', time: '全天'
  },
  {
    id: 51, date: '2026-06-22', type: 'business', typeName: '商务活动',
    title: '雪花秀品牌直播', location: '线上直播', city: '北京',
    description: '雪花秀品牌代言人专场直播活动', time: '20:00-22:00'
  },
  {
    id: 52, date: '2026-06-25', type: 'fanmeeting', typeName: '粉丝见面会',
    title: '「嘉人有约」粉丝见面会·上海站', location: '上海梅赛德斯奔驰文化中心', city: '上海',
    description: '2026年度粉丝见面会上海站', time: '19:00-21:30'
  },
  {
    id: 53, date: '2026-06-28', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》补拍', location: '北京怀柔影视基地', city: '北京',
    description: '室内戏份补拍', time: '全天'
  },
  {
    id: 54, date: '2026-06-29', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》补拍', location: '北京怀柔影视基地', city: '北京',
    description: '继续室内补拍', time: '全天'
  },
  // ===== 2026年7月 =====
  {
    id: 55, date: '2026-07-02', type: 'business', typeName: '商务活动',
    title: '海澜之家秋冬发布会', location: '上海展览中心', city: '上海',
    description: '品牌代言人出席新品发布会', time: '14:00-17:00'
  },
  {
    id: 56, date: '2026-07-05', type: 'fanmeeting', typeName: '粉丝见面会',
    title: '「嘉人有约」粉丝见面会·成都站', location: '成都金融城演艺中心', city: '成都',
    description: '2026年度粉丝见面会成都站', time: '19:00-21:30'
  },
  {
    id: 57, date: '2026-07-08', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '回归剧组，冲刺杀青', time: '全天'
  },
  {
    id: 58, date: '2026-07-09', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄最终决战戏份', time: '全天'
  },
  {
    id: 59, date: '2026-07-10', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '参与竞演类综艺录制，初舞台表演', time: '全天'
  },
  {
    id: 60, date: '2026-07-11', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '继续录制，团队合作赛', time: '全天'
  },
  {
    id: 61, date: '2026-07-15', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄最后几场戏份', time: '全天'
  },
  {
    id: 62, date: '2026-07-16', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华',
    description: '拍摄杀青戏份', time: '全天'
  },
  {
    id: 63, date: '2026-07-17', type: 'filming', typeName: '影视拍摄',
    title: '《长风破浪》杀青', location: '浙江横店', city: '金华',
    description: '《长风破浪》正式杀青！出席杀青仪式', time: '全天'
  },
  {
    id: 64, date: '2026-07-20', type: 'business', typeName: '商务活动',
    title: '腕表品牌新品鉴赏会', location: '上海半岛酒店', city: '上海',
    description: '瑞士某高端腕表品牌新品鉴赏会', time: '15:00-18:00'
  },
  {
    id: 65, date: '2026-07-25', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '继续录制，第二轮竞演', time: '全天'
  },
  {
    id: 66, date: '2026-07-26', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '继续录制，淘汰赛', time: '全天'
  },
  {
    id: 67, date: '2026-07-30', type: 'business', typeName: '商务活动',
    title: '《嘉人》杂志封面拍摄', location: '北京', city: '北京',
    description: '为《嘉人》杂志8月刊拍摄封面', time: '09:00-18:00'
  },
  // ===== 2026年8月 =====
  {
    id: 68, date: '2026-08-05', type: 'fanmeeting', typeName: '粉丝见面会',
    title: '「嘉人有约」粉丝见面会·广州站', location: '广州天河体育中心', city: '广州',
    description: '2026年度粉丝见面会广州站', time: '19:00-21:30'
  },
  {
    id: 69, date: '2026-08-08', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '继续录制，半决赛', time: '全天'
  },
  {
    id: 70, date: '2026-08-09', type: 'variety', typeName: '综艺录制',
    title: '《披荆斩棘的哥哥》第五季', location: '湖南广电中心', city: '长沙',
    description: '继续录制，总决赛', time: '全天'
  },
  {
    id: 71, date: '2026-08-12', type: 'business', typeName: '商务活动',
    title: '品牌七夕限定活动', location: '上海国金中心', city: '上海',
    description: 'FENDI品牌七夕限定活动，代言人出席', time: '15:00-18:00'
  },
  {
    id: 72, date: '2026-08-18', type: 'business', typeName: '商务活动',
    title: '品牌直播专场', location: '线上直播', city: '北京',
    description: '雪花秀品牌代言人818直播专场', time: '20:00-23:00'
  },
  {
    id: 73, date: '2026-08-22', type: 'variety', typeName: '综艺录制',
    title: '《现在就出发》第三季', location: '新疆乌鲁木齐', city: '乌鲁木齐',
    description: '旅行综艺外景录制，天山天池取景', time: '全天'
  },
  {
    id: 74, date: '2026-08-23', type: 'variety', typeName: '综艺录制',
    title: '《现在就出发》第三季', location: '新疆乌鲁木齐', city: '乌鲁木齐',
    description: '继续新疆外景录制，喀纳斯取景', time: '全天'
  },
  {
    id: 75, date: '2026-08-28', type: 'business', typeName: '商务活动',
    title: '海澜之家秋季大片拍摄', location: '上海摄影棚', city: '上海',
    description: '海澜之家品牌代言人拍摄秋季广告大片', time: '09:00-18:00'
  },
]

export const newsList = [
  // ===== 2026年5月 =====
  {
    id: 1, title: '任嘉伦新剧《长风破浪》横店开机，古装造型惊艳全网',
    summary: '任嘉伦主演的古装武侠剧《长风破浪》在横店正式开机，路透照中其一袭白衣古装造型引发粉丝热议，网友纷纷表示"又是一个让人期待的角色"。',
    cover: 'https://picsum.photos/seed/news1/600/400', source: '新浪娱乐', category: '影视', date: '2026-05-25', url: 'https://ent.sina.com.cn'
  },
  {
    id: 2, title: '任嘉伦出席FENDI 2026春夏大秀，尽显绅士风范',
    summary: '作为FENDI品牌代言人，任嘉伦亮相米兰时装周FENDI 2026春夏大秀现场，身穿品牌最新系列西装，优雅从容的气质获外媒盛赞。',
    cover: 'https://picsum.photos/seed/news2/600/400', source: 'ELLE', category: '时尚', date: '2026-05-22', url: 'https://www.ellechina.com'
  },
  {
    id: 3, title: '《暮色心约》豆瓣开分8.2，任嘉伦演技获认可',
    summary: '由任嘉伦、白鹿主演的都市情感剧《暮色心约》豆瓣开分8.2，观众对任嘉伦在剧中细腻的情感演绎给予高度评价。',
    cover: 'https://picsum.photos/seed/news3/600/400', source: '豆瓣电影', category: '影视', date: '2026-05-20', url: 'https://movie.douban.com'
  },
  {
    id: 4, title: '任嘉伦综艺首秀《现在就出发》第三季，反差萌圈粉无数',
    summary: '任嘉伦加盟《现在就出发》第三季，节目中展现出与荧幕形象截然不同的一面，呆萌搞笑的表现让观众看到了他的多面魅力。',
    cover: 'https://picsum.photos/seed/news4/600/400', source: '芒果TV', category: '综艺', date: '2026-05-18', url: 'https://www.mgtv.com'
  },
  {
    id: 5, title: '任嘉伦演唱会筹备中，多城巡演计划曝光',
    summary: '据悉任嘉伦正在筹备2026年个人演唱会，计划在北京、上海、成都、广州等城市巡演，粉丝翘首以盼。',
    cover: 'https://picsum.photos/seed/news5/600/400', source: '网易娱乐', category: '日常', date: '2026-05-15', url: 'https://ent.163.com'
  },
  {
    id: 6, title: '任嘉伦官宣成为雪花秀品牌代言人',
    summary: '韩国高端护肤品牌雪花秀正式宣布任嘉伦成为品牌代言人，广告大片中任嘉伦温润如玉的形象与品牌气质完美契合。',
    cover: 'https://picsum.photos/seed/news6/600/400', source: '微博', category: '时尚', date: '2026-05-12', url: 'https://weibo.com'
  },
  {
    id: 7, title: '任嘉伦《披荆斩棘》第五季确认加盟，粉丝期待值拉满',
    summary: '湖南卫视官宣任嘉伦加盟《披荆斩棘的哥哥》第五季，这也是他首次参加竞演类综艺，消息一出便登上热搜第一。',
    cover: 'https://picsum.photos/seed/news7/600/400', source: '湖南卫视', category: '综艺', date: '2026-05-10', url: 'https://www.mgtv.com'
  },
  {
    id: 8, title: '任嘉伦拍摄花絮曝光，敬业态度获剧组称赞',
    summary: '《长风破浪》剧组放出拍摄花絮，任嘉伦在高温下连续拍摄12小时毫无怨言，对每个镜头精益求精的态度让工作人员深受感动。',
    cover: 'https://picsum.photos/seed/news8/600/400', source: '新浪娱乐', category: '影视', date: '2026-05-08', url: 'https://ent.sina.com.cn'
  },
  {
    id: 9, title: '任嘉伦5月杂志封面释出，春日少年感满分',
    summary: '任嘉伦登上《时尚先生》5月刊封面，身着淡色系春装在花丛中拍摄，清爽干净的形象被赞"春日限定男友"。',
    cover: 'https://picsum.photos/seed/news9/600/400', source: '时尚先生', category: '时尚', date: '2026-05-03', url: 'https://www.esquire.com.cn'
  },
  // ===== 2026年4月 =====
  {
    id: 10, title: '任嘉伦出席《暮色心约》开播发布会，与白鹿默契互动',
    summary: '电视剧《暮色心约》开播发布会在上海举行，任嘉伦与白鹿同台亮相，两人在发布会上的默契互动引得现场粉丝尖叫连连。',
    cover: 'https://picsum.photos/seed/news10/600/400', source: '新浪娱乐', category: '影视', date: '2026-04-28', url: 'https://ent.sina.com.cn'
  },
  {
    id: 11, title: '任嘉伦受邀出席博鳌亚洲论坛青年对话',
    summary: '作为文艺界青年代表，任嘉伦受邀参加博鳌亚洲论坛青年对话环节，分享了关于文化传播与青年责任的思考。',
    cover: 'https://picsum.photos/seed/news11/600/400', source: '新华网', category: '日常', date: '2026-04-22', url: 'https://www.xinhuanet.com'
  },
  {
    id: 12, title: '《暮色心约》定档4月18日，任嘉伦演绎治愈系暖男',
    summary: '由任嘉伦主演的都市情感剧《暮色心约》正式定档4月18日播出，剧中他饰演心理咨询师，温暖治愈的角色引发观众期待。',
    cover: 'https://picsum.photos/seed/news12/600/400', source: '优酷', category: '影视', date: '2026-04-15', url: 'https://www.youku.com'
  },
  {
    id: 13, title: '任嘉伦代言海澜之家，国民男神演绎国潮新风尚',
    summary: '海澜之家官宣任嘉伦为全新品牌代言人，广告大片中任嘉伦将传统国潮元素与现代时尚完美融合，引发网友热议。',
    cover: 'https://picsum.photos/seed/news13/600/400', source: '微博', category: '时尚', date: '2026-04-10', url: 'https://weibo.com'
  },
  {
    id: 14, title: '任嘉伦粉丝公益项目"嘉期有爱"正式启动',
    summary: '以任嘉伦粉丝为主体的公益项目"嘉期有爱"正式启动，首期活动为山区儿童捐赠图书，任嘉伦本人亲自录制视频为活动加油。',
    cover: 'https://picsum.photos/seed/news14/600/400', source: '新浪公益', category: '日常', date: '2026-04-05', url: 'https://gongyi.sina.com.cn'
  },
  {
    id: 15, title: '任嘉伦登上《GQ》四月刊，复古绅士风格大片释出',
    summary: '任嘉伦为《GQ》拍摄四月刊封面，复古西装造型搭配怀旧场景，展现成熟男人魅力，杂志预售即秒空。',
    cover: 'https://picsum.photos/seed/news15/600/400', source: 'GQ', category: '时尚', date: '2026-04-02', url: 'https://www.gq.com.cn'
  },
  // ===== 2026年3月 =====
  {
    id: 16, title: '任嘉伦出席微博之夜，荣获"年度品质演员"大奖',
    summary: '2025微博之夜盛典在上海举行，任嘉伦凭借过去一年的出色表现荣获"年度品质演员"奖项，发表感言时感谢了一路支持的粉丝。',
    cover: 'https://picsum.photos/seed/news16/600/400', source: '微博', category: '日常', date: '2026-03-28', url: 'https://weibo.com'
  },
  {
    id: 17, title: '《长风破浪》官宣阵容，任嘉伦搭档迪丽热巴',
    summary: '古装武侠剧《长风破浪》正式官宣主演阵容，任嘉伦与迪丽热巴领衔主演，超强阵容让该剧未拍先火。',
    cover: 'https://picsum.photos/seed/news17/600/400', source: '腾讯娱乐', category: '影视', date: '2026-03-20', url: 'https://ent.qq.com'
  },
  {
    id: 18, title: '任嘉伦出席巴黎时装周，路透照帅出新高度',
    summary: '任嘉伦现身巴黎时装周，机场路透照中其简约穿搭被网友扒出全身品牌，低调中不失品味，被称为"行走的衣架子"。',
    cover: 'https://picsum.photos/seed/news18/600/400', source: 'ELLE', category: '时尚', date: '2026-03-12', url: 'https://www.ellechina.com'
  },
  {
    id: 19, title: '任嘉伦抖音直播破千万观看，与粉丝互动超暖心',
    summary: '任嘉伦在抖音进行了一场生日直播，直播间观看人数突破1000万，他还现场弹唱了粉丝点播的歌曲，引发弹幕狂欢。',
    cover: 'https://picsum.photos/seed/news19/600/400', source: '抖音', category: '日常', date: '2026-03-08', url: 'https://www.douyin.com'
  },
  {
    id: 20, title: '任嘉伦37岁生日快乐！粉丝全球应援点亮多城地标',
    summary: '4月11日是任嘉伦37岁生日，全球粉丝自发组织应援活动，北京、上海、广州等多座城市地标大屏被点亮为他庆生。',
    cover: 'https://picsum.photos/seed/news20/600/400', source: '新浪娱乐', category: '影视', date: '2026-03-01', url: 'https://ent.sina.com.cn'
  },
  // ===== 2026年2月 =====
  {
    id: 21, title: '任嘉伦春晚表演获赞，一曲《如愿》感动万千观众',
    summary: '任嘉伦亮相2026年央视春晚，深情演唱《如愿》，温润的嗓音和真挚的演绎让无数观众为之动容，节目播出后迅速登上热搜。',
    cover: 'https://picsum.photos/seed/news21/600/400', source: '央视', category: '综艺', date: '2026-02-28', url: 'https://www.cctv.com'
  },
  {
    id: 22, title: '任嘉伦携家人春节出游被偶遇，暖男属性再获好评',
    summary: '有网友在三亚偶遇任嘉伦携家人度假，照片中他细心照顾家人的样子被赞"好男人典范"，低调出行不做作。',
    cover: 'https://picsum.photos/seed/news22/600/400', source: '网易娱乐', category: '日常', date: '2026-02-18', url: 'https://ent.163.com'
  },
  {
    id: 23, title: '任嘉伦春晚彩排路透，认真练习获工作人员称赞',
    summary: '任嘉伦为央视春晚进行多次彩排，有工作人员透露他每次彩排都全力以赴，态度非常敬业，对细节要求极高。',
    cover: 'https://picsum.photos/seed/news23/600/400', source: '新浪娱乐', category: '影视', date: '2026-02-10', url: 'https://ent.sina.com.cn'
  },
  {
    id: 24, title: '任嘉伦新年写真曝光，红衣造型年味十足',
    summary: '任嘉伦工作室发布新年写真，照片中他身穿红色毛衣手拿糖葫芦，笑容温暖治愈，被粉丝称为"新年最佳男友"。',
    cover: 'https://picsum.photos/seed/news24/600/400', source: '任嘉伦工作室', category: '时尚', date: '2026-02-05', url: 'https://weibo.com/任嘉伦Allen'
  },
  {
    id: 25, title: '确认！任嘉伦将亮相2026年央视春晚',
    summary: '央视春晚节目单正式公布，任嘉伦将带来歌曲表演，这是他第三次登上春晚舞台，粉丝期待值爆表。',
    cover: 'https://picsum.photos/seed/news25/600/400', source: '央视', category: '综艺', date: '2026-02-01', url: 'https://www.cctv.com'
  },
  // ===== 2026年1月 =====
  {
    id: 26, title: '任嘉伦2025年度盘点：影视综艺全面开花',
    summary: '回顾任嘉伦2025年的精彩表现：主演两部热播剧、参加三档综艺节目、新增两个品牌代言，可谓事业全面开花。',
    cover: 'https://picsum.photos/seed/news26/600/400', source: '网易娱乐', category: '日常', date: '2026-01-28', url: 'https://ent.163.com'
  },
  {
    id: 27, title: '《与凤行》收官战报出炉，任嘉伦角色获封"古装天花板"',
    summary: '由任嘉伦主演的古装仙侠剧《与凤行》收官，全网播放量突破120亿，他饰演的行止被观众封为"古装剧天花板男主"。',
    cover: 'https://picsum.photos/seed/news27/600/400', source: '腾讯视频', category: '影视', date: '2026-01-20', url: 'https://v.qq.com'
  },
  {
    id: 28, title: '任嘉伦出席百花奖颁奖典礼，获最佳男主角提名',
    summary: '第37届大众电影百花奖颁奖典礼在北京举行，任嘉伦凭借《与凤行》获得最佳男主角提名，虽未获奖但演技获得业内肯定。',
    cover: 'https://picsum.photos/seed/news28/600/400', source: '电影频道', category: '影视', date: '2026-01-15', url: 'https://www.cctv6.com'
  },
  {
    id: 29, title: '任嘉伦代言FENDI续约，双方合作进入第三年',
    summary: '意大利奢侈品牌FENDI宣布与任嘉伦续约，双方合作进入第三个年头，品牌方表示任嘉伦的形象与品牌气质高度契合。',
    cover: 'https://picsum.photos/seed/news29/600/400', source: 'FENDI', category: '时尚', date: '2026-01-08', url: 'https://www.fendi.com'
  },
  {
    id: 30, title: '任嘉伦元旦发博送祝福，手写贺卡暖化粉丝',
    summary: '元旦当天任嘉伦在微博发布手写贺卡照片，字迹工整漂亮，配文"新的一年，继续一起走"，粉丝感动留言刷屏。',
    cover: 'https://picsum.photos/seed/news30/600/400', source: '微博', category: '日常', date: '2026-01-01', url: 'https://weibo.com'
  },
  // ===== 2025年12月 =====
  {
    id: 31, title: '任嘉伦亮相湖南卫视跨年演唱会，连唱三首燃爆全场',
    summary: '任嘉伦参加湖南卫视跨年演唱会，先后演唱《如愿》《你的答案》和《孤勇者》，舞台表现力获赞，收视率飙升。',
    cover: 'https://picsum.photos/seed/news31/600/400', source: '湖南卫视', category: '综艺', date: '2025-12-31', url: 'https://www.mgtv.com'
  },
  {
    id: 32, title: '《与凤行》大结局超前点播，任嘉伦哭戏封神',
    summary: '《与凤行》大结局超前点播上线，任嘉伦在结局中的哭戏片段被网友反复传播，被称为"教科书级别的哭戏表演"。',
    cover: 'https://picsum.photos/seed/news32/600/400', source: '豆瓣电影', category: '影视', date: '2025-12-25', url: 'https://movie.douban.com'
  },
  {
    id: 33, title: '任嘉伦出席品牌圣诞活动，亲手制作姜饼人送粉丝',
    summary: '任嘉伦出席某品牌圣诞特别活动，现场亲手制作姜饼人并随机送给到场粉丝，暖心举动引发现场一片欢呼。',
    cover: 'https://picsum.photos/seed/news33/600/400', source: '新浪娱乐', category: '影视', date: '2025-12-20', url: 'https://ent.sina.com.cn'
  },
  {
    id: 34, title: '任嘉伦登《时尚芭莎》12月刊封面，冬日暖阳风格大片',
    summary: '任嘉伦登上《时尚芭莎》12月刊封面，冬日暖阳下的慵懒风格大片展现出不同于荧幕的一面，杂志销量再创新高。',
    cover: 'https://picsum.photos/seed/news34/600/400', source: '时尚芭莎', category: '时尚', date: '2025-12-12', url: 'https://www.harpersbazaar.com.cn'
  },
  {
    id: 35, title: '《与凤行》收视破新高，任嘉伦发文感谢观众',
    summary: '《与凤行》实时收视率突破2.5%，创下年度收视新高。任嘉伦发长文感谢观众支持，表示会继续带来更多好作品。',
    cover: 'https://picsum.photos/seed/news35/600/400', source: '腾讯视频', category: '影视', date: '2025-12-05', url: 'https://v.qq.com'
  },
  // ===== 2025年11月 =====
  {
    id: 36, title: '任嘉伦获金鹰奖最受欢迎男演员，发表感人获奖感言',
    summary: '第32届中国金鹰电视艺术节闭幕，任嘉伦荣获"观众最喜爱的男演员"奖，发表感言时一度哽咽，感谢了一路陪伴的粉丝。',
    cover: 'https://picsum.photos/seed/news36/600/400', source: '湖南卫视', category: '影视', date: '2025-11-28', url: 'https://www.mgtv.com'
  },
  {
    id: 37, title: '《与凤行》热播中，任嘉伦赵丽颖CP感十足',
    summary: '《与凤行》播出过半，任嘉伦与赵丽颖的CP组合引发观众磕糖热潮，两人在剧中的互动甜度爆表，微博话题阅读量破50亿。',
    cover: 'https://picsum.photos/seed/news37/600/400', source: '新浪娱乐', category: '影视', date: '2025-11-20', url: 'https://ent.sina.com.cn'
  },
  {
    id: 38, title: '任嘉伦出席上海进博会文化交流活动',
    summary: '任嘉伦受邀出席第六届中国国际进口博览会文化交流活动，与外国嘉宾交流中国传统文化，展现文艺工作者的国际视野。',
    cover: 'https://picsum.photos/seed/news38/600/400', source: '新华网', category: '日常', date: '2025-11-12', url: 'https://www.xinhuanet.com'
  },
  {
    id: 39, title: '《与凤行》开播即爆！任嘉伦首播造型帅上热搜',
    summary: '仙侠剧《与凤行》在腾讯视频开播，任嘉伦饰演的行止上神白衣出场即引爆热搜，首播当晚全网播放量突破3亿。',
    cover: 'https://picsum.photos/seed/news39/600/400', source: '腾讯视频', category: '影视', date: '2025-11-05', url: 'https://v.qq.com'
  },
  // ===== 2025年10月 =====
  {
    id: 40, title: '任嘉伦出席《与凤行》定档发布会，古装造型再度惊艳',
    summary: '《与凤行》定档发布会在京举行，任嘉伦以一袭墨色长袍亮相，完美诠释了"上神"的仙风道骨，路透照引发全网热议。',
    cover: 'https://picsum.photos/seed/news40/600/400', source: '新浪娱乐', category: '影视', date: '2025-10-28', url: 'https://ent.sina.com.cn'
  },
  {
    id: 41, title: '任嘉伦综艺《现在就出发》第二季杀青，发文告别节目组',
    summary: '任嘉伦参与录制的旅行综艺《现在就出发》第二季杀青，他发长文分享录制趣事，表示这是"最放松的一次工作经历"。',
    cover: 'https://picsum.photos/seed/news41/600/400', source: '芒果TV', category: '综艺', date: '2025-10-18', url: 'https://www.mgtv.com'
  },
  {
    id: 42, title: '任嘉伦出席FENDI 2025秋冬大秀，全黑造型气场全开',
    summary: '任嘉伦受邀出席FENDI 2025秋冬大秀，一身全黑look搭配墨镜，霸总气质尽显，外媒镜头下的他状态极佳。',
    cover: 'https://picsum.photos/seed/news42/600/400', source: 'VOGUE', category: '时尚', date: '2025-10-10', url: 'https://www.vogue.com.cn'
  },
  {
    id: 43, title: '国庆期间任嘉伦微博送祝福，与粉丝共度佳节',
    summary: '国庆假期任嘉伦通过微博向粉丝送上节日祝福，配图是他在剧组的工作照，敬业精神获网友点赞。',
    cover: 'https://picsum.photos/seed/news43/600/400', source: '微博', category: '日常', date: '2025-10-01', url: 'https://weibo.com'
  },
  // ===== 2025年9月 =====
  {
    id: 44, title: '《与凤行》杀青！任嘉伦发文感谢全组工作人员',
    summary: '历时四个月拍摄，《与凤行》正式杀青。任嘉伦发微博晒出杀青照，与赵丽颖的合影让粉丝直呼"磕到了"。',
    cover: 'https://picsum.photos/seed/news44/600/400', source: '新浪娱乐', category: '影视', date: '2025-09-25', url: 'https://ent.sina.com.cn'
  },
  {
    id: 45, title: '任嘉伦担任公益活动形象大使，关注留守儿童教育',
    summary: '任嘉伦被任命为"关爱留守儿童"公益项目形象大使，呼吁社会各界关注乡村儿童教育问题，身体力行传递正能量。',
    cover: 'https://picsum.photos/seed/news45/600/400', source: '新浪公益', category: '日常', date: '2025-09-15', url: 'https://gongyi.sina.com.cn'
  },
  {
    id: 46, title: '任嘉伦九月杂志封面合集，四种风格切换自如',
    summary: '任嘉伦九月连登四本杂志封面，从清新少年到成熟绅士，四种截然不同的风格都被他完美驾驭，展现了极强的时尚表现力。',
    cover: 'https://picsum.photos/seed/news46/600/400', source: '时尚COSMO', category: '时尚', date: '2025-09-08', url: 'https://www.cosmopolitan.com.cn'
  },
  // ===== 2025年8月 =====
  {
    id: 47, title: '任嘉伦《与凤行》片场路透，高温下依然敬业拍摄',
    summary: '横店气温高达40℃，任嘉伦身穿厚重古装坚持拍摄，休息间隙用小风扇降温的画面被路透，粉丝心疼又佩服。',
    cover: 'https://picsum.photos/seed/news47/600/400', source: '网易娱乐', category: '影视', date: '2025-08-22', url: 'https://ent.163.com'
  },
  {
    id: 48, title: '任嘉伦参与《披荆斩棘的哥哥》第四季决赛录制',
    summary: '任嘉伦作为嘉宾参与《披荆斩棘的哥哥》第四季决赛录制，在舞台上演唱了一首燃爆全场的歌曲，台下观众欢呼声不断。',
    cover: 'https://picsum.photos/seed/news48/600/400', source: '湖南卫视', category: '综艺', date: '2025-08-15', url: 'https://www.mgtv.com'
  },
  {
    id: 49, title: '任嘉伦八月生日月粉丝应援，线上线下联动超暖心',
    summary: '虽然任嘉伦的生日在三月，但粉丝将八月定为"嘉月"，在全国多地举办线下应援活动，线上话题阅读量破10亿。',
    cover: 'https://picsum.photos/seed/news49/600/400', source: '微博', category: '日常', date: '2025-08-08', url: 'https://weibo.com'
  },
  // ===== 2025年7月 =====
  {
    id: 50, title: '任嘉伦出席品牌夏季发布会，清爽造型获好评',
    summary: '任嘉伦出席某品牌夏季新品发布会，白色亚麻西装搭配浅色系穿搭，清爽干净的夏日造型被网友称为"降温穿搭模板"。',
    cover: 'https://picsum.photos/seed/news50/600/400', source: '新浪时尚', category: '时尚', date: '2025-07-25', url: 'https://fashion.sina.com.cn'
  },
  {
    id: 51, title: '《与凤行》开机，任嘉伦进组横店拍摄仙侠大剧',
    summary: '仙侠巨制《与凤行》在横店正式开机，任嘉伦将饰演行止上神，预计拍摄周期四个月，粉丝已经开始期待定档。',
    cover: 'https://picsum.photos/seed/news51/600/400', source: '腾讯娱乐', category: '影视', date: '2025-07-15', url: 'https://ent.qq.com'
  },
  {
    id: 52, title: '任嘉伦参加《快乐大本营》特别节目，游戏环节笑翻全场',
    summary: '任嘉伦做客《快乐大本营》暑期特别节目，在游戏环节中展现出惊人的综艺感和反差萌，多个名场面登上热搜。',
    cover: 'https://picsum.photos/seed/news52/600/400', source: '湖南卫视', category: '综艺', date: '2025-07-08', url: 'https://www.mgtv.com'
  },
  // ===== 2025年6月 =====
  {
    id: 53, title: '任嘉伦出席上海国际电影节红毯，绅士造型惊艳全场',
    summary: '第28届上海国际电影节开幕红毯，任嘉伦身着黑色丝绒西装亮相，优雅绅士气质获媒体一致好评，红毯生图状态极佳。',
    cover: 'https://picsum.photos/seed/news53/600/400', source: '电影频道', category: '时尚', date: '2025-06-22', url: 'https://www.cctv6.com'
  },
  {
    id: 54, title: '任嘉伦新代言官宣！成为某高端腕表品牌全球代言人',
    summary: '瑞士某知名腕表品牌官宣任嘉伦为全球品牌代言人，广告大片中他佩戴经典款腕表，成熟优雅的形象与品牌调性完美融合。',
    cover: 'https://picsum.photos/seed/news54/600/400', source: '品牌官方微博', category: '时尚', date: '2025-06-15', url: 'https://weibo.com'
  },
  {
    id: 55, title: '任嘉伦出席慈善晚宴，低调捐款50万用于助学',
    summary: '任嘉伦出席某慈善晚宴，低调捐赠50万元用于贫困地区助学项目，善举被曝光后网友纷纷点赞，称其为"正能量偶像"。',
    cover: 'https://picsum.photos/seed/news55/600/400', source: '新浪公益', category: '日常', date: '2025-06-08', url: 'https://gongyi.sina.com.cn'
  },
  {
    id: 56, title: '任嘉伦主演《暮色心约》杀青，发文告别角色',
    summary: '由任嘉伦主演的都市情感剧《暮色心约》正式杀青，他在微博发长文告别角色，表示这个角色让他学到了很多关于"倾听"的事。',
    cover: 'https://picsum.photos/seed/news56/600/400', source: '新浪娱乐', category: '影视', date: '2025-06-01', url: 'https://ent.sina.com.cn'
  },
]

export const eventsList = [
  {
    id: 1, name: '「嘉人有约」粉丝见面会·北京站', date: '2026-06-15', time: '19:00-21:30',
    venue: '北京国家会议中心', city: '北京', address: '北京市朝阳区天辰东路7号',
    status: 'hot', statusText: '热卖中',
    cover: 'https://picsum.photos/seed/event1/600/400',
    description: '2026年度「嘉人有约」粉丝见面会北京站，包含精彩舞台表演、互动游戏、幸运粉丝签名等环节。',
    remainingTickets: 236,
    tickets: [
      { platform: '大麦网', url: 'https://www.damai.cn', price: '680-1680', status: 'hot', statusText: '热卖中' },
      { platform: '猫眼', url: 'https://www.maoyan.com', price: '680-1680', status: 'onsale', statusText: '有票' },
      { platform: '摩天轮', url: 'https://www.feiticket.com', price: '720-1880', status: 'onsale', statusText: '加价售票中' },
    ]
  },
  {
    id: 2, name: '「嘉人有约」粉丝见面会·上海站', date: '2026-06-25', time: '19:00-21:30',
    venue: '上海梅赛德斯奔驰文化中心', city: '上海', address: '上海市浦东新区世博大道1200号',
    status: 'onsale', statusText: '即将开售',
    cover: 'https://picsum.photos/seed/event2/600/400',
    description: '2026年度「嘉人有约」粉丝见面会上海站，全新舞台设计，更多惊喜互动环节。',
    remainingTickets: null, saleDate: '2026-06-01 10:00',
    tickets: [
      { platform: '大麦网', url: 'https://www.damai.cn', price: '680-1680', status: 'soon', statusText: '6月1日开售' },
      { platform: '猫眼', url: 'https://www.maoyan.com', price: '680-1680', status: 'soon', statusText: '6月1日开售' },
      { platform: '票星球', url: 'https://www.piaoqiu.com', price: '680-1680', status: 'soon', statusText: '即将开售' },
    ]
  },
  {
    id: 3, name: '「嘉人有约」粉丝见面会·成都站', date: '2026-07-05', time: '19:00-21:30',
    venue: '成都金融城演艺中心', city: '成都', address: '成都市高新区天府大道北段966号',
    status: 'soon', statusText: '即将公布', ticketUrl: '#',
    platform: '待定', cover: 'https://picsum.photos/seed/event3/600/400',
    description: '2026年度「嘉人有约」粉丝见面会成都站，敬请期待。',
    remainingTickets: null
  },
  {
    id: 4, name: '雪花秀 × 任嘉伦 品牌直播专场', date: '2026-06-22', time: '20:00-22:00',
    venue: '线上直播', city: '北京', address: '线上活动',
    status: 'onsale', statusText: '预约中', ticketUrl: 'https://www.douyin.com',
    platform: '抖音直播', cover: 'https://picsum.photos/seed/event4/600/400',
    description: '雪花秀品牌代言人任嘉伦专场直播，直播间专属福利和限量礼盒。',
    remainingTickets: null
  },
]

// 活动城市到活动类型的路由数据（直达用）
export const travelRoutes = {
  '北京-fanmeeting': {
    destination: '北京', eventName: '嘉人有约粉丝见面会', venue: '北京国家会议中心',
    flights: hubToDestRoutes['北京'].flights.map(f => ({...f, from: f.from.replace('北京', '上海')})),
    trains: hubToDestRoutes['北京'].trains.map(t => ({...t, from: t.from.replace('北京', '上海')})),
  },
  '上海-business': {
    destination: '上海', eventName: 'FENDI品牌活动', venue: '上海恒隆广场',
    flights: hubToDestRoutes['上海'].flights,
    trains: hubToDestRoutes['上海'].trains,
  },
  '上海-fanmeeting': {
    destination: '上海', eventName: '嘉人有约粉丝见面会·上海站', venue: '上海梅赛德斯奔驰文化中心',
    flights: hubToDestRoutes['上海'].flights,
    trains: hubToDestRoutes['上海'].trains,
  },
  '成都-fanmeeting': {
    destination: '成都', eventName: '嘉人有约粉丝见面会·成都站', venue: '成都金融城演艺中心',
    flights: hubToDestRoutes['成都'].flights,
    trains: hubToDestRoutes['成都'].trains,
  },
}

export const cities = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉', '重庆', '西安',
  '长沙', '天津', '苏州', '青岛', '大连', '郑州', '昆明', '厦门', '福州', '合肥'
]

export const getUpcomingEvents = () => {
  const now = new Date()
  return eventsList
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const getScheduleByMonth = (year, month) => {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return scheduleList.filter(s => s.date.startsWith(prefix))
}

export const getScheduleByDate = (dateStr) => {
  return scheduleList.filter(s => s.date === dateStr)
}
