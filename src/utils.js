export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function formatDateTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${mo}.${day} ${h}:${min}`
}

export function getDistanceCategory(dist) {
  dist = parseInt(dist)
  if (!dist) return '-'
  if (dist <= 1400) return '단거리'
  if (dist <= 1900) return '마일'
  if (dist <= 2400) return '중거리'
  return '장거리'
}

export function formatRacetrackLabel(rt) {
  if (!rt) return '-'
  const type = rt.type === '챔피언스미팅' ? '챔미' : 'LoH'
  return `[${type}] ${rt.racecourse} ${rt.distance}m (${rt.startDate})`
}

export function formatFailureCause(fc) {
  if (!fc) return '-'
  switch (fc.type) {
    case '훈련실패': return `훈련실패 (${fc.trainingFailProb ?? '-'}%)`
    case '상태이상': return `상태이상 - ${fc.conditionType || '-'}`
    case '거리인자미획득': return '거리 인자 미획득'
    case '스킬미획득': return '스킬 미획득'
    case '스탯미달': return '스탯 미달'
    case '시나리오조건미달': return '시나리오 조건 미달'
    default: return fc.type || '-'
  }
}

export const FAILURE_TYPES = [
  { value: '훈련실패', label: '훈련실패' },
  { value: '거리인자미획득', label: '거리 인자 미획득' },
  { value: '스킬미획득', label: '육성결과 스킬 미획득' },
  { value: '스탯미달', label: '육성결과 스탯 미달' },
  { value: '상태이상', label: '상태이상' },
  { value: '시나리오조건미달', label: '시나리오 조건 미달' },
]

export const CONDITION_TYPES = ['땡땡이 기질', '밤샘 상태', '살찜 주의']
