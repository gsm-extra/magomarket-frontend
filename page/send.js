let currentSlide = 0;
let slideCount = document.querySelectorAll('.slide').length;

async function resizeImage(base64Str, maxWidth, maxHeight) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const resizedBase64 = canvas.toDataURL('image/png');
      resolve(resizedBase64);
    };

    img.src = base64Str;
  });
}

function removeSlideIfEmpty(removedSlide) {
  if (removedSlide && !removedSlide.querySelector('img')) {
    const sliderContainer = document.getElementById('slider-container');
    sliderContainer.removeChild(removedSlide);

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

async function setThumbnail(event) {
  var reader = new FileReader();
  var imageCount;

  reader.onload = async function (event) {
    var img = document.createElement('img');
    img.setAttribute('src', event.target.result);
    document.querySelector('#image_container').appendChild(img);

    imageCount = document.querySelectorAll('div#image_container img').length;

    const imagePath = URL.createObjectURL(event.target.files[0]);
    const currentSlideKey = 'slide' + imageCount;

    if (imageCount === 1) {
      slideCount += 1;
      const sliderContainer = document.getElementById('slider-container');
      const newDiv = document.createElement('div');
      newDiv.className = 'slide';
      newDiv.id = currentSlideKey;

      // Resize the image before displaying
      const resizedImagePath = await resizeImage(imagePath, 300, 300);

      newDiv.innerHTML = '<img src="' + resizedImagePath + '" style="object-fit: contain;">';
      sliderContainer.appendChild(newDiv);

      document.querySelector('.slider').style.display = 'none';
      document.querySelector('.slider-button').style.display = 'none';

      currentSlide++;
      showSlide(currentSlide);
    } else if (currentSlide < imageCount && imageCount != 1) {
      removeSlideIfEmpty(document.getElementById('slide' + (imageCount - 1)));
      slideCount += 1;
      const sliderContainer = document.getElementById('slider-container');
      const newDiv = document.createElement('div');
      newDiv.className = 'slide';
      newDiv.id = currentSlideKey;

      // Resize the image before displaying
      const resizedImagePath = await resizeImage(imagePath, 300, 300);

      newDiv.innerHTML = '<img src="' + resizedImagePath + '" style="object-fit: contain;">';
      sliderContainer.appendChild(newDiv);

      document.querySelector('.slider').style.display = 'block';
      document.querySelector('.slider-button').style.display = 'block';

      const currentSlide = document.querySelector('.slide:not([style="display: none;"])');
      if (currentSlide) {
        currentSlide.style.display = 'none';
        const nextSlide = document.querySelector('.slide:not([style="display: block;"])');
        if (nextSlide) {
          nextSlide.style.display = 'block';
        }
      } else {
        const nextSlide = document.querySelector('.slide:not([style="display: block;"])');
        if (nextSlide) {
          nextSlide.style.display = 'none';
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
    postnumber += 1;

    const removedSlideKey = 'slide' + postnumber;
    localStorage.removeItem(removedSlideKey);

    const removedSlide = document.getElementById(removedSlideKey);
    const currentSlideDisplay = removedSlide ? removedSlide.style.display : null;

    removeRecentSlide(removedSlideKey);

    imageContainer.removeChild(images[images.length - 1]);

    const removedSlideIndex = parseInt(removedSlideKey.replace('slide', ''), 10);
    const correspondingSlide = document.getElementById('slide' + removedSlideIndex);
    if (correspondingSlide) {
      const correspondingSlideDisplay = correspondingSlide.style.display;
      removeSlideIfEmpty(correspondingSlide);

      if (correspondingSlideDisplay === 'block') {
        const firstSlide = document.getElementById('slide1');
        if (firstSlide) {
          showSlide(0);
          currentSlide = 0;
        }
      }
    }

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

const POSTIMAGE = "postimage";
const TEXTDATA = "posttext";

const savedPostNumber = "postnumber";
const textInput = document.querySelector("#text");
const submitButton = document.querySelector("#submit");

let postnumber = parseInt(localStorage.getItem(savedPostNumber)) || 0;

function submitPost() {
  const textData = textInput.value;
  localStorage.setItem(TEXTDATA, textData);

  const imageContainer = document.querySelector('div#image_container');
  const images = imageContainer.querySelectorAll('img');
  const imageArray = [];

  images.forEach((image, index) => {
    const imagePath = image.src;

    imageArray.push(imagePath);
  });

  postnumber += 1;

  localStorage.setItem(`${POSTIMAGE}_${postnumber}`, JSON.stringify(imageArray));
  localStorage.setItem(`${TEXTDATA}_${postnumber}`, textData);
  localStorage.setItem(savedPostNumber, postnumber);

  window.location.href = "extra-home.html";
}
