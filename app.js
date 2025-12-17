'use strict';

const seesawPlankElement = document.querySelector('#seesaw-plank');
const seesawClickableArea = document.querySelector('#seesaw');
const resetButton = document.getElementById('reset-button');
const logContainer = document.getElementById('log-container');
const objects = [];
let previewObject = null;

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

function addLogMessage (clickX){
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const side = clickX < 0 ? 'left' : 'right';
    const absDistance = Math.abs(clickX).toFixed(2);

    entry.textContent = `Added ${physicsState.currentWeight} kg on the ${side} side, ${absDistance}px from the center.`;

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
    
    // Get current preview object text element
    const previewObjectText = document.getElementById('preview-object-text');
    const previewObject = document.querySelector('.object-ball.preview');

    ui.leftWeight.textContent = `${physicsState.leftWeight} kg`;
    ui.rightWeight.textContent = `${physicsState.rightWeight} kg`;
    ui.currentWeight.textContent = `${physicsState.currentWeight} kg`;
    ui.tiltAngle.textContent = `${physicsState.tiltAngle.toFixed(2)}°`;
    ui.totalTorque.textContent = `${physicsState.totalTorque.toFixed(1)} kg·pixel`;
    previewObjectText.textContent = `${physicsState.currentWeight} kg`;
    previewObject.style.width = `${physicsState.currentWeight * 3 + 50}px`;
    previewObject.style.height = `${physicsState.currentWeight * 3 + 50}px`;
    previewObject.style.backgroundColor = `rgb(${255 / physicsState.currentWeight * 2.5}, 70, 50)`;
}


// Generate a new object and position it
function createObject(weight, positionX) {
    const obj = document.createElement('div');
    const objString = document.createElement('div');
    const objBall = document.createElement('div');
    const objWeightText = document.createElement('div');
    obj.className = 'object';
    objString.className = 'object-string';
    objBall.className = 'object-ball';
    objWeightText.className = 'object-weight-text';
    objWeightText.textContent = `${weight} kg`;
    obj.style.left = `${positionX - 30}px`;
    objBall.style.width = `${weight * 3 + 50}px`;
    objBall.style.height = `${weight * 3 + 50}px`;
    objBall.style.backgroundColor = `rgb(${255 / weight * 2.5}, 70, 50)`;
    objString.style.height = `${weight * 4 + 10}px`;

    obj.appendChild(objString);
    obj.appendChild(objBall);
    objBall.appendChild(objWeightText);
    seesawPlankElement.appendChild(obj);
}

// Resets the entire app state
function resetApp() {
    physicsState.leftWeight = 0;
    physicsState.rightWeight = 0;
    physicsState.currentWeight = 5;
    physicsState.totalTorque = 0;
    physicsState.tiltAngle = 0;
    objects.length = 0;
    seesawPlankElement.style.transform = 'rotate(0deg)';
    seesawPlankElement.innerHTML = '';
    logContainer.innerHTML = '';
    updateUI();
}

// Creates the preview object that follows the mouse
function createPreviewObject() {
    const objBall = document.createElement('div');    
    const objWeightText = document.createElement('b');
    objBall.className = 'object-ball';
    objWeightText.className = 'object-weight-text';
    
    objWeightText.textContent = `${physicsState.currentWeight} kg`;
    objBall.style.width = `${physicsState.currentWeight * 3 + 50}px`;
    objBall.style.height = `${physicsState.currentWeight * 3 + 50}px`;
    objBall.style.backgroundColor = `rgb(${255 / physicsState.currentWeight * 2.5}, 70, 50)`;
    
    objBall.appendChild(objWeightText);
    objBall.id = 'preview-object-text';
    objBall.classList.add('preview');
    seesawClickableArea.appendChild(objBall);
    previewObject = objBall;
}

// Listens for clicks on the seesaw plank
seesawClickableArea.addEventListener('click', (event) => {
    const rect = seesawClickableArea.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const centerX = rect.width / 2;
    createObject(physicsState.currentWeight, clickX);
    addWeightToSeesaw(clickX - centerX);
});

// Listens for clicks on the reset button
resetButton.addEventListener('click', resetApp);

// Update preview object position on mouse move
seesawClickableArea.addEventListener('mousemove', (e) => {
    if (!previewObject) return;
    const x = e.clientX - 30;

    previewObject.style.left = `${x}px`;
});

// Show/hide preview object on mouse enter/leave
seesawClickableArea.addEventListener('mouseenter', () => {
    previewObject.style.display = 'flex';
});

// Hide preview object when mouse leaves the seesaw area
seesawClickableArea.addEventListener('mouseleave', () => {
    previewObject.style.display = 'none';
});

function init() {
    createPreviewObject();

    // Called once at startup to initialize the UI
    updateUI()
}

init();