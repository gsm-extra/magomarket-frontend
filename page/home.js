  const POSTIMAGE = "postimage";
  const TEXTDATA = "posttext";
  const savedPostNumber = "postnumber";
  const pullPostNumber = localStorage.getItem(savedPostNumber);

  const allPostedData = [];
  for (let i = pullPostNumber; i >= 0; i--) {
    const images = JSON.parse(localStorage.getItem(`${POSTIMAGE}_${i}`));
    const text = localStorage.getItem(`${TEXTDATA}_${i}`);
    if (images && images.length > 0) {
      allPostedData.push({ images, text });
    }
  }

  // 이미지와 텍스트를 화면에 표시
if (allPostedData.length > 0) {
  const imageContainer = document.getElementById('scroll');
  allPostedData.forEach((postData, index) => {
    // 이미지 표시
    const images = postData.images;
    images.forEach((imageDataUrl, imgIndex) => {
      const imageElement = document.createElement('img');
      imageElement.src = imageDataUrl;
      imageElement.alt = `Posted Image ${index + 1} - ${imgIndex + 1}`;

      // 클래스 추가
      imageElement.classList.add('jiji');

      // 이미지 클릭 이벤트 추가
      imageElement.addEventListener('click', function () {
        handleImageClick(imageDataUrl);
      });

      // 이미지를 감싸는 div 생성
      const imageWrapper = document.createElement('div');
      imageWrapper.appendChild(imageElement);
      imageContainer.appendChild(imageWrapper);
    });

    // 텍스트 표시
    const textElement = document.createElement('p');
    textElement.innerText = postData.text || "작성한 문장이 없습니다.";
    imageContainer.appendChild(textElement);

    // 각 이미지와 텍스트를 구분하는 라인 추가 (선택적)
    const lineElement = document.createElement('hr');
    imageContainer.appendChild(lineElement);
  });
}

  // 이미지 클릭 시 처리하는 함수
  function handleImageClick(selectedImageUrl) {
    // 선택한 이미지의 URL을 저장
    localStorage.setItem('selectedImageUrl', selectedImageUrl);

    // 거래 페이지로 전환
    window.location.href = 'extra-Trance.html'; // 거래 페이지의 HTML 파일 경로로 수정
  }
