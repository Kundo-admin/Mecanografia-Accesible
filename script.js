const levels = [
    "FJDKSLANGH", // Nivel 1
    "RUEIWOPQTY", // Nivel 2
    "VNCMXZB"     // Nivel 3
];

const words = [
    "hola", "mundo", "escribir", "teclado", "practicar", "juego"
];

let currentLevel = 0;
let currentLetter = '';
let intervalID;
let letterCount = 0;
let requiredPresses = 3; // Número de presiones requeridas por letra
let letterPressCount = {}; // Contador de presiones de letras
let errorTimeout;
let currentWord = '';
let wordIndex = 0;
let startTime;
let endTime;
let gameActive = true;

const letterElement = document.getElementById('letter');
const feedbackElement = document.getElementById('feedback');
const levelNumberElement = document.getElementById('levelNumber');
const progressNumberElement = document.getElementById('progressNumber');
const gameElement = document.getElementById('game');
const levelSelectElement = document.getElementById('levelSelect');
const levelListElement = document.getElementById('levelList');
const levelSelectButton = document.getElementById('levelSelectButton');
const freeModeButton = document.getElementById('freeModeButton');
const backToGameButton = document.getElementById('backToGameButton');
const freeModeElement = document.getElementById('freeMode');
const wordElement = document.getElementById('word');
const wordInput = document.getElementById('wordInput');
const feedbackFreeModeElement = document.getElementById('feedbackFreeMode');
const evaluationElement = document.getElementById('evaluation');
const evaluationResultElement = document.getElementById('evaluationResult');
const backToGameFromFreeModeButton = document.getElementById('backToGameFromFreeModeButton');
const backToGameFromEvaluationButton = document.getElementById('backToGameFromEvaluationButton');

// Función para iniciar el juego
function startGame() {
    gameActive = true;
    updateLevel();
    initializeLetterPressCount();
    nextLetter();
}

// Función para inicializar el contador de presiones de letras
function initializeLetterPressCount() {
    letterPressCount = {};
    const levelLetters = levels[currentLevel];
    levelLetters.split('').forEach(letter => {
        letterPressCount[letter] = 0;
    });
}

// Función para cambiar de letra
function nextLetter() {
    if (!gameActive) return;

    const levelLetters = levels[currentLevel];
    const randomIndex = Math.floor(Math.random() * levelLetters.length);
    currentLetter = levelLetters[randomIndex];
    letterElement.textContent = currentLetter;
    speakLetter(currentLetter);

    clearInterval(intervalID);
    intervalID = setInterval(() => speakLetter(currentLetter), 3000);
}

// Función para pronunciar la letra
function speakLetter(letter) {
    const msg = new SpeechSynthesisUtterance(letter);
    msg.lang = 'es-ES';
    window.speechSynthesis.speak(msg);
}

// Función para manejar el progreso del jugador
function handleKeyPress(event) {
    if (!gameActive) return;

    const pressedKey = event.key.toUpperCase();
    if (pressedKey === currentLetter) {
        letterPressCount[currentLetter] = (letterPressCount[currentLetter] || 0) + 1;
        letterCount++;
        progressNumberElement.textContent = `${letterCount}/10`;
        if (letterPressCount[currentLetter] >= requiredPresses) {
            if (letterCount >= 10) {
                letterCount = 0;
                progressNumberElement.textContent = `${letterCount}/10`;
                levelUp();
            } else {
                nextLetter();
            }
        } else {
            nextLetter();
        }
        clearTimeout(errorTimeout);
        feedbackElement.textContent = ''; // Limpiar mensaje de error
    } else {
        feedbackElement.textContent = '¡Error!';
        playErrorSound();
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => feedbackElement.textContent = '', 2000); // Limpiar error después de 2 segundos
    }
}

// Función para reproducir un sonido de error
function playErrorSound() {
    const errorSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
    errorSound.play().catch(err => console.error('Error al reproducir sonido: ', err));
}

// Función para actualizar el nivel
function updateLevel() {
    levelNumberElement.textContent = currentLevel + 1;
}

// Función para avanzar de nivel
function levelUp() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        initializeLetterPressCount();
        updateLevel();
        nextLetter();
    } else {
        endGame();
    }
}

// Función para terminar el juego
function endGame() {
    gameActive = false;
    clearInterval(intervalID);
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000;
    evaluationResultElement.textContent = `Tiempo total: ${elapsedTime} segundos. ¡Has completado todos los niveles!`;
    evaluationElement.classList.remove('hidden');
    gameElement.classList.add('hidden');
}

// Función para mostrar la selección de niveles
function showLevelSelect() {
    levelListElement.innerHTML = '';
    levels.forEach((level, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nivel ${index + 1}: ${level}`;
        listItem.addEventListener('click', () => {
            currentLevel = index;
            initializeLetterPressCount();
            updateLevel();
            nextLetter();
            levelSelectElement.classList.add('hidden');
            gameElement.classList.remove('hidden');
        });
        levelListElement.appendChild(listItem);
    });
    gameElement.classList.add('hidden');
    levelSelectElement.classList.remove('hidden');
}

// Función para mostrar el modo libre
function showFreeMode() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordElement.textContent = currentWord;
    freeModeElement.classList.remove('hidden');
    gameElement.classList.add('hidden');
    startTime = new Date().getTime(); // Tiempo de inicio
}

// Función para manejar la entrada en el modo libre
function handleWordInput() {
    if (wordInput.value === currentWord) {
        wordInput.value = '';
        wordElement.textContent = '';
        feedbackFreeModeElement.textContent = '¡Bien hecho!';
        setTimeout(showFreeMode, 1000); // Mostrar otra palabra después de 1 segundo
    } else {
        feedbackFreeModeElement.textContent = '¡Error!';
    }
}

// Función para mostrar la evaluación final
function showEvaluation() {
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000;
    evaluationResultElement.textContent = `Tiempo total: ${elapsedTime} segundos. ¡Has completado todos los niveles!`;
    evaluationElement.classList.remove('hidden');
    gameElement.classList.add('hidden');
}

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
levelSelectButton.addEventListener('click', showLevelSelect);
freeModeButton.addEventListener('click', showFreeMode);
backToGameButton.addEventListener('click', function() {
    levelSelectElement.classList.add('hidden');
    gameElement.classList.remove('hidden');
});
backToGameFromFreeModeButton.addEventListener('click', function() {
    freeModeElement.classList.add('hidden');
    gameElement.classList.remove('hidden');
});
backToGameFromEvaluationButton.addEventListener('click', function() {
    evaluationElement.classList.add('hidden');
    gameElement.classList.remove('hidden');
});
wordInput.addEventListener('input', handleWordInput);

// Iniciar el juego al cargar
startGame();


