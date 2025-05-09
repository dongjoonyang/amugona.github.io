// 탭 메뉴
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab_content');
const btnBuzzer = document.querySelector('#btnBuzzer');
const buzzerCount = btnBuzzer.querySelector('.count'); // count 클래스를 가진 span 요소 직접 선택
const 탭별뽑기횟수 = {}; // 탭별 뽑기 횟수를 저장하는 객체

tabs.forEach(tab => {
    const tabIndex = tab.getAttribute('data-tab');
    탭별뽑기횟수[tabIndex] = 3; // 각 탭의 뽑기 횟수를 초기화

    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(c => {
            c.classList.remove('active');
            if (c.getAttribute('data-content') === target) {
                c.classList.add('active');
            }
        });

        // 현재 탭의 뽑기 횟수를 업데이트
        뽑기횟수 = 탭별뽑기횟수[target];
        buzzerCount.textContent = 뽑기횟수; // span 요소의 textContent 업데이트
        btnBuzzer.innerHTML = `뽑기 <span class="count">${뽑기횟수}</span>`;
        btnBuzzer.disabled = 뽑기횟수 === 0;
    });
});

// 탭 메뉴 안 내용 클릭시 활성화 및 아바타 변경
const boxBtn = document.querySelectorAll('.tab_content_area .box');
const visualFace = document.querySelector('.visual_face');
const visualEyes = document.querySelector('.visual_eyes');
const visualNoise = document.querySelector('.visual_noise');
const visualMouth = document.querySelector('.visual_mouth'); // 입 부분 추가

const visualElements = {
    1: visualFace,
    2: visualEyes,
    3: visualNoise,
    4: visualMouth // 해당되는 visual element 연결
};

boxBtn.forEach(box => {
    box.addEventListener('click', () => {
        boxBtn.forEach(b => b.classList.remove('active'));
        box.classList.add('active');

        const tabContent = box.closest('.tab_content');
        const tabNumber = tabContent.getAttribute('data-content');
        const img = box.querySelector('img');

        if (tabNumber === '1' && img) {
            visualFace.style.backgroundImage = `url('${img.src}')`;
        } else if (tabNumber === '2' && img) {
            visualEyes.style.backgroundImage = `url('${img.src}')`;
        } else if (tabNumber === '3' && img) {
            visualNoise.style.backgroundImage = `url('${img.src}')`;
        } else if (tabNumber === '4' && img) {
            visualMouth.style.backgroundImage = `url('${img.src}')`;
        }
    });
});

// 뽑기 버튼 클릭시 레이어 및 랜덤 선택 (회전 효과 추가)
const dimLayer = document.getElementById('dimLayer');
const dimLayerContent = dimLayer.querySelector('.dim_layer_content p:last-child .count'); // 팝업 카운트 span
let rotationInterval;
let selectionInterval;
let countdownInterval;

btnBuzzer.addEventListener('click', () => {
    const activeTab = document.querySelector('.tab.active');
    const activeTabIndex = activeTab.getAttribute('data-tab');

    if (탭별뽑기횟수[activeTabIndex] > 0) {
        dimLayer.classList.add('active');
        let count = 3;
        dimLayerContent.textContent = count;
        const currentCount = 탭별뽑기횟수[activeTabIndex] - 1;
        buzzerCount.textContent = currentCount; // span 요소의 textContent 업데이트
        btnBuzzer.disabled = true;

        const activeTabContent = document.querySelector('.tab_content.active');
        const boxes = activeTabContent.querySelectorAll('.box');
        let randomIndex = 0;

        // 회전 애니메이션 시작
        boxes.forEach(box => box.classList.add('rotating'));

        selectionInterval = setInterval(() => {
            randomIndex = Math.floor(Math.random() * boxes.length);
            boxes.forEach(b => b.classList.remove('active')); // 기존 active 제거
            boxes[randomIndex].classList.add('active'); // 랜덤한 box에 active 추가
        }, 200); // 회전 속도 (값이 작을수록 빠름)

        // 팝업 카운트다운 시작
        let popupCount = 3;
        dimLayerContent.textContent = popupCount;
        countdownInterval = setInterval(() => {
            popupCount--;
            dimLayerContent.textContent = popupCount;
            if (popupCount === 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(selectionInterval);
            clearInterval(countdownInterval); // 팝업 카운트다운도 함께 종료
            boxes.forEach(box => box.classList.remove('rotating')); // 회전 애니메이션 종료
            dimLayer.classList.remove('active');
            btnBuzzer.disabled = false;
            탭별뽑기횟수[activeTabIndex]--; // 현재 탭의 뽑기 횟수 감소
            뽑기횟수 = 탭별뽑기횟수[activeTabIndex]; // 전역 변수 업데이트
            buzzerCount.textContent = 뽑기횟수; // span 요소의 textContent 업데이트
            btnBuzzer.innerHTML = 뽑기횟수 === 0 ? '뽑기 완료' : `뽑기 <span class="count">${뽑기횟수}</span>`;

            // 최종 선택된 active box의 이미지로 아바타 변경
            const finalActiveBox = activeTabContent.querySelector('.box.active');
            if (finalActiveBox) {
                const tabNumber = activeTabContent.getAttribute('data-content');
                const img = finalActiveBox.querySelector('img');
                if (tabNumber === '1' && img) {
                    visualFace.style.backgroundImage = `url('${img.src}')`;
                } else if (tabNumber === '2' && img) {
                    visualEyes.style.backgroundImage = `url('${img.src}')`;
                } else if (tabNumber === '3' && img) {
                    visualNoise.style.backgroundImage = `url('${img.src}')`;
                } else if (tabNumber === '4') {
                    visualMouth.style.backgroundImage = `url('${img.src}')`;
                }
            }
        }, 3000); // 3초 후 종료
    } else {
        alert('더 이상 뽑을 수 없습니다!');
    }
});

// 초기화 버튼
const btnReset = document.getElementById('btn_reset');
btnReset.addEventListener('click', () => {
    // 탭 초기화 및 뽑기 횟수 초기화
    tabs.forEach((tab, index) => {
        const tabIndex = tab.getAttribute('data-tab');
        탭별뽑기횟수[tabIndex] = 3; // 각 탭의 뽑기 횟수 초기화
        if (index === 0) {
            tab.classList.add('active');
            뽑기횟수 = 3;
            buzzerCount.textContent = 뽑기횟수; // span 요소의 textContent 업데이트
            btnBuzzer.innerHTML = `뽑기 <span class="count">${뽑기횟수}</span>`;
            btnBuzzer.disabled = false;
        } else {
            tab.classList.remove('active');
        }
    });

    // 탭 내용 초기화
    contents.forEach((content, index) => {
        if (index === 0) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // 얼굴 탭 내부 버튼 초기화
    const faceTabBoxes = contents[0].querySelectorAll('.box');
    faceTabBoxes.forEach((box, index) => {
        if (index === 0) {
            box.classList.add('active');
            const img = box.querySelector('img');
            if (img) {
                visualFace.style.backgroundImage = `url('${img.src}')`;
            } else {
                visualFace.style.backgroundImage = `url('/img/img_face1.png')`; // 기본 이미지
            }
        } else {
            box.classList.remove('active');
        }
    });

    // 눈, 코, 입 초기화 (첫 번째 요소 활성화 및 visual 초기화)
    contents.forEach((content, index) => {
        if (index > 0) {
            const boxes = content.querySelectorAll('.box');
            boxes.forEach((box, idx) => {
                if (idx === 0) {
                    box.classList.add('active');
                    const img = box.querySelector('img');
                    if (index === 1 && img) {
                        visualEyes.style.backgroundImage = `url('${img.src}')`;
                    } else if (index === 2 && img) {
                        visualEyes.style.backgroundImage = `url('${img.src}')`;
                    } else if (index === 3) {
                        visualNoise.style.backgroundImage = `url('${img.src}')`;
                    } else if (index === 4) {
                        visualMouth.style.backgroundImage = `url('${img.src}')`;
                    }
                } else {
                    box.classList.remove('active');
                }
            });
        }
    });

    clearInterval(rotationInterval);
    clearInterval(selectionInterval);
    clearInterval(countdownInterval);
});