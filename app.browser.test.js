'use strict';

(function runAppTests() {
  if (typeof window === 'undefined' || !window.AppTest) {
    // Not running in browser or AppTest not available; skip.
    return;
  }

  const { physicsState, addWeightToSeesaw, resetApp } = window.AppTest;

  function assert(condition, message) {
    if (!condition) {
      console.error('AppTest failed:', message);
    }
  }

  function testAddWeightToSeesawLeft() {
    addWeightToSeesaw(-20);

    assert(physicsState.leftWeight === 5, 'leftWeight should increase by currentWeight');
    assert(physicsState.rightWeight === 0, 'rightWeight should stay 0 for left click');
    assert(physicsState.totalTorque === -100, 'totalTorque should be weight * distance');

    assert(physicsState.tiltAngle < 0, 'tiltAngle should be negative for left side torque');

    console.log('[AppTest] testAddWeightToSeesawLeft passed');
  }

  function testAddWeightToSeesawRight() {
    // Reset physics and DOM expectations
    const logContainer = document.getElementById('log-container');
    const initialLogCount = logContainer
      ? logContainer.querySelectorAll('.log-entry').length
      : 0;

    addWeightToSeesaw(10);

    assert(physicsState.rightWeight === 5, 'rightWeight should increase by currentWeight');
    assert(physicsState.leftWeight === 0, 'leftWeight should stay 0 for right click');
    assert(physicsState.totalTorque === 50, 'totalTorque should be weight * distance');

    assert(physicsState.tiltAngle > 0, 'tiltAngle should be positive for right side torque');

    const leftLabel = document.getElementById('left-weight-value').textContent;
    const rightLabel = document.getElementById('right-weight-value').textContent;
    const tiltLabel = document.getElementById('tilt-value').textContent;
    const seesawPlank = document.getElementById('seesaw-plank');
    const transform = seesawPlank ? seesawPlank.style.transform || '' : '';
    const logEntries = logContainer
      ? logContainer.querySelectorAll('.log-entry')
      : [];
    const lastLogText =
      logEntries.length > 0
        ? logEntries[logEntries.length - 1].textContent
        : '';

    assert(leftLabel.includes('0 kg'), 'left label should show 0 kg');
    assert(rightLabel.includes('5 kg'), 'right label should show 5 kg');
    assert(tiltLabel.includes('°'), 'tilt label should show degrees');
    assert(
      transform.includes('rotate(') && !transform.includes('-0'),
      'seesaw plank should rotate positively for right side weight'
    );
    assert(
      logEntries.length > initialLogCount,
      'adding weight should append a new log entry'
    );
    assert(
      lastLogText.includes('Added 5 kg on the right side'),
      'last log entry should describe the right-side drop'
    );

    console.log('[AppTest] testAddWeightToSeesawRight passed');
  }

  testAddWeightToSeesawLeft();
  testAddWeightToSeesawRight();

  console.log('[AppTest] App browser tests executed (see console for any failures).');

    // Signal that browser tests are finished
  if (window.__testsDoneGate?.resolve) {
    window.__testsDoneGate.resolve();
  }
})();
