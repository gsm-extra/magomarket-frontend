let currentSlide = 0;
let slideCount = document.querySelectorAll('.slide').length;

function removeSlideIfEmpty(removedSlide) {
  if (removedSlide && !removedSlide.querySelector('img')) {
    const sliderContainer = document.getElementById('slider-container');
    sliderContainer.removeChild(removedSlide);

    // 추가: 슬라이드가 제거된 후에도 빈 슬라이드가 있는지 확인하고 제거
    const blankSlides = document.querySelectorAll('.slide:empty');
    blankSlides.forEach(blankSlide => {
      sliderContainer.removeChild(blankSlide);
    });
  }
}


function removeRecentSlide(removedSlideKey) {
  const sliderContainer = document.getElementById('slider-container');
  const slides = sliderContainer.querySelectorAll('.slide');
  slideCount--;

  if (slides.length > 0) {
    const uploadedSlides = Array.from(slides).filter(slide => slide.id.startsWith('slide'));
    const removedSlide = slides[slides.length - 1];

    if (!removedSlide.querySelector('img')) {
      removedSlide.id = 'slide' + slideCount;
    }

    const currentSlideDisplay = removedSlide.style.display;

    sliderContainer.removeChild(removedSlide);

    if (currentSlideDisplay === 'block') {
      const firstUploadedSlide = uploadedSlides.find(slide => slide.id === 'slide1');
      if (firstUploadedSlide) {
        firstUploadedSlide.style.display = 'block';
        currentSlide = 0;
      } else if (slides.length > 0) {
        currentSlide = 0;
        showSlide(currentSlide);
      }
    }
  }
}

function setThumbnail(event) {
  var reader = new FileReader();
  var imageCount; // 추가: 이미지 개수를 지역 변수로 선언

  reader.onload = function (event) {
    var img = document.createElement('img');
    img.setAttribute('src', event.target.result);
    document.querySelector('#image_container').appendChild(img);

    imageCount = document.querySelectorAll('div#image_container img').length; // 수정: 이미지 개수 업데이트

    var imageDataUrl = event.target.result;
    const currentSlideKey = 'slide' + imageCount;

    if (imageCount === 1) {
      // 초기에 이미지가 없는 경우에만 슬라이드 추가
      slideCount += 1;
      const sliderContainer = document.getElementById('slider-container');
      const newDiv = document.createElement('div');
      newDiv.className = 'slide';
      newDiv.id = currentSlideKey;
      newDiv.innerHTML = '<img src="' + imageDataUrl + '">';
      sliderContainer.appendChild(newDiv);

      document.querySelector('.slider').style.display = 'none';
      document.querySelector('.slider-button').style.display = 'none';

      currentSlide++;
      showSlide(currentSlide);
    } else if (currentSlide < imageCount && imageCount != 1) {
      // 이미지가 있는 경우에만 빈 슬라이드 추가하지 않음
      removeSlideIfEmpty(document.getElementById('slide' + (imageCount - 1)));
      slideCount += 1;
      const sliderContainer = document.getElementById('slider-container');
      const newDiv = document.createElement('div');
      newDiv.className = 'slide';
      newDiv.id = currentSlideKey;
      newDiv.innerHTML = '<img src="' + imageDataUrl + '">';
      sliderContainer.appendChild(newDiv);

      document.querySelector('.slider').style.display = 'block';
      document.querySelector('.slider-button').style.display = 'block';

      if (imageCount === 2) {
        const firstSlide = document.getElementById('slide1');
        if (firstSlide) {
          firstSlide.style.display = 'block';
        }
      }

      if (currentSlide > 2) {
        slideCount += 1;
      }
    }
  };

  reader.readAsDataURL(event.target.files[0]);
}


function removeSlide() {
  const sliderContainer = document.getElementById('slider-container');
  const slides = sliderContainer.querySelectorAll('.slide');
  slideCount--;

  if (slides.length > 0) {
    const uploadedSlides = Array.from(slides).filter(slide => slide.id.startsWith('slide'));
    const firstUploadedSlide = uploadedSlides[0];
    const removedSlide = slides[slides.length - 1];

    if (!removedSlide.querySelector('img')) {
      removedSlide.id = 'slide' + slideCount;
    }

    const currentSlideDisplay = removedSlide.style.display;

    sliderContainer.removeChild(removedSlide);

    if (currentSlideDisplay === 'block') {
      if (firstUploadedSlide) {
        firstUploadedSlide.style.display = 'block';
        currentSlide = 0;
      } else if (slides.length > 0 && removedSlide === slides[slides.length - 1]) {
        currentSlide = 0;
        showSlide(currentSlide);
      }
    }
  }
}

function removeImage() {
  var imageContainer = document.querySelector('div#image_container');
  var images = imageContainer.querySelectorAll('img');

  if (images.length >= 1) {
    const removedSlideKey = 'slide' + images.length;
    localStorage.removeItem(removedSlideKey);

    const removedSlide = document.getElementById(removedSlideKey);
    const currentSlideDisplay = removedSlide ? removedSlide.style.display : null;

    removeRecentSlide(removedSlideKey);

    imageContainer.removeChild(images[images.length - 1]);

    // 해당하는 슬라이드 제거
    const removedSlideIndex = parseInt(removedSlideKey.replace('slide', ''), 10);
    const correspondingSlide = document.getElementById('slide' + removedSlideIndex);
    if (correspondingSlide) {
      const correspondingSlideDisplay = correspondingSlide.style.display;
      removeSlideIfEmpty(correspondingSlide);

      if (correspondingSlideDisplay === 'block') {
        // 현재 보고 있는 슬라이드가 삭제되면 첫 번째 슬라이드를 표시
        const firstSlide = document.getElementById('slide1');
        if (firstSlide) {
          showSlide(0);
          currentSlide = 0;
        }
      }
    }

    // 삭제 후에 빈 슬라이드도 제거
    const blankSlides = document.querySelectorAll('.slide:empty');
    blankSlides.forEach(blankSlide => {
      removeSlideIfEmpty(blankSlide);
    });

    if (images.length === 1) {
      currentSlide = 0;
    } else if (currentSlide === images.length) {
      currentSlide = 1;
      showSlide(currentSlide);
    } else {
      const firstSlide = document.getElementById('slide1');
      if (firstSlide) {
        showSlide(0);
        currentSlide = 0;
      } else if (images.length > 0) {
        currentSlide = 0;
        showSlide(currentSlide);
      }

      if (removedSlide && currentSlideDisplay === 'block') {
        currentSlide = 0;
        showSlide(currentSlide);
      }
    }

    if (images.length === 2) {
      document.querySelector('.slider').style.display = 'none';
      document.querySelector('.slider-button').style.display = 'none';
    }
  }
}


function showSlide(n) {
  const slides = document.querySelectorAll('.slide');

  slides.forEach((slide, index) => {
    if (index === n) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slideCount;
  showSlide(currentSlide);
}

function prevSlide() {
  if (currentSlide > 1) {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nextButton = document.getElementById('nextBtn');
  const prevButton = document.getElementById('prevBtn');
  console.log(slideCount);
  nextButton.addEventListener('click', () => {
    if (currentSlide === slideCount - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    showSlide(currentSlide);
  });

  prevButton.addEventListener('click', prevSlide);

  showSlide(currentSlide);
});
