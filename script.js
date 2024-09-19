const levels = {
    1: ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Ñ'],  // Nivel 1: Línea base
    2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],  // Nivel 2: Fila superior
    3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],  // Nivel 3: Fila inferior
    4: ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Ñ', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
    // Puedes agregar más niveles aquí, por ejemplo, nivel 3, nivel 4, etc.
};

let currentLevel = 1; // Nivel actual
let letterQueue = [];
let currentLetter = '';

// Función para cargar las letras del nivel actual y desordenarlas
function loadLevel(level) {
    letterQueue = [];
    for (let i = 0; i < 4; i++) {
        letterQueue = letterQueue.concat(levels[level]);
    }
    letterQueue = shuffle(letterQueue);
    showNextLetter();
}

// Función para mostrar la siguiente letra en la cola
function showNextLetter() {
    if (letterQueue.length === 0) {
        document.getElementById('feedback').textContent = '¡Nivel Completado!';
        playSuccessSound(); // Reproduce el sonido de éxito
        speakLetter('Nivel finalizado. Preparándose para el siguiente nivel.');
        
        setTimeout(() => {
            currentLevel++;
            if (currentLevel > Object.keys(levels).length) {
                currentLevel = 1; // Reiniciar al nivel 1 si no hay más niveles
            }
            document.getElementById('level').textContent = 'Nivel ' + currentLevel;
            loadLevel(currentLevel); // Cargar las letras del nuevo nivel
        }, 3000); // Espera 3 segundos antes de cambiar al siguiente nivel
        return;
    }
    currentLetter = letterQueue.shift(); // Toma la primera letra
    document.getElementById('letter').textContent = currentLetter;
    speakLetter(currentLetter);
}

// Función para desordenar el array de letras
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para pronunciar la letra usando la API del navegador
function speakLetter(letter) {
    let pronunciation;

    // Mapear caracteres especiales a sus pronunciaciones
    switch (letter) {
        case ',':
            pronunciation = 'coma';
            break;
        case '.':
            pronunciation = 'punto';
            break;
        default:
            pronunciation = letter;
            break;
    }

    const msg = new SpeechSynthesisUtterance(pronunciation);
    msg.lang = 'es-ES'; // Configura el idioma en español
    window.speechSynthesis.speak(msg);
}

// Función para reproducir el sonido de error
function playErrorSound() {
    const errorSound = new Audio('https://www.soundjay.com/buttons/sounds/beep-03.mp3');
    errorSound.play();
}

// Función para reproducir el sonido de éxito
function playSuccessSound() {
    const successSound = new Audio('https://www.soundjay.com/buttons/sounds/button-46.mp3');
    successSound.play();
}

// Función para cambiar de nivel
function changeLevel() {
    currentLevel++;
    if (currentLevel > Object.keys(levels).length) {
        currentLevel = 1; // Reiniciar al nivel 1 si no hay más niveles
    }
    document.getElementById('level').textContent = 'Nivel ' + currentLevel;
    loadLevel(currentLevel); // Cargar las letras del nuevo nivel
}

// Evento para manejar el teclado
document.addEventListener('keydown', function(event) {
    const pressedKey = event.key.toUpperCase();

    // Si se presiona CTRL, repetir la lectura de la letra actual
    if (event.ctrlKey) {
        speakLetter(currentLetter);
    } 
    // Si se presiona la letra correcta
    else if (pressedKey === currentLetter) {
        document.getElementById('feedback').textContent = '¡Correcto!';
        playSuccessSound(); // Reproduce el sonido de éxito
        showNextLetter(); // Muestra una nueva letra
    } 
    // Si la letra es incorrecta
    else {
        document.getElementById('feedback').textContent = '¡Intenta de nuevo!';
        playErrorSound(); // Reproduce un sonido de error
    }
});

// Inicia el juego con el nivel 1
loadLevel(currentLevel);



// Accesibilidad: Aumentar el tamaño del texto
document.getElementById('increaseTextSize').addEventListener('click', function() {
    const letterElement = document.getElementById('letter');
    let currentSize = parseFloat(window.getComputedStyle(letterElement, null).getPropertyValue('font-size'));
    letterElement.style.fontSize = (currentSize + 5) + 'px';
});

// Cambiar contraste (fondo claro/oscuro)
document.getElementById('toggleContrast').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Inicializar el programa mostrando una letra
randomLetter();

// Iniciar el juego al cargar
startGame();


