// 通知基线选择 —— 纯函数：决定跟什么对比来算「新增」
//
// 背景（2026-09-30 修复）：notify.cjs 原本用 `git show HEAD:data/*.json` 当基线，
// 但 CI 只 build + deploy 到 gh-pages，从不把生成的数据 commit 回 main。
// 于是 HEAD 永远停留在某次手动提交的快照，每轮 CI 都会把「快照至今的全部数据」
// 判定为新增 —— 一旦配了 webhook 就会每轮全量轰炸。
//
// 现在的策略：优先用「线上已部署的 JSON」当基线。CI 中 notify 步骤跑在
// build/deploy 之前，此时线上产物正是上一轮成功运行的结果，也就是用户此刻
// 实际看到的内容 —— 拿它做对比既正确又零额外 git 改动。
// git HEAD 降级为离线/首次部署时的兜底。

// 基线来源标记，用于 CI 日志观测
const SOURCE_DEPLOYED = 'deployed'
const SOURCE_GIT = 'gitHead'
const SOURCE_NONE = 'none'

/**
 * 选择基线：优先线上产物，其次 git HEAD，都没有则 null（触发现有的首轮跳过逻辑）
 * 空数组视为「无基线」——首次部署时线上 JSON 可能是空壳，用它做基线会把全部历史
 * 判成新增，同样造成轰炸。
 * @param {{deployed: Array|null, gitHead: Array|null}} sources
 * @returns {{data: Array, source: string}|{data: null, source: string}}
 */
function pickBaseline({ deployed, gitHead }) {
  if (Array.isArray(deployed) && deployed.length > 0) {
    return { data: deployed, source: SOURCE_DEPLOYED }
  }
  if (Array.isArray(gitHead) && gitHead.length > 0) {
    return { data: gitHead, source: SOURCE_GIT }
  }
  return { data: null, source: SOURCE_NONE }
}

/**
 * 按 keyFn 算增量。无基线时返回空数组（而不是把全部当新增）
 * @param {Array} current 本轮生成的数据
 * @param {Array|null} baseline 上一次的基线数据
 * @param {(item:any)=>string} keyFn
 * @returns {Array}
 */
function diffAgainstBaseline(current, baseline, keyFn) {
  if (!Array.isArray(baseline)) return []
  const seen = new Set(baseline.map(keyFn))
  return (current || []).filter(item => !seen.has(keyFn(item)))
}

module.exports = { pickBaseline, diffAgainstBaseline, SOURCE_DEPLOYED, SOURCE_GIT, SOURCE_NONE }
