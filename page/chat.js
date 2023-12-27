    import axios from 'axios';

    const myName = "건희";
    const Chat = (function() {
        let fileInput; // 전역 변수로 파일 입력 엘리먼트를 선언합니다.

        function init() {
            // Enter 키를 눌렀을 때 메시지 전송
            $(document).on('keydown', '#messageInput', function(e) {
                if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

            // 전송 버튼 클릭 시 메시지 전송
            $(document).on('click', '#sendMessageButton', function() {
                sendMessage();
            });

            // 이미지 업로드 input의 변경 이벤트 처리
            $(document).on('change', '#imageInput', function () {
                const fileInput = document.getElementById('imageInput');
                const file = fileInput.files[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imageDataUrl = e.target.result;
                        sendImage(imageDataUrl); // 이미지 업로드 시 이미지 전송 함수 호출
                    };

                    reader.readAsDataURL(file);
                }
            });
        }

        

        // 이미지를 채팅창에 추가하는 부분
        function appendImageTag(LR_className, senderName, imageUrl) {
            const chatLi = createMessageTag(LR_className, senderName, "");
            chatLi.find('.message span').html(`<img src="${imageUrl}" alt="이미지">`);
            $('div.chat:not(.format) ul').append(chatLi);
            // 스크롤 송출 시간.
            setTimeout(scrollToBottom, 0);
        }

        // 이미지를 전송하는 함수
        function sendImage(imageUrl) {
            const senderName = myName;
            const data = {
                "senderName": senderName,
                "message": "", // 이미지는 텍스트 없이 전송
                "image": imageUrl // 이미지 주소를 전송
            };
            // 여기서 서버로 이미지를 전송하고, 성공적으로 전송된 경우에만 아래 함수 호출
            appendImageTag("right", senderName, imageUrl);
            setTimeout(scrollToBottom, 0);
        }

        // 채팅 메시지를 전송하는 함수
        function sendMessage() {
            const message = $('#messageInput').val();
            if (message.trim() !== "") {
                const senderName = myName;
                const data = {
                    "senderName": senderName,
                    "message": message
                };
        
                if (message.toLowerCase() === '거래') {
                    // 거래 시작 메시지일 경우 거래 생성 함수 호출
                    createTransaction();
                } 
                else if(message.toLowerCase() === 'rjfo'){
                    createTransaction();
                }
                else {
                    // 일반 채팅 메시지인 경우 기존 로직 유지
                    resive(data);
                }
        
                clearTextarea();
            }
        }

        function clearTextarea() {
            $('#messageInput').val('');
            $('#moneyplus input').val(''); // 거래 입력창 초기화
        }

        function resive(data) {
            const LR = (data.senderName != myName) ? "left" : "right";
            appendMessageTag(LR, data.senderName, data.message);
        }

        return {
            'init': init
        };
    })();

    $(function(){
        Chat.init();
    });

    function scrollToBottom() {
        const chatDiv = document.querySelector('.chat');
        if (chatDiv) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    }

    const chatDiv = document.querySelector('.chat');
    const observer = new MutationObserver((mutationsList) => {
        scrollToBottom();
    });

    observer.observe(chatDiv, { childList: true });

    $(document).on('click', '.upload-button', function () {
        $('#imageInput').click();
    });

    $(document).on('change', '#imageInput', function () {
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/send-message',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response);
                },
                error: function (error) {
                    console.error(error);
                }
            });
        }
    });

    function clearImageInput() {
        $('#imageInput').val('');
    }

    // 이미지를 로컬 스토리지에 저장하는 함수
    function saveImageToLocalStorage(imageDataUrl) {
        localStorage.setItem("profileImage", imageDataUrl);
    }

    // 로컬 스토리지에서 이미지를 가져와서 프로필 이미지를 설정하는 함수
    function setProfileImageFromLocalStorage() {
        var savedProfileImage = localStorage.getItem("profileImage");
        if (savedProfileImage) {
            document.getElementById('profileImage').src = savedProfileImage;
        }
    }

    // 이미지를 선택하고 저장하는 함수
    function uploadimg() {
        // 이미 생성된 파일 입력 엘리먼트가 없다면 새로 생성합니다.
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.onchange = function (event) {
                var file = event.target.files[0];

                if (file) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var imageDataUrl = e.target.result;

                        // 이미지를 로컬 스토리지에 저장
                        saveImageToLocalStorage(imageDataUrl);

                        // 프로필 이미지를 설정
                        setProfileImageFromLocalStorage();

                        // 이미지 출력 및 스크롤 송출
                        appendImageTag("right", myName, imageDataUrl);
                        setTimeout(scrollToBottom, 0);
                    };

                    reader.readAsDataURL(file);
                }
            };
        }

        // 생성한 파일 입력 엘리먼트를 클릭하여 파일 창을 엽니다.
        fileInput.click();
    }

    // 페이지 로드 시 저장된 이미지를 프로필 이미지로 설정
    window.addEventListener("load", function () {
        setProfileImageFromLocalStorage();
    });

    // 페이지 로드 시 처음 이미지를 선택하여 설정
    document.addEventListener("DOMContentLoaded", function () {
        // 초기 이미지 출력
        const savedProfileImage = localStorage.getItem("profileImage");
        if (savedProfileImage) {
            setProfileImageFromLocalStorage();
            appendImageTag("right", myName, savedProfileImage);
            scrollToBottom();
        }
    });

    // MutationObserver를 초기화합니다.
    const dynamicChatDiv = document.querySelector('.dynamic-chat');
    const observerDynamicChat = new MutationObserver(() => {
        scrollToBottom();
    });

    // MutationObserver를 dynamic-chat에 적용합니다.
    observerDynamicChat.observe(dynamicChatDiv, { childList: true });

    // createTransaction 함수 수정 (닫기 버튼을 거절 X 버튼으로 변경)
    function createTransaction() {
        // 새로운 div 엘리먼트 생성
        var dynamicDiv = document.createElement('div');
        dynamicDiv.className = 'dynamic-chat';

        // div에 내용 추가 (거래 메시지 내용 추가)
        dynamicDiv.innerHTML = `
            <div class="Transaction" id="Transaction">
                <span class="tt" name="tt">${myName}님이 거래를 시작하려 합니다</span>
                <div class="moneyplus" id="moneyplus">
                    <input class="money" name="money" autocomplete="off" maxlength="7" minlength="3" required placeholder="가격을 적어주세요(숫자만)">
                </div>
                <div class="okorno" id="okorno">
                    <span class="ok" onclick="acceptTransaction()">수락 ○</span>
                    <span class="no" onclick="rejectTransaction()"> 거절 X</span>
                </div>
            </div>
        `;

        // 동적으로 생성된 div에 스타일 추가 (오른쪽 정렬)
        dynamicDiv.style.float = 'right'; // 오른쪽 정렬을 위한 스타일 추가

        // 생성한 div를 채팅 창에 추가
        document.querySelector('.chat_wrap .chat ul').appendChild(dynamicDiv);

        // 거래 창 내의 input 요소 찾기
        const moneyInput = dynamicDiv.querySelector('.money');

        // Enter 키를 눌렀을 때 Span으로 변경
        moneyInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const price = moneyInput.value.trim();
                if (price !== '') {
                    // 스팬 엘리먼트를 생성하고 텍스트를 추가합니다.
                    const priceSpan = document.createElement('span');
                    priceSpan.textContent = `${price}원`;

                    // 입력 엘리먼트를 스팬 엘리먼트로 교체합니다.
                    moneyInput.parentNode.replaceChild(priceSpan, moneyInput);

                    // 스팬 엘리먼트에 고유한 ID 추가
                    const spanId = 'transactionAmountSpan_' + Date.now();
                    priceSpan.setAttribute('id', spanId);

                    // 여기서 거래 금액 정보(price)를 활용하여 필요한 작업을 수행할 수 있습니다.

                    // 거래 수락 창에서 거래 금액을 표시하는데 사용할 수 있도록 span ID를 반환
                    return spanId;
                }
            }
        });

        // 새로운 거래 메시지를 채팅창에 추가했을 때 스크롤을 아래로 이동
        setTimeout(scrollToBottom, 0);
    }


    // 거절 함수를 정의
    function rejectTransaction() {
        // 거래 창을 닫습니다.
        closeTransaction();
    }

    // closeTransaction 함수를 정의 (이미 정의되어 있지만, rejectTransaction에서 사용되므로 재확인)
    function closeTransaction() {
        // 동적으로 생성된 거래 창을 찾아서 제거
        const transactionDiv = document.querySelector('.dynamic-chat');
        if (transactionDiv) {
            transactionDiv.remove();
        }
    }



    // 채팅 메시지를 추가하는 함수
    function appendMessageTag(LR_className, senderName, message) {
        const chatLi = createMessageTag(LR_className, senderName, message);

        // 거래 메시지가 아닌 경우에만 추가
        if (!chatLi.hasClass('Transaction')) {
            const chatMessage = chatLi.find('.message'); // message 클래스를 가진 요소 선택
            chatMessage.addClass('right'); // 오른쪽 정렬 스타일을 추가
        }

        $('div.chat:not(.format) ul').append(chatLi);
        
        // 새로운 메시지를 채팅창에 추가했을 때 스크롤을 아래로 이동
        setTimeout(scrollToBottom, 0);
    }

    // 수락한 거래 정보를 저장할 변수
    let acceptedTransactionData;

    // 거래 수락 후 메시지를 전송하는 함수
    function acceptTransaction() {
        // 거래 메시지를 가져옵니다.
        const transactionMessage = $('#Transaction .money span').text();

        // 거래 금액을 가져옵니다.
        const transactionAmount = getTransactionAmount();

        if (transactionAmount) {
            // 수락 다이얼로그를 표시합니다.
            showAcceptanceDialog(transactionAmount, transactionMessage);
        }
    }

    // 거래 금액을 가져오는 함수
    function getTransactionAmount() {
        // 거래 창의 input 또는 span 엘리먼트를 가져옵니다.
        const transactionInput = $('#moneyplus input, #moneyplus span');

        if (transactionInput.length > 0) {
            // 엘리먼트의 타입을 확인하여 처리합니다.
            const inputType = transactionInput.prop('tagName').toLowerCase();

            if (inputType === 'input') {
                // input 엘리먼트인 경우 값을 가져옵니다.
                return transactionInput.val().trim();
            } else if (inputType === 'span') {
                // span 엘리먼트인 경우 텍스트 내용을 가져옵니다.
                return transactionInput.text().trim();
            }
        }

        // 거래 금액이 없는 경우 빈 문자열을 반환합니다.
        return '';
    }



    // createMessageTag 함수를 정의
    function createMessageTag(LR_className, senderName, message) {
        const chatLi = $('div.chat.format ul li').clone();
        chatLi.addClass(LR_className);
        chatLi.find('.sender span').text(senderName);
        chatLi.find('.message span').text(message);
        return chatLi;
    }

    // 채팅 메시지를 추가하는 함수
    function appendMessageTag(LR_className, senderName, message) {
        const chatLi = createMessageTag(LR_className, senderName, message);

        // 거래 메시지가 아닌 경우에만 추가
        if (!chatLi.hasClass('Transaction')) {
            const chatMessage = chatLi.find('.message'); // message 클래스를 가진 요소 선택
            chatMessage.addClass('right'); // 오른쪽 정렬 스타일을 추가
        }

        $('div.chat:not(.format) ul').append(chatLi);

        // 새로운 메시지를 채팅창에 추가했을 때 스크롤을 아래로 이동
        setTimeout(scrollToBottom, 0);
    }

    // resive 함수를 정의
    function resive(data) {
        const LR = (data.senderName != myName) ? "left" : "right";
        appendMessageTag(LR, data.senderName, data.message);
    }

    // 거래 수락 후 메시지를 전송하는 함수
    function sendMessageWithTransaction(message) {
        // myName 변수를 가져와서 사용합니다.
        const senderName = myName;

        const data = {
            "senderName": senderName,
            "message": message
        };

        // resive 함수 호출
        resive(data);
        setTimeout(scrollToBottom, 0);
    }


    // 수락 다이얼로그를 닫는 함수
    function closeAcceptanceDialog() {
        // 문서에서 수락 다이얼로그를 제거합니다.
        $('.acceptance-dialog').remove();
    }

    // 수락 다이얼로그를 표시하는 함수
    function showAcceptanceDialog(transactionAmount, transactionMessage) {
        const uniqueId = 'acceptBankAccount_' + Date.now(); // 현재 시간을 사용하여 고유한 ID 생성
        const acceptanceDialog = `
            <div class="acceptance-dialog">
                <h3>거래를 수락하시겠습니까?</h3>
                <p>거래 금액: <span id="transactionAmount">${transactionAmount}</span></p>
                <label for="${uniqueId}">계좌 정보 입력</label>
                <input type="text" id="${uniqueId}" placeholder="계좌 정보를 입력하세요">
                <button onclick="acceptTransactionWithBankInfo('${uniqueId}', '${transactionMessage}', '${transactionAmount}')">거래 수락</button>
                <button onclick="closeAcceptanceDialog()">취소</button>
            </div>
        `;

        $('body').append(acceptanceDialog);
    }


    function acceptTransactionWithBankInfo(uniqueId, transactionMessage, transactionAmount) {
        // 수락된 거래 정보를 초기화합니다.
        let acceptedTransactionData = {};

        // 거래 창의 input 엘리먼트를 가져옵니다.
        const moneyInput = $('#moneyplus input, #moneyplus span').get(0); // 수정된 부분
        const bankInfoInput = $(`#${uniqueId}`).get(0); // 또는 $(`#${uniqueId}`)[0];

        console.log('moneyInput:', moneyInput);
        console.log('bankInfoInput:', bankInfoInput);

        if (moneyInput && bankInfoInput) {
            // input 또는 span인 경우 값을 가져옵니다.
            const acceptedTransactionAmount = $(moneyInput).is('span') ? $(moneyInput).text().trim() : $(moneyInput).val().trim();
            const bankInfo = $(bankInfoInput).val().trim();

            // 수락된 거래 정보를 저장합니다.
            acceptedTransactionData = {
                "transactionAmount": acceptedTransactionAmount,
                "bankInfo": bankInfo
            };

            // 수락 다이얼로그를 닫습니다.
            closeAcceptanceDialog();

            // 거래 수락 메시지를 생성
            const message = `거래를 수락하였습니다. 거래 금액: ${acceptedTransactionAmount}. 계좌 정보: ${bankInfo}`;

            // 거래 수락 메시지를 전송
            sendMessageWithTransaction(message);

            // 여기서 거래 창에 거래 금액을 반영할 수 있습니다.
            // 예를 들어, 거래 창에 있는 span 엘리먼트에 거래 금액을 추가하는 등의 작업을 수행할 수 있습니다.
            const transactionAmountSpan = $('#Transaction .tt');
            transactionAmountSpan.text(`□□□님이 ${acceptedTransactionAmount} 거래를 시작하려 합니다`);

            // 고유한 ID를 가진 span 엘리먼트를 가져와서 거래 창에 있는 거래 금액 span에 적용
            const acceptanceDialogTransactionAmountSpan = $(`#${uniqueId}`);
            acceptanceDialogTransactionAmountSpan.text(`거래 금액 : ${acceptedTransactionAmount}, 계좌 정보 : ${bankInfo}`);
        } else {
            console.error('Error: Either moneyInput or bankInfoInput is undefined.');
        }
    }
