'use strict';

const seesawPlankElement = document.querySelector('#seesaw-plank');
const resetButton = document.getElementById('reset-button');
const logContainer = document.getElementById('log-container');
const objects = [];
let audioUnlocked = false;

// Initialize drop sound effect
const dropSound = new Audio('sound/pop.wav');
const newPageSound = new Audio('sound/new-page.wav');

// UI Elements for the information box
const ui = {
    leftWeight: document.getElementById('left-weight-value'),
    rightWeight: document.getElementById('right-weight-value'),
    currentWeight: document.getElementById('next-weight-value'),
    totalTorque: document.getElementById('torque-value'),
    tiltAngle: document.getElementById('tilt-value')
}

// Physics state of the seesaw system
const physicsState = {
  leftWeight: 0,
  rightWeight: 0,
  currentWeight: 5,
  totalTorque: 0,
  tiltAngle: 0
};


// State to be persisted across sessions
const persistedState = {
    objects,
    physicsState
};

// Sets the angle of the seesaw plank
function setSeesawAngle() {
    const angle = Math.max(
        -30,
        Math.min(30, physicsState.totalTorque / 10)
    );
    seesawPlankElement.style.transform = `rotate(${angle}deg)`;
    physicsState.tiltAngle = angle;

    // Update CSS variables for the seesaw plank rotation correction
    seesawPlankElement.style.setProperty('--plank-angle', `${angle}deg`);
}

function addLogMessage (clickX, weight){
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const side = clickX < 0 ? 'left' : 'right';
    const absDistance = Math.abs(clickX).toFixed(2);

    entry.textContent = `Added ${weight || physicsState.currentWeight} kg on the ${side} side, ${absDistance}px from the center.`;

    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Appends new weight to the seesaw plank
function addWeightToSeesaw(clickX) {

    // Update left/right physics state
    if (clickX < 0) {
        physicsState.leftWeight += physicsState.currentWeight;
    } else {
        physicsState.rightWeight += physicsState.currentWeight;
    }

    // Calculate the total torque of the system
    physicsState.totalTorque += physicsState.currentWeight * (clickX);
    addLogMessage(clickX);

    // Set the new angle of the seesaw
    setSeesawAngle();

    // Randomize the next weight
    physicsState.currentWeight = Math.floor(Math.random() * 10) + 1;
    updateUI();
}

// Updates the information box UI
function updateUI() {
    
    ui.leftWeight.textContent = `${physicsState.leftWeight} kg`;
    ui.rightWeight.textContent = `${physicsState.rightWeight} kg`;
    ui.currentWeight.textContent = `${physicsState.currentWeight} kg`;
    ui.tiltAngle.textContent = `${physicsState.tiltAngle.toFixed(2)}°`;
    ui.totalTorque.textContent = `${physicsState.totalTorque.toFixed(1)} kg·pixel`;
}

// Renders an object on the seesaw plank
function renderObject(weight, positionX) {
    const rect = seesawPlankElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const distanceFromCenter = positionX - centerX;
    const rotationCorrection = distanceFromCenter * 42/200 * Math.abs(physicsState.tiltAngle) * (Math.PI / 180);
    const obj = document.createElement('div');
    const objString = document.createElement('div');
    const objBall = document.createElement('div');
    const objWeightText = document.createElement('div');

    obj.className = 'object';
    objString.className = 'object-string';
    objBall.className = 'object-ball';
    objWeightText.className = 'object-weight-text';

    objWeightText.textContent = `${weight} kg`;
    obj.style.setProperty('--offset-x', `${distanceFromCenter - 30 + rotationCorrection}px`);

    objBall.style.width = `${weight * 3 + 50}px`;
    objBall.style.height = `${weight * 3 + 50}px`;
    objBall.style.backgroundColor = `rgb(${255 / weight * 2.5}, 70, 50)`;
    objString.style.height = `${weight * 4 + 10}px`;
    

    obj.appendChild(objString);
    obj.appendChild(objBall);
    objBall.appendChild(objWeightText);
    seesawPlankElement.appendChild(obj);
}

//  Adds an object to the seesaw and updates state
function addObject(weight, positionX) {
    objects.push({ weight, positionX });
    renderObject(weight, positionX);
}

// Resets the entire app state
function resetApp() {    
    if (audioUnlocked) newPageSound.play();
    physicsState.leftWeight = 0;
    physicsState.rightWeight = 0;
    physicsState.currentWeight = 5;
    physicsState.totalTorque = 0;
    physicsState.tiltAngle = 0;
    objects.length = 0;
    seesawPlankElement.style.transform = 'rotate(0deg)';
    seesawPlankElement.innerHTML = '';
    logContainer.innerHTML = '';
    localStorage.removeItem('seesaw-state');
    updateUI();
}

// Listens for clicks on the seesaw plank
seesawPlankElement.addEventListener('click', (event) => {
    const rect = seesawPlankElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const centerX = rect.width / 2;
    playDropSound();
    addObject(physicsState.currentWeight, clickX);
    addWeightToSeesaw(clickX - centerX);
    saveState();
});

function unlockAudio() {
    audioUnlocked = true;
    document.removeEventListener('pointerdown', unlockAudio);
}   

document.addEventListener('pointerdown', unlockAudio, { once: true });

// Listens for clicks on the reset button
resetButton.addEventListener('click', resetApp);

// Plays the drop sound effect
function playDropSound() {
    if (!audioUnlocked) return;
    const sound = dropSound.cloneNode();
    sound.volume = Math.max(0.2, physicsState.currentWeight / 15);
    sound.play();
}

// Saves the current state to localStorage for persistence
function saveState() {
  const data = {
    objects,
    physicsState
  };

  console.log('Saving state...', data);
  localStorage.setItem('seesaw-state', JSON.stringify(data));
}

function rebuildFromState() {
    seesawPlankElement.innerHTML = '';
    logContainer.innerHTML = '';
    const plankRect = seesawPlankElement.getBoundingClientRect();
    const centerX = plankRect.width / 2;

    for (const obj of objects) {
        renderObject(obj.weight, obj.positionX);
        addLogMessage(obj.positionX - centerX, obj.weight);
    }

    setSeesawAngle();
    updateUI();
}


// Load the cached state from localStorage
function loadState() {
    console.log('Loading state...');
    const data = localStorage.getItem('seesaw-state');
    if (!data) {
        console.log('No saved state found.')
        return
    };

    const parsed = JSON.parse(data);
    console.log('Loaded state:', parsed);

    // Restore state
    objects.length = 0;
    objects.push(...parsed.objects);
    Object.assign(physicsState, parsed.physicsState);

    rebuildFromState() 
}

function init() {
    loadState()
}


init();

// Expose hooks for browser-based tests
if (typeof window !== 'undefined') {
    window.AppTest = {
        physicsState,
        addWeightToSeesaw,
        setSeesawAngle,
        updateUI,
        resetApp
    };
}