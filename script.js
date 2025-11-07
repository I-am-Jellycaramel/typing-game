const quotes = [
    '봄은 동틀 무렵. 산 능선이 점점 하얗게 변하면서 조금씩 밝아지고, 그 위로 보랏빛 구름이 가늘게 떠 있는 풍경이 멋있다.',
    '사실, 이 세상에 처음 태어날 때 나는 아무 것도 갖고 오지 않았었다. 살 만큼 살다가 이 지상의 적에서 사라져 갈 때에도 빈손으로 갈 것이다.',
    '도라고 말할 수 있는 것은 도가 아니고, 이름 붙일 수 있는 것은 이름이 아니다.',
    '공자왈, 배우고 때 맞춰 익히니 기쁘지 아니한가? 벗이 먼 곳에서 오니, 또한 즐겁지 아니한가? 남이 나를 알아주지 않아도 노여워하지 않으니, 또한 군자가 아니겠는가?',
    '공자왈, 선을 행하는 자에게는 하늘이 복으로써 갚으며, 선하지 않은 자에게는 하늘이 화로써 갚는다.',
    '1. 세계는 일어나는 모든 것이다.',
    '국경의 긴 터널을 빠져나오자, 설국이었다.'
];

let words = [];
let wordIndex = 0;
let quoteIndex = -1;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start')
const subtitle = document.getElementById('subtitle');

const resultModal = document.getElementById("result-modal");
const timeText = document.getElementById("time");
const closeModalButton = document.getElementById("close-modal");
closeModalButton.addEventListener('click', ()=>{
    resultModal.style.display = "none";
    quoteElement.style.display = "none";
    subtitle.style.display = "block";
});
const retryButton = document.getElementById("one-more")
retryButton.addEventListener('click', ()=> {
    resultModal.style.display = "none";
    startGame();
})

function startGame() {
    // 만약 게임이 진행 중이라면 시작 버튼이 눌리지 않게 하기
    if (startButton.classList.contains('disabled')) return;
    // 버튼 비활성화용 class 주입
    startButton.className = 'disabled'
    // 인풋 잠금 해제
    typedValueElement.disabled = false;
    // 입력창 플레이스홀더의 변경
    typedValueElement.placeholder = "여기에 입력해주세요..";

    quoteIndex = Math.floor(Math.random() * quotes.length); // 무작위 인덱스 생성
    const quote = quotes[quoteIndex]; 
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(function(word) {return `<span>${word} </span>`}); // span 태그로 감싼 후 배열에 저장
    quoteElement.style.display = "block";
    quoteElement.innerHTML = spanWords.join(''); // 하나의 문자열로 결합 및 설정
    quoteElement.childNodes[0].className = 'highlight'; // 첫 단어 강조
    timeText.innerText = ''; // 메시지 요소 초기화

    subtitle.style.display = "none";

    typedValueElement.value = ''; // 입력 필드 초기화
    typedValueElement.focus(); // 포커스 설정 

    startTime = new Date().getTime(); // 타이핑 시작 시간 기록
}

startButton.addEventListener('click', startGame);

typedValueElement.addEventListener('input', ()=> {

    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    // 마지막 단어까지 정확히 입력했는지 체크
    if (typedValue === currentWord && wordIndex === words.length - 1) { 
        const elapsedTime = (new Date().getTime() - startTime)/1000;
        // 점수 기록
        const previousScore = Number(localStorage.getItem(`sentence${quoteIndex}`));
        let mainMessage = `축하합니다! ${elapsedTime}초만에 끝났습니다.`
        if (!previousScore) {
            mainMessage = `축하합니다! <span style="color:red;"><strong>${elapsedTime}초</strong></span>만에 끝났습니다. <br><span style='color:red;'><strong>이번 문장의 첫 기록을 남겼습니다! 축하드립니다!!</strong></span> 🥳`
        } else if (elapsedTime < previousScore) {
            const diff = Number((previousScore - elapsedTime).toFixed(3));
            mainMessage = `축하합니다! <span style="color:red;"><strong>${elapsedTime}초</strong></span>만에 끝났습니다.  <br><span style="color:red;"><strong>이번 문장의 신기록입니다! 축하드립니다!!</strong></span> 🥳 <br>이전 기록: <strong>${previousScore}초 (-${diff}s)</strong>`
        }
        localStorage.setItem(`sentence${quoteIndex}`, elapsedTime);
        // 버튼 활성화용 disabled 클래스 제거 
        startButton.className = '';
        // 인풋 잠금
        typedValueElement.disabled = true;
        // 플레이스 홀더 변경
        typedValueElement.placeholder = "시작 후 입력할 수 있어요.";
        typedValueElement.value = "";

        quoteIndex = -1;

        // 모달 보여주기
        timeText.innerHTML = mainMessage;
        resultModal.style.display = "flex";
    }
    // 입력된 값이 공백으로 끝났는지 + 공백을 제거한 값이 현재 단어와 일치하는지 확인
    else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {  
        typedValueElement.value = ''; // 입력 필드 초기화해서 다음 단어 준비
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) { // 모든 강조 표시 제거
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight'; // 다음으로 타이핑할 단어에 하이라이트 클래스 추가
    } else if (currentWord.startsWith(typedValue)) { // 현재 단어의 일부를 맞게 입력하고 있는지 확인
        typedValueElement.classList.remove('error'); // 올바르면 입력칸 엘리먼트의 클래스 제거
    } else {
        // 한글인 경우 글자가 조합되고 있는 시점에서는 에러 판정을 안 주도록 보정
        const lastChar = typedValue.charAt(typedValue.length-1);
        const thenPrevious = typedValue.charAt(typedValue.length-2);
        console.log(`c1: ${!/[a-zA-Z]/.test(lastChar) }`);
        console.log(`c2: ${!thenPrevious}, ${thenPrevious}`);
        console.log(`c3: ${currentWord.startsWith(typedValue.slice(0, -1))}, ${typedValue.slice(0, -1)}`);
        if (!/[a-zA-Z]/.test(lastChar) && (!thenPrevious || currentWord.startsWith(typedValue.slice(0, -1)))) {
            console.log(".");
            return;
        }
        typedValueElement.classList.add('error'); // 틀리면 error 클래스 추가
    }
});