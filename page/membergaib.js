const nicknameInput = document.querySelector("#nickname");
const nameInput = document.querySelector("#name");
const passwordInput = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

const USERNICKNAME_KEY = "usernickname";
const USERNAME_KEY = "username";
const PASSWORD_KEY = "password";
const USER_COUNT_KEY = "usercount";

function onLoginSubmit(event) {
  event.preventDefault();
  const usernickname = nicknameInput.value;
  const username = nameInput.value;
  const password = passwordInput.value;
  let userCount = parseInt(localStorage.getItem(USER_COUNT_KEY)) || 0;

  localStorage.setItem(`${USERNICKNAME_KEY}_${userCount + 1}`, usernickname);
  localStorage.setItem(`${USERNAME_KEY}_${userCount + 1}`, username);
  localStorage.setItem(`${PASSWORD_KEY}_${userCount + 1}`, password);
  localStorage.setItem(USER_COUNT_KEY, userCount + 1);

  // 새로 가입한 사용자를 로그인 상태로 설정
  localStorage.setItem("currentLoggedInUser", userCount + 1);

  window.location.href = "extra-home.html";
}

loginForm.addEventListener("submit", onLoginSubmit);
