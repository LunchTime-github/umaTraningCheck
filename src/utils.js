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
  if (dist <= 1200) return '단거리'
  if (dist <= 1999) return '마일'
  if (dist <= 2499) return '중거리'
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
    case '훈련실패': return `훈련실패 (${fc.trainingFailProb ?? '-'}%)`;
    case '상태이상': return `상태이상 - ${fc.conditionType || '-'}`;
    case '거리인자미획득': return '거리 인자 미획득';
    case '스킬미획득': return '스킬 미획득';
    case '스탯미달': return '스탯 미달';
    case '시나리오조건미달': return '시나리오 조건 미달';
    case '수완가미획득': return '수완가 미획득';
    case '고유스킬진화실패': return '고유스킬 진화 실패';
    case '세침사': return '세침사';
    case '기타': return fc.detail ? `기타 (${fc.detail})` : '기타';
    default: return fc.type || '-';
  }
}

export const FAILURE_TYPES = [
  { value: '훈련실패', label: '훈련실패' },
  { value: '거리인자미획득', label: '거리 인자 미획득' },
  { value: '스킬미획득', label: '스킬 미획득' },
  { value: '스탯미달', label: '육성 스탯 미달' },
  { value: '상태이상', label: '상태이상' },
  { value: '세침사', label: '세침사' },
  { value: '시나리오조건미달', label: '시나리오 조건 미달' },
  { value: '수완가미획득', label: '수완가 미획득' },
  { value: '고유스킬진화실패', label: '고유스킬 진화 실패' },
  { value: '기타', label: '기타' },
]

export const CONDITION_TYPES = ['땡땡이 기질', '밤샘 상태', '살찜 주의', '편두통', '피부트러블']
