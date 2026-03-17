// Rule: 3.0 커스텀 Alert — SweetAlert2 래퍼 (앱 디자인 토큰 적용)
import Swal from 'sweetalert2'

// 앱 공통 mixin (버튼 스타일: Bootstrap Bootstrap classes)
const swal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'swal-app-popup',
    confirmButton: 'btn btn-sm',
    cancelButton: 'btn btn-outline-neutral btn-sm',
    actions: 'swal-app-actions',
    title: 'swal-app-title',
    htmlContainer: 'swal-app-text',
  },
})

/**
 * 삭제 확인 다이얼로그
 * @param {string} message  본문 메시지
 * @returns {Promise<boolean>}
 */
export async function confirmDelete(message = '정말 삭제하시겠습니까?') {
  const result = await swal.fire({
    title: message,
    icon: 'warning',
    iconColor: '#f59e0b',
    showCancelButton: true,
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    customClass: {
      popup: 'swal-app-popup',
      confirmButton: 'btn btn-danger btn-sm',
      cancelButton: 'btn btn-outline-neutral btn-sm',
      actions: 'swal-app-actions',
      title: 'swal-app-title',
    },
  })
  return result.isConfirmed
}
