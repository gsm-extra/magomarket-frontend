const searchInput = document.getElementById("search-input");

const showSearchResult = () => {
    let searchWord = searchInput.value;
		window.location.href = `https://google.com/search?q=${searchWord}`;
		searchWord = "";
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
        var formattedText=textToSave.replace(/\n/g, "<br>");
        localStorage.setItem("savedText", textToSave);
        textbox.style.display = '';
        saveButton.style.display = 'none';
        e.preventDefault();
        document.getElementById("output").innerHTML=formattedText;
        plus.style.display=plus.style.display==='none' ? 'block' : 'none';
    });
    window.addEventListener("load", function () {
        var savedText = localStorage.getItem("savedText");
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
                    localStorage.setItem("profileImage", imageDataUrl);
                };

                reader.readAsDataURL(file);
            }
        };

        input.click();
    }

    // 페이지 로드 시 로컬 스토리지에서 이미지 데이터 불러오기
    window.addEventListener("load", function () {
        var savedProfileImage = localStorage.getItem("profileImage");
        if (savedProfileImage) {
            document.getElementById('profileImage').src = savedProfileImage;
        }
    });

