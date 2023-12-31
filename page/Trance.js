document.addEventListener('DOMContentLoaded', function () {
    // 이미지 보여주는 함수 호출
    showSelectedImage();

    // 거래 폼 제출 이벤트 처리
    const transactionForm = document.getElementById('transactionForm');
    transactionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 여기에 거래 정보를 서버로 전송하는 로직 추가
        const transactionAmount = document.getElementById('transactionAmount').value;
        const bankInfo = document.getElementById('bankInfo').value;

        // 거래를 시작하는 함수 호출
        startTransaction(transactionAmount, bankInfo);

        // 거래 정보를 이미지를 올린 사용자에게 전송
        sendTransactionInfoToUploader(transactionAmount, bankInfo);
    });

    // 거래 신청 알림을 표시하는 함수
    function showTransactionRequestNotification(user) {
        // 모달 창을 생성하고 표시
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <p style="font-size: 16px; margin-bottom: 10px;">거래 신청이 도착했습니다.</p>
                <button onclick="acceptTransaction()">수락</button>
                <button onclick="rejectTransaction()">거절</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 거래 수락 함수
    function acceptTransaction(user) {
        // 여기에서 거래를 수락하는 로직을 추가
        // 예: 수락 여부를 저장하고, 다음 화면에 반영
        localStorage.setItem('transactionAccepted', 'true');
        closeModal();
    }

    // 거래 거절 함수
    function rejectTransaction(user) {
        // 여기에서 거래를 거절하는 로직을 추가
        // 예: 거절 여부를 저장하고, 다음 화면에 반영
        localStorage.setItem('transactionAccepted', 'false');
        closeModal();
    }

    // 주기적으로 거래 메시지를 확인하는 함수
    function checkTransactionStatus() {
        const transactionAccepted = localStorage.getItem('transactionAccepted');
        if (transactionAccepted === 'true') {
            // 거래를 수락한 경우에 대한 처리
            alert('거래를 수락하셨습니다.');
            // 추가로 필요한 작업 수행
        } else if (transactionAccepted === 'false') {
            // 거래를 거절한 경우에 대한 처리
            alert('거래를 거절하셨습니다.');
            // 추가로 필요한 작업 수행
        }
        // 거래 여부를 초기화
        localStorage.removeItem('transactionAccepted');
    }

    // 주기적으로 거래 메시지 확인 (예: 5초마다)
    setInterval(checkTransactionStatus, 5000);

    // 모달 닫기 함수
    function closeModal() {
        const modal = document.querySelector('div');
        if (modal) {
            modal.remove();
        }
    }

    // 이미지 보여주는 함수
    function showSelectedImage() {
        // 선택한 이미지의 URL을 로컬 스토리지에서 가져옴
        const selectedImageUrl = localStorage.getItem('selectedImageUrl');

        // 이미지 엘리먼트 생성
        const imageElement = document.createElement('img');
        imageElement.src = selectedImageUrl;
        imageElement.alt = 'Selected Image';

        // 이미지를 표시하는 엘리먼트에 추가
        const selectedImageContainer = document.getElementById('selectedImageContainer');
        selectedImageContainer.appendChild(imageElement);
    }

    // 거래를 시작하는 함수
    function startTransaction(transactionAmount, bankInfo) {
        // 여기에 거래를 시작하는 서버로의 요청을 보내는 로직 추가
        // 서버로 transactionAmount와 bankInfo를 전송하여 거래를 시작하는 동작 수행
        console.log(`거래를 시작합니다. 금액: ${transactionAmount}, 계좌 정보: ${bankInfo}`);
    }

    // 거래 정보를 이미지를 올린 사용자에게 전송하는 함수
    function sendTransactionInfoToUploader(transactionAmount, bankInfo) {
        // 이미지를 올린 사용자의 정보를 가져오기
        const uploaderInfo = localStorage.getItem('uploaderInfo');

        // 여기에서 로컬 스토리지를 활용하여 거래 정보를 전송하는 로직 추가
        // 예: 이미지를 올린 사용자에게 거래 정보 메시지를 전송
        showTransactionRequestNotification(uploaderInfo);
    }
});
