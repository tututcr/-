let quizData = [];
let questions = [];
let currentQuiz = 0;
let score = 0;
let timer;
let timeLeft = 300; // 倒计时，从300秒开始
let isPaused = false; // 游戏是否暂停

// DOM元素
const quiz = document.getElementById('quiz');
const answerButtons = document.querySelectorAll('.answer-btn');
const questionEl = document.getElementById('question');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const scoreContainer = document.getElementById('score-container');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart');
const birdImageContainer = document.getElementById('bird-image-container');
const birdImage = document.getElementById('bird-image');
const nextButtonContainer = document.getElementById('next-button-container');
const nextQuestionBtn = document.getElementById('next-question');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const endBtn = document.getElementById('end-btn');

// 加载鸟类游戏文本文件
fetch('鸟类游戏.txt')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        generateQuizQuestions(quizData);
        shuffleArray(questions);
        hideAllButtons(); // 隐藏除开始按钮以外的按钮
    })
    .catch(error => console.error('加载题库时出错:', error));

// 生成问答题目
function generateQuizQuestions(birds) {
    birds.forEach(bird => {
        bird.facts.forEach(fact => {
            const correctAnswer = fact; // 特征作为正确答案
            // 生成三个错误选项（随机选择其他鸟类的特征）
            const wrongFacts = birds
                .filter(b => b.name !== bird.name)
                .flatMap(b => b.facts)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            const options = [correctAnswer, ...wrongFacts];
            shuffleArray(options);
            questions.push({
                question: `${bird.name}的特征是什么？`,
                options: options,
                correct: correctAnswer,
                image: bird.image
            });
        });
    });
}

// 打乱数组顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 加载当前题目
function loadQuiz() {
    if (currentQuiz >= questions.length || timeLeft <= 0) {
        endQuiz();
        return;
    }
    const currentData = questions[currentQuiz];
    questionEl.innerText = currentData.question;
    answerButtons.forEach((button, index) => {
        button.innerText = currentData.options[index];
        button.style.backgroundColor = '#3498db';
        button.disabled = false;
    });
    // 隐藏鸟类图片和“下一题”按钮
    birdImageContainer.classList.add('hide');
    birdImage.src = ''; // 清空图片
    nextButtonContainer.classList.add('hide');
}

// 处理答案选择
answerButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isPaused) return; // 如果游戏被暂停，不允许答题
        const selected = button.innerText;
        const currentData = questions[currentQuiz];
        if (selected === currentData.correct) {
            score += 5; // 每道题5分
            button.style.backgroundColor = '#2ecc71'; // 绿色表示正确
        } else {
            button.style.backgroundColor = '#e74c3c'; // 红色表示错误
            // 显示正确答案
            answerButtons.forEach(btn => {
                if (btn.innerText === currentData.correct) {
                    btn.style.backgroundColor = '#2ecc71';
                }
            });
        }
        // 更新分数显示
        scoreEl.innerText = `${score}`;
        // 禁用所有按钮
        answerButtons.forEach(btn => btn.disabled = true);
        // 显示对应的鸟类图片
        birdImage.src = currentData.image;
        birdImageContainer.classList.remove('hide');
        // 显示“下一题”按钮
        nextButtonContainer.classList.remove('hide');
    });
});

// 下一题按钮事件
nextQuestionBtn.addEventListener('click', () => {
    currentQuiz++;
    loadQuiz();
});

// 计时器
function startTimer() {
    timer = setInterval(() => {
        if (isPaused) return; // 如果游戏暂停，计时器停止
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function updateTimer() {
    timerEl.innerText = `${timeLeft}s`;
}

// 显示最终分数并更新排行榜
function endQuiz() {
    clearInterval(timer);
    questionEl.innerText = "游戏结束！";
    birdImageContainer.classList.add('hide');
    nextButtonContainer.classList.add('hide');
    document.querySelector('ul').classList.add('hide');
    scoreContainer.classList.remove('hide');
    finalScoreEl.innerText = score;
}

// 重新开始游戏
restartBtn.addEventListener('click', () => {
    currentQuiz = 0;
    score = 0;
    timeLeft = 300; // 重置倒计时时间
    scoreEl.innerText = `${score}`;
    timerEl.innerText = `${timeLeft}s`;
    scoreContainer.classList.add('hide');
    document.querySelector('ul').classList.remove('hide');
    shuffleArray(questions);
    loadQuiz();
    startTimer();
});

// 启动游戏
startBtn.addEventListener('click', () => {
    startBtn.classList.add('hide'); // 隐藏开始按钮
    quiz.classList.remove('hide'); // 显示游戏内容
    loadQuiz(); // 开始加载题目
    startTimer(); // 启动计时器
    showAllButtons(); // 显示其他控制按钮
});

// 暂停游戏
pauseBtn.addEventListener('click', () => {
    isPaused = true;
    pauseBtn.classList.add('hide');
    startBtn.classList.remove('hide'); // 在暂停时重新显示开始按钮
});

// 结束游戏
endBtn.addEventListener('click', () => {
    endQuiz();
    hideAllButtons(); // 隐藏所有按钮
    startBtn.classList.remove('hide'); // 重新显示开始按钮
});

// 隐藏所有控制按钮
function hideAllButtons() {
    pauseBtn.classList.add('hide');
    endBtn.classList.add('hide');
    nextButtonContainer.classList.add('hide');
}

// 显示所有控制按钮
function showAllButtons() {
    pauseBtn.classList.remove('hide');
    endBtn.classList.remove('hide');
    nextButtonContainer.classList.remove('hide');
}

// 初始化分数和计时器显示
scoreEl.innerText = `${score}`;
timerEl.innerText = `${timeLeft}s`;
