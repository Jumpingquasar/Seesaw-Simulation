# Seesaw Physics Simulation

A small interactive seesaw simulation built with plain HTML, CSS, and JavaScript.

This project visualizes basic torque and balance concepts in a simple, hands-on way. Users can place weights on a seesaw plank and immediately see how weight, distance, and torque affect the system.

No frameworks, no canvas, no external libraries — everything runs directly in the browser.

## Features

- Click anywhere on the plank to drop a weight
- Each weight contributes to total torque
- Live indicators for:
  - Left weight
  - Right weight
  - Next weight to be placed
  - Total torque
  - Tilt angle
- Objects visually hang from the plank and stay upright while the plank rotates
- Action log showing each placement
- Sound effects for placing weights and resetting
- State persistence using `localStorage`
- One-click reset

## How It Works

- Torque is calculated using:

  `torque = weight × distance from center`

- The plank rotation is derived from total torque and clamped to a realistic range.
- Objects counter-rotate so they always hang vertically, regardless of plank angle.
- All calculations are done in pixels and degrees for clarity and simplicity.

## Development Process

This project was finished in 3 days for a case study and consisted of three main phases:

1. Site design and placement
   A purely non-functional website without the seesaw. The design of the web app is determined and a project directory is created. AI helped in regards to project management, time-table and color theory.

2. Calculative and functional elements
   Weight addition and tilt angle/torque calculations are created. Core functions are implemented.

3. Debugging and creative implementations
   Final phase of the project with debugging the implemented features and adding any creative after thoughts.

## Challenges and Solutions:

1. While the initial development progressed with no problems, the addition of weights balancing with counter-rotations based on the seesaw plank tilt made things difficult. The origin point of the weights shifted everytime the tilt angle of the plank changed, meaning the connection point of the ropes looked unnatural.

This was later on fixed by introducing transform origins.

2. Near the end of development, a small bug regarding the motion of the plank was discovered. The weights are placed on the plank element by some x-offset determined by the mouse location. While this works on a perfectly horizontal plank, the situation changes when the plank rotates.

According to the geometry of the plank, while the planks turns, the x position slightly shifts towards the pivot point.

Thus, the real placement point was corrected by finding out the distance change using the tilt angle.

3. In the demo provided in the case pdf, a preview of the next weight was shown to the user. Initially I also wanted to use this approach but afterwards this was removed. The seesaw plank is already pretty cluttered and I did not want to add any more to this simplistic layout.

4. As mentioned, the placed weights add up to block each other quite much. I wanted to keep the intersecting between the weights to a minimum, so dynamically lengthened ropes attached to the weights were added. This helped with visualizing the weights on the seesaw better.

5. The project was also supposed to include a small testing JS to demonstrate the basic testing capabilities without a 3rd party testing package. Sadly last minute bugs required me to revet these changes.

## Running the Project

No build step required.

Simply open `index.html` in a modern desktop browser.

## Possible Improvements

- Drag-to-place weights
- Mobile-friendly layout
- Failure or tipping conditions
- Graph view for torque over time
- Telemetry
- (!) Persistence currently calculates wrong x-offsets. I couldn't figure out the cause in the time limit.

## License

No licenses, have fun!
