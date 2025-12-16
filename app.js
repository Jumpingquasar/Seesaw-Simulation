'use strict';

const seesawPlankElement = document.querySelector('#seesaw-plank');
const resetButton = document.getElementById('reset-button');
const plankCenterX = seesawPlankElement.offsetWidth / 2;
const objects = [];

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
  currentWeight: 1,
  totalTorque: 0,
  tiltAngle: 0
};

// Sets the angle of the seesaw plank
function setSeesawAngle() {
    const angle = Math.max(
        -30,
        Math.min(30, physicsState.totalTorque / 100)
    );
    seesawPlankElement.style.transform = `rotate(${angle}deg)`;
    physicsState.tiltAngle = angle;
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

    // Generate a new object and position it
    const obj = document.createElement('div');
    obj.className = 'object';
    obj.style.left = `${clickX}px`;  
    seesawPlankElement.appendChild(obj);

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

function updateUI() {
    ui.leftWeight.textContent = `${physicsState.leftWeight} kg`;
    ui.rightWeight.textContent = `${physicsState.rightWeight} kg`;
    ui.currentWeight.textContent = `${physicsState.currentWeight} kg`;
    ui.tiltAngle.textContent = `${physicsState.tiltAngle.toFixed(2)} deg`;
    ui.totalTorque.textContent = `${physicsState.totalTorque.toFixed(1)} kg·pixel`;
}

// Resets the entire app state
function resetApp() {
    physicsState.leftWeight = 0;
    physicsState.rightWeight = 0;
    physicsState.currentWeight = 1;
    physicsState.totalTorque = 0;
    physicsState.tiltAngle = 0;
    objects.length = 0;
    seesawPlankElement.style.transform = 'rotate(0deg)';
    seesawPlankElement.innerHTML = '';
    logContainer.innerHTML = '';
    updateUI();
}

// Listens for clicks on the seesaw plank
seesawPlankElement.addEventListener('click', (event) => {
    const rect = seesawPlankElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    addWeightToSeesaw(x - plankCenterX);
});

// Listens for clicks on the reset button
resetButton.addEventListener('click', resetApp);

// Called once at startup to initialize the UI
updateUI()