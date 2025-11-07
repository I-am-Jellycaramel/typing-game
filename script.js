const quotes = [
     'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.'
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start')

const resultModal = document.getElementById("result-modal");
const timeText = document.getElementById("time");
const closeModalButton = document.getElementById("close-modal");
closeModalButton.addEventListener('click', ()=>{
    resultModal.style.display = "none";
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

    const quoteIndex = Math.floor(Math.random() * quotes.length); // 무작위 인덱스 생성
    const quote = quotes[quoteIndex]; 
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(function(word) {return `<span>${word} </span>`}); // span 태그로 감싼 후 배열에 저장
    quoteElement.innerHTML = spanWords.join(''); // 하나의 문자열로 결합 및 설정
    quoteElement.childNodes[0].className = 'highlight'; // 첫 단어 강조
    timeText.innerText = ''; // 메시지 요소 초기화

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
        const elapsedTime = new Date().getTime() - startTime;
        const message = `축하합니다! ${elapsedTime/1000}초만에 끝났습니다.`
        // 버튼 활성화용 disabled 클래스 제거 
        startButton.className = '';
        // 인풋 잠금
        typedValueElement.disabled = true;
        // 플레이스 홀더 변경
        typedValueElement.placeholder = "시작 후 입력할 수 있어요.";
        typedValueElement.value = "";

        // 모달 보여주기
        timeText.innerText = message;
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
        typedValueElement.className = ''; // 올바르면 입력칸 엘리먼트의 클래스 제거
    } else {
        typedValueElement.className = 'error'; // 틀리면 error 클래스 추가
    }
});