const nicknameInput = document.querySelector("#nickname");
const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

const USERNICKNAME_KEY = "usernickname";
const PASSWORD_KEY = "password";
const USER_COUNT_KEY = "usercount";

let userCount = parseInt(localStorage.getItem(USER_COUNT_KEY)) || 0;

function Check(event){
    event.preventDefault();
    
    const usernickname = nicknameInput.value;
    const password = passwordInput.value;

    for (let i = 1; i <= userCount; i++) {
        const savedUsernickname = localStorage.getItem(`${USERNICKNAME_KEY}_${i}`);
        const savedPassword = localStorage.getItem(`${PASSWORD_KEY}_${i}`);

        if (usernickname === savedUsernickname && password === savedPassword) {
            localStorage.setItem("currentLoggedInUser", i);

            setTimeout(function () {
                localStorage.removeItem(PAST);
            }, 0);
            setTimeout(function () {
                window.location.href = "page/extra-home.html";
            }, 0);
            return;
        }
    }

    alert("로그인 실패: 사용자 이름 또는 비밀번호가 일치하지 않습니다.");
}

const savedUsernickname = localStorage.getItem(`${USERNICKNAME_KEY}_${userCount}`);
const savedPassword = localStorage.getItem(`${PASSWORD_KEY}_${userCount}`);

if(savedUsernickname === null && savedPassword === null){
    window.location.href="page/extra-membergaib.html";
}
else{
    loginForm.addEventListener("submit", Check);
}
