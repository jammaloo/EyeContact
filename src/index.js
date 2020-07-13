import Matter from 'matter-js'
import Eye1 from './eye100-1.png';
import Eye2 from './eye100-2.png';
import Eye3 from './eye100-3.png';
import Eye4 from './eye100-4.png';
import Eye5 from './eye100-5.png';
import Eye6 from './eye100-6.png';

var eyes = [Eye1, Eye2, Eye3, Eye4, Eye5, Eye6]

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World;

// create engine
var engine = Engine.create(),
  world = engine.world;

// create renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 1000,
    height: 800,
    background: '#90b4ea',
    showAngleIndicator: false,
    wireframes: false
  }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

function newtonsCradle(xx, yy, number, size, length) {
  var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

  var scale = size / 50;

  var eyeOffset = Math.floor(Math.random() * eyes.length)

  for (var i = 0; i < number; i++) {
    var Eye = eyes[(eyeOffset + i) % eyes.length]
    var separation = 1.9,
      circle = Bodies.circle(xx + i * (size * separation), yy + length, size,
        { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0, slop: 1, render: {
            sprite: {
              texture: Eye,
              xScale: scale,
              yScale: scale,
            }
          } }),
      constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle, render: { anchors: false, lineWidth: 0, strokeStyle: '#ff0000' } });

    Composite.addBody(newtonsCradle, circle);
    Composite.addConstraint(newtonsCradle, constraint);
  }

  return newtonsCradle;
};

// add bodies
var cradle = newtonsCradle(280, 100, 5, 60, 200);
World.add(world, cradle);
Body.translate(cradle.bodies[0], { x: -180, y: -100 });

cradle = newtonsCradle(280, 380, 7, 40, 140);
World.add(world, cradle);
Body.translate(cradle.bodies[0], { x: -140, y: -100 });

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 50 },
  max: { x: 1000, y: 600 }
});
