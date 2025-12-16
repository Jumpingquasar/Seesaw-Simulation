'use strict';

const seesawPlankElement = document.querySelector('#seesaw-plank');
const plankCenterX = seesawPlankElement.offsetWidth / 2;
var currentWeight = 10;
var totalTorque = 0;
var leftWeight = 0;
var rightWeight = 0;
const objects = [];

// Sets the angle of the seesaw plank
function setSeesawAngle() {
    const angle = Math.max(
        -30,
        Math.min(30, totalTorque)
    );
    seesawPlankElement.style.transform = `rotate(${angle}deg)`;
}

// Appends new weight to the seesaw plank
function addWeightToSeesaw(clickX) {

    // Generate a new object and position it
    const obj = document.createElement('div');
    obj.className = 'object';
    obj.style.left = `${clickX}px`;  
    seesawPlankElement.appendChild(obj);

    // Calculate the total torque of the system
    totalTorque += currentWeight * (clickX) / 100;

    // Set the new angle of the seesaw
    setSeesawAngle();

    // Randomize the next weight
    currentWeight = Math.floor(Math.random() * 10) + 1;
    document.querySelector('#next-weight-value').textContent = `${currentWeight} kg`;
    console.log(`Added weight: ${currentWeight} kg at position: ${clickX}px`);
    console.log(totalTorque);
}

// Listens for clicks on the seesaw plank
seesawPlankElement.addEventListener('click', (event) => {
    const rect = seesawPlankElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    addWeightToSeesaw(x - plankCenterX);
});
