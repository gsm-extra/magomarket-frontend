const searchInput = document.getElementById("search-input");

const showSearchResult = () => {
    let searchWord = searchInput.value;
    const userCount = parseInt(localStorage.getItem(USER_COUNT_KEY)) || 1;

    for (let i = 1; i <= userCount; i++) {
        const userNickname = localStorage.getItem(`${USERNICKNAME_KEY}_${i}`);
        if (userNickname && userNickname === searchWord) {
            // 찾은 사용자의 정보를 로컬 스토리지에서 가져와서 표시
            const foundUsername = localStorage.getItem(`${USERNAME_KEY}_${i}`);
            const foundNickname = localStorage.getItem(`${USERNICKNAME_KEY}_${i}`);

            nickname.innerText = `닉네임 : ${foundNickname}`;
            name.innerText = `이름 : ${foundUsername}`;

            // 다른 프로필을 보는 경우, 이미지 및 자기소개 등의 정보를 업데이트
            const savedProfileImage = localStorage.getItem(`profileImage${foundNickname}`);
            if (savedProfileImage) {
                document.getElementById('profileImage').src = savedProfileImage;
            }

            const savedText = localStorage.getItem(`userIntroduction${foundNickname}`);
            if (savedText) {
                document.getElementById("myTextarea").value = savedText;
                document.getElementById("output").innerHTML = savedText;
            }

            break;  // 사용자를 찾았으니 더 이상의 검색은 필요 없음
        }
    }

    searchWord = "";  // 검색어 초기화
};

const enterKey = (event) => {
    if (event.code === "Enter") {
        showSearchResult();
    }
};

searchInput.addEventListener("keypress", (event) => {
    enterKey(event);
});

    function toggleBtn1() {
        const textbox=document.getElementById('textbox');
        const plus=document.getElementById('plus');
        const saveButton=document.getElementById('saveButton');
        textbox.style.display = textbox.style.display === 'block' ? 'none' : 'block';
        plus.style.display=plus.style.display==='none' ? 'block' : 'none';
        saveButton.style.display=plus.style.display==='none' ? 'block' : 'none';
        document.getElementById("output").textContent="";
        }
        
        document.getElementById("saveButton").addEventListener("click", function(e) {
            var textToSave = document.getElementById("myTextarea").value;
            var formattedText = textToSave.replace(/\n/g, "<br>");
        
            // 현재 로그인한 사용자의 닉네임 가져오기
            const loggedInUserNickname = localStorage.getItem(`usernickname_${loggedInUserIndex}`);
        
            // 사용자마다 고유한 ID로 자기소개 저장
            localStorage.setItem(`userIntroduction${loggedInUserNickname}`, textToSave);
        
            textbox.style.display = '';
            saveButton.style.display = 'none';
            e.preventDefault();
            document.getElementById("output").innerHTML = formattedText;
            plus.style.display = plus.style.display === 'none' ? 'block' : 'none';
        });

        // 페이지 로드 시 로컬 스토리지에서 이미지 데이터 불러오기
        window.addEventListener("load", function () {
            var savedProfileImage = localStorage.getItem(`profileImage${savedUsernickname}`);
            if (savedProfileImage) {
                document.getElementById('profileImage').src = savedProfileImage;
            } else {
                // 이미지가 없는 경우 기본 이미지로 설정
                document.getElementById('profileImage').src = "../images/bg.png";
            }
            
            // 페이지 로드 시 사용자 정보를 표시
            var savedText = localStorage.getItem(`savedText${savedUsernickname}`);
            if (savedText) {
                document.getElementById("myTextarea").value = savedText;
                document.getElementById("output").innerHTML = savedText;
            }
            // 현재 로그인한 사용자의 닉네임 가져오기
            const loggedInUserNickname = localStorage.getItem(`usernickname_${loggedInUserIndex}`);

            // 사용자마다 고유한 ID로 저장된 자기소개 불러오기
            var savedText = localStorage.getItem(`userIntroduction${loggedInUserNickname}`);
            if (savedText) {
                document.getElementById("myTextarea").value = savedText;
                document.getElementById("output").innerHTML = savedText;
            }
        });

        function changeProfileImage() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = function (event) {
                var file = event.target.files[0];

                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var imageDataUrl = e.target.result;
                        document.getElementById('profileImage').src = imageDataUrl;

                        // 이미지 데이터를 로컬 스토리지에 저장
                        localStorage.setItem(`profileImage${savedUsernickname}`, imageDataUrl);
                    };

                    reader.readAsDataURL(file);
                }
            };

            input.click();
        }

        const USERNICKNAME_KEY = "usernickname";
        const USERNAME_KEY = "username";
        const PASSWORD_KEY = "password";
        const PAST = "history";
        const USER_COUNT_KEY = "usercount";

        const nickname = document.querySelector("#nickname");
        const name = document.querySelector("#name");

        const loggedInUserIndex = parseInt(localStorage.getItem("currentLoggedInUser")) || 1;
        const savedUsernickname = localStorage.getItem(`${USERNICKNAME_KEY}_${loggedInUserIndex}`);
        const savedPassword = localStorage.getItem(`${PASSWORD_KEY}_${loggedInUserIndex}`);
        const savedUsername = localStorage.getItem(`${USERNAME_KEY}_${loggedInUserIndex}`);

        nickname.innerText = `닉네임 : ${savedUsernickname}`;
        name.innerText = `이름 : ${savedUsername}`;

