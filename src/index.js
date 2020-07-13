import Matter from 'matter-js'
import Eye from './eye.png';

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites,
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
    width: 800,
    height: 600,
    background: '#0f0f13',
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

  for (var i = 0; i < number; i++) {
    var separation = 1.9,
      circle = Bodies.circle(xx + i * (size * separation), yy + length, size,
        { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 1, render: {
            sprite: {
              texture: Eye,
            }
          } }),
      constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });

    Composite.addBody(newtonsCradle, circle);
    Composite.addConstraint(newtonsCradle, constraint);
  }

  return newtonsCradle;
};

// add bodies
var cradle = newtonsCradle(280, 100, 5, 30, 200);
World.add(world, cradle);
Body.translate(cradle.bodies[0], { x: -180, y: -100 });

cradle = newtonsCradle(280, 380, 7, 20, 140);
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
  max: { x: 800, y: 600 }
});
