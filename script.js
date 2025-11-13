// Game State
let currentStep = 0;
let selectedShape = '';
let selectedIcingColor = '';
let selectedDrawingColor = '';
let selectedSprinkleType = '';
let isDrawing = false;
let drawingCanvas, drawingCtx;
let sprinklesCanvas, sprinklesCtx;

// Audio Elements
const chimeSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFgH1/goWIi46RlJeam52gnqSnnKCjoaWop6qsrq+wsLCwr6+urq6urq6tr62trq+wsbKztLW2t7i5ubm4uLi3t7e2tbW0s7KxsK+uraysq6qpqKalpaSkpKSkpKWlpqanqKmqq6ytrq+wsbGysrKysrGxsK+ura2srKuqqainp6aloqGhoJ+enZyamZiXlpWUk5KRkI+OjY2MjIyMi4uLi4uLjI2NjY6Pj4+Pk5OUlZaXmJmam5ydnZ6fn6Gio6SlpqeoqKmpqqqqqqmpqainpqWko6Khn5+dnJqZl5aUk5KRkI+OjY2Mioqbhod=');

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    createSnowfall();
    setupWelcomeScreen();
    setupNavigation();
    setupStepIndicators();

    drawingCanvas = document.getElementById('drawing-canvas');
    drawingCtx = drawingCanvas.getContext('2d');
    sprinklesCanvas = document.getElementById('sprinkles-canvas');
    sprinklesCtx = sprinklesCanvas.getContext('2d');
}

// Snowfall Effect
function createSnowfall() {
    const snowfall = document.getElementById('snowfall');
    const snowflakeCount = 50;

    for (let i = 0; i < snowflakeCount; i++) {
        createSnowflake(snowfall);
    }
}

function createSnowflake(container) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    snowflake.style.fontSize = (Math.random() * 0.5 + 0.5) + 'em';
    container.appendChild(snowflake);

    // Recreate snowflake after it falls
    snowflake.addEventListener('animationiteration', () => {
        snowflake.style.left = Math.random() * 100 + '%';
    });
}

// Welcome Screen
function setupWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.addEventListener('click', () => {
        welcomeScreen.classList.remove('active');
        document.getElementById('baking-area').classList.add('active');
        playChime();
        showStepContent(1);
    });
}

// Navigation
function setupNavigation() {
    const prevBtn = document.getElementById('prev-arrow');
    const nextBtn = document.getElementById('next-arrow');

    prevBtn.addEventListener('click', () => navigateStep(-1));
    nextBtn.addEventListener('click', () => navigateStep(1));

    updateNavigationButtons();
}

function navigateStep(direction) {
    const newStep = currentStep + direction;

    if (newStep >= 1 && newStep <= 5) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active-step');

        currentStep = newStep;

        // Show new step
        document.getElementById(`step-${currentStep}`).classList.add('active-step');

        showStepContent(currentStep);
        updateNavigationButtons();
        updateStepIndicators();
        playChime();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-arrow');
    const nextBtn = document.getElementById('next-arrow');

    prevBtn.disabled = currentStep <= 1;
    nextBtn.style.display = currentStep >= 5 ? 'none' : 'block';
}

function setupStepIndicators() {
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index + 1 !== currentStep) {
                document.getElementById(`step-${currentStep}`).classList.remove('active-step');
                currentStep = index + 1;
                document.getElementById(`step-${currentStep}`).classList.add('active-step');
                showStepContent(currentStep);
                updateNavigationButtons();
                updateStepIndicators();
                playChime();
            }
        });
    });
}

function updateStepIndicators() {
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Step Content
function showStepContent(step) {
    const optionsBar = document.getElementById('options-bar');
    optionsBar.innerHTML = '';

    switch(step) {
        case 1:
            showShapeOptions();
            break;
        case 2:
            showIcingOptions();
            break;
        case 3:
            showDrawingOptions();
            setupDrawing();
            break;
        case 4:
            showSprinkleOptions();
            setupSprinkles();
            break;
        case 5:
            showFinale();
            break;
    }
}

// Step 1: Shape Selection
function showShapeOptions() {
    const optionsBar = document.getElementById('options-bar');
    const shapes = [
        { name: 'gingerbread', icon: '🍪', label: 'Gingerbread Man' },
        { name: 'santa', icon: '🎅', label: 'Santa Hat' },
        { name: 'snowman', icon: '⛄', label: 'Snowman' }
    ];

    shapes.forEach(shape => {
        const option = document.createElement('div');
        option.className = 'option shape-option';
        option.innerHTML = shape.icon;
        option.title = shape.label;
        option.addEventListener('click', () => selectShape(shape.name, option));
        optionsBar.appendChild(option);
    });
}

function selectShape(shapeName, optionElement) {
    selectedShape = shapeName;

    // Update selection UI
    document.querySelectorAll('.shape-option').forEach(el => el.classList.remove('selected'));
    optionElement.classList.add('selected');

    // Transform dough into shape
    const dough = document.getElementById('dough');
    dough.style.width = '300px';
    dough.style.height = '300px';
    dough.classList.add(`shape-${shapeName}`);

    // Apply shape to all cookie elements
    applyShapeToAllCookies(shapeName);

    playChime();
}

function applyShapeToAllCookies(shapeName) {
    const cookies = document.querySelectorAll('.cookie');
    cookies.forEach(cookie => {
        cookie.className = 'cookie';
        cookie.classList.add(`shape-${shapeName}`);
    });
}

// Step 2: Icing Color
function showIcingOptions() {
    const optionsBar = document.getElementById('options-bar');
    const colors = ['red', 'green', 'white'];

    colors.forEach(color => {
        const option = document.createElement('div');
        option.className = `option color-option ${color}`;
        option.title = color.charAt(0).toUpperCase() + color.slice(1) + ' Icing';
        option.addEventListener('click', () => selectIcingColor(color, option));
        optionsBar.appendChild(option);
    });
}

function selectIcingColor(color, optionElement) {
    selectedIcingColor = color;

    // Update selection UI
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    optionElement.classList.add('selected');

    // Apply icing color
    const cookie = document.getElementById('cookie-icing');
    const colorMap = {
        red: '#C41E3A',
        green: '#2D5016',
        white: '#FFFAF0'
    };

    cookie.style.background = colorMap[color];
    cookie.style.transition = 'background 0.8s ease';

    // Apply to subsequent cookies
    document.getElementById('cookie-drawing').style.background = colorMap[color];
    document.getElementById('cookie-sprinkles').style.background = colorMap[color];
    document.getElementById('cookie-final').style.background = colorMap[color];

    playChime();
}

// Step 3: Drawing with Icing Pen
function showDrawingOptions() {
    const optionsBar = document.getElementById('options-bar');
    const colors = ['black', 'white', 'red'];

    colors.forEach(color => {
        const option = document.createElement('div');
        option.className = `option color-option ${color}`;
        option.title = color.charAt(0).toUpperCase() + color.slice(1) + ' Icing Pen';
        option.addEventListener('click', () => selectDrawingColor(color, option));
        optionsBar.appendChild(option);
    });

    // Select black by default
    const firstOption = optionsBar.querySelector('.color-option');
    if (firstOption && !selectedDrawingColor) {
        selectDrawingColor('black', firstOption);
    }
}

function selectDrawingColor(color, optionElement) {
    selectedDrawingColor = color;

    // Update selection UI
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    optionElement.classList.add('selected');

    playChime();
}

function setupDrawing() {
    const canvas = drawingCanvas;
    const ctx = drawingCtx;

    canvas.style.cursor = 'crosshair';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
}

function startDrawing(e) {
    if (!selectedDrawingColor) return;
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing || !selectedDrawingColor) return;

    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colorMap = {
        black: '#2C1810',
        white: '#FFFAF0',
        red: '#C41E3A'
    };

    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.lineWidth = 6;
    drawingCtx.strokeStyle = colorMap[selectedDrawingColor];

    if (isDrawing) {
        drawingCtx.lineTo(x, y);
        drawingCtx.stroke();
        drawingCtx.beginPath();
        drawingCtx.moveTo(x, y);
    }
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        drawingCtx.beginPath();

        // Copy canvas to final cookie
        copyCanvasToNextSteps();
    }
}

function copyCanvasToNextSteps() {
    // This will be handled by copying the canvas image data in the finale
}

// Step 4: Sprinkles
function showSprinkleOptions() {
    const optionsBar = document.getElementById('options-bar');
    const sprinkleTypes = ['round', 'star', 'heart'];

    sprinkleTypes.forEach(type => {
        const option = document.createElement('div');
        option.className = 'option sprinkle-option';
        option.title = type.charAt(0).toUpperCase() + type.slice(1) + ' Sprinkles';
        option.draggable = true;

        // Create preview sprinkles
        const colors = ['#C41E3A', '#2D5016', '#FFFAF0'];
        for (let i = 0; i < 9; i++) {
            const preview = document.createElement('div');
            preview.className = `sprinkle-preview ${type}`;
            preview.style.background = colors[i % 3];
            option.appendChild(preview);
        }

        option.addEventListener('dragstart', (e) => {
            selectedSprinkleType = type;
            e.dataTransfer.effectAllowed = 'copy';
        });

        option.addEventListener('click', () => {
            selectedSprinkleType = type;
            document.querySelectorAll('.sprinkle-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
            playChime();
        });

        optionsBar.appendChild(option);
    });
}

function setupSprinkles() {
    const canvas = sprinklesCanvas;

    canvas.addEventListener('click', addSprinkle);
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        addSprinkle(e);
    });
}

function addSprinkle(e) {
    if (!selectedSprinkleType) return;

    const rect = sprinklesCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#C41E3A', '#2D5016', '#FFFAF0'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    sprinklesCtx.fillStyle = color;

    switch(selectedSprinkleType) {
        case 'round':
            sprinklesCtx.beginPath();
            sprinklesCtx.arc(x, y, 4, 0, Math.PI * 2);
            sprinklesCtx.fill();
            break;
        case 'star':
            drawStar(sprinklesCtx, x, y, 5, 6, 3);
            break;
        case 'heart':
            drawHeart(sprinklesCtx, x, y, 6);
            break;
    }

    playChime();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Top left curve
    ctx.bezierCurveTo(
        x, y,
        x - size / 2, y,
        x - size / 2, y + topCurveHeight
    );
    // Bottom left curve
    ctx.bezierCurveTo(
        x - size / 2, y + (size + topCurveHeight) / 2,
        x, y + (size + topCurveHeight) / 1.2,
        x, y + size
    );
    // Bottom right curve
    ctx.bezierCurveTo(
        x, y + (size + topCurveHeight) / 1.2,
        x + size / 2, y + (size + topCurveHeight) / 2,
        x + size / 2, y + topCurveHeight
    );
    // Top right curve
    ctx.bezierCurveTo(
        x + size / 2, y,
        x, y,
        x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
}

// Step 5: Finale
function showFinale() {
    const optionsBar = document.getElementById('options-bar');
    optionsBar.style.display = 'none';

    // Copy all decorations to final cookie
    const finalCookie = document.getElementById('cookie-final');

    // Create a temporary canvas to combine everything
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw the drawing layer
    if (drawingCanvas) {
        tempCtx.drawImage(drawingCanvas, 0, 0);
    }

    // Draw the sprinkles layer
    if (sprinklesCanvas) {
        tempCtx.drawImage(sprinklesCanvas, 0, 0);
    }

    // Apply as background to final cookie (using data URL)
    const decorationImage = tempCanvas.toDataURL();
    finalCookie.style.backgroundImage = `url(${decorationImage})`;
    finalCookie.style.backgroundSize = 'contain';
    finalCookie.style.backgroundPosition = 'center';
    finalCookie.style.backgroundRepeat = 'no-repeat';

    // Play background music
    playBackgroundMusic();

    // Brighten the scene
    document.getElementById('baking-area').style.filter = 'brightness(1.1)';
}

// Audio Functions
function playChime() {
    try {
        const audio = chimeSound.cloneNode();
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playBackgroundMusic() {
    // Create a simple musical sequence using Web Audio API
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        // Simple Christmas melody notes (frequencies in Hz)
        const melody = [
            { freq: 523.25, duration: 0.3 }, // C5
            { freq: 587.33, duration: 0.3 }, // D5
            { freq: 659.25, duration: 0.3 }, // E5
            { freq: 698.46, duration: 0.3 }, // F5
            { freq: 783.99, duration: 0.6 }, // G5
        ];

        let startTime = audioCtx.currentTime;

        melody.forEach((note, index) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.frequency.value = note.freq;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + note.duration);

            startTime += note.duration;
        });
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Initialize step 1 when page loads
window.addEventListener('load', () => {
    currentStep = 1;
    updateStepIndicators();
});
