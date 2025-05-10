// 탭 메뉴
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab_content');
const btnBuzzer = document.querySelector('#btnBuzzer');
const buzzerCount = btnBuzzer.querySelector('.count'); // count 클래스를 가진 span 요소 직접 선택
const 탭별뽑기횟수 = {}; // 탭별 뽑기 횟수를 저장하는 객체
const randomThums = document.querySelectorAll('.random_thum_area .thum');

// 팝업 관련 요소
const showLayerBtn = document.getElementById('showLayerBtn');
const randomLayer = document.getElementById('randomLayer');
const randomVisualFace = randomLayer.querySelector('.visual_face');
const randomVisualEyes = randomLayer.querySelector('.visual_eyes');
const randomVisualNoise = randomLayer.querySelector('.visual_noise');
const randomVisualMouth = randomLayer.querySelector('.visual_mouth');
const dimmedBackground = document.querySelector('.dimmed_background');

// 탭과 썸네일 연결 (data-tab 속성 값과 일치)
const tabToThum = {
    1: document.querySelector('.random_thum_area .thum.type1'), // 몸통
    2: document.querySelector('.random_thum_area .thum.type2'), // 눈
    3: document.querySelector('.random_thum_area .thum.type3'), // 입
    4: document.querySelector('.random_thum_area .thum.type4')  // 색상
};

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

        // 썸네일 업데이트
        updateThum(target);
    });
});

function updateThum(tabIndex) {
    const thumElement = tabToThum[tabIndex];
    const activeContent = document.querySelector(`.tab_content[data-content="${tabIndex}"]`);
    const activeBox = activeContent ? activeContent.querySelector('.box.active') : null;

    if (thumElement && activeBox) {
        const img = activeBox.querySelector('img');
        if (img) {
            thumElement.style.backgroundImage = `url('${img.src}')`;
            thumElement.textContent = ''; // 텍스트 지우기
        } else {
            thumElement.style.backgroundImage = 'none';
            // 기본 텍스트 설정 (선택 사항)
            if (tabIndex === '1') thumElement.textContent = '몸통';
            else if (tabIndex === '2') thumElement.textContent = '눈';
            else if (tabIndex === '3') thumElement.textContent = '입';
            else if (tabIndex === '4') thumElement.textContent = '색상';
        }
    }
}

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

        // 썸네일 업데이트 (현재 활성화된 탭에 대해서)
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            updateThum(activeTab.getAttribute('data-tab'));
        }

        // 팝업 내부 아바타 업데이트
        updateRandomLayerVisuals();
    });
});

// 팝업 열기
showLayerBtn.addEventListener('click', () => {
    randomLayer.classList.add('active');
    dimmedBackground.classList.add('active');
    updateRandomLayerVisuals(); // 팝업 열 때 내부 visual 업데이트
});

// 팝업 닫기 (딤 배경 클릭 시)
dimmedBackground.addEventListener('click', () => {
    randomLayer.classList.remove('active');
    dimmedBackground.classList.remove('active');
});

function updateRandomLayerVisuals() {
    randomVisualFace.style.backgroundImage = visualFace.style.backgroundImage;
    randomVisualEyes.style.backgroundImage = visualEyes.style.backgroundImage;
    randomVisualNoise.style.backgroundImage = visualNoise.style.backgroundImage;
    randomVisualMouth.style.backgroundImage = visualMouth.style.backgroundImage;
}

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

            // 최종 선택된 active box의 이미지로 아바타 및 썸네일 변경
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
                } else if (tabNumber === '4' && img) {
                    visualMouth.style.backgroundImage = `url('${img.src}')`;
                }
                updateThum(tabNumber); // 썸네일 업데이트
                updateRandomLayerVisuals(); // 팝업 내부 visual 업데이트
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

    // 썸네일 초기화
    randomThums.forEach(thum => {
        thum.style.backgroundImage = 'none';
        thum.textContent = thum.classList.contains('type1') ? '몸통' :
                           thum.classList.contains('type2') ? '눈' :
                           thum.classList.contains('type3') ? '입' : '색상';
    });

    // 팝업 닫기
    randomLayer.classList.remove('active');
    dimmedBackground.classList.remove('active');

    clearInterval(rotationInterval);
    clearInterval(selectionInterval);
    clearInterval(countdownInterval);
});