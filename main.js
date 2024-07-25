import * as Matter from 'matter-js'

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    
});

// create two boxes and a ground
//find the objects in the dom
var boxA = Bodies.rectangle(200, 200, 80, 80);
var boxB = Bodies.rectangle(150, 50, 80, 80);

//
var ground = Bodies.rectangle(150, 610, render.options.width - 100, 60, { isStatic: true });
var divider = Bodies.rectangle(render.options.width - 305, 610, 10, 400, { isStatic: true });
var prize_area = Bodies.rectangle(650, 610, 300, 60, { isStatic: true });

//create a claw machine gripper
var link_length = 60
var link_width = 20

// add all of the bodies to the world
var claw_machine_chain = Composite.create()


var top_link = Bodies.rectangle(render.options.width / 2, 0,  link_width, link_length, {isStatic: true})
Composite.add(claw_machine_chain, top_link)
var previous = top_link
var number_of_links = 2
for(let i = 0; i < number_of_links; i++) {
  var link = Bodies.rectangle(render.options.width / 2, (i + 1) * link_length,  link_width, link_length)
  Composite.add(claw_machine_chain, link)
  const constraint = Constraint.create({
      bodyA: previous,
      pointA: { x: 0, y: link_length /2 },
      bodyB: link,
      pointB: { x: 0, y: -link_length /2 },
      length: 5,
      stiffness: 1
  });
  previous = link
  Composite.add(claw_machine_chain, constraint)
}

var claw_hand_top_length = 20
var claw_hand_top_width = 120

var claw_machine_hand = Composite.create()
var claw_hand_top = Bodies.rectangle(render.options.width / 2, (number_of_links + 2) * link_length,  claw_hand_top_width, claw_hand_top_length, {
  density: 0.1,
  restitution: 0,
  friction: 1, // Higher friction
  inertia: Infinity // Prevent rotation
})
var claw_hand_left = Bodies.rectangle(render.options.width / 2 - 45, (number_of_links + 3) * link_length,  20, 100, {
  density: 0.1,


})
var claw_hand_right = Bodies.rectangle(render.options.width / 2 + 45, (number_of_links + 3) * link_length,  20, 100, {
  density: 0.1,
})

Composite.add(claw_machine_hand, [claw_hand_top, claw_hand_left, claw_hand_right])




// Composite.add(claw_machine_chain, claw_machine_hand)

const left_hand_constraint = Constraint.create({
  bodyA: claw_hand_top,
  pointA: { x: - claw_hand_top_width / 2 + 10, y: claw_hand_top_length / 2 },
  bodyB: claw_hand_left,
  pointB: { x: 0, y: -50 },
  length: 5,
  stiffness: 1
});

Composite.add(claw_machine_hand, left_hand_constraint)


const right_hand_constraint = Constraint.create({
  bodyA: claw_hand_top,
  pointA: { x: claw_hand_top_width / 2 - 10, y: claw_hand_top_length / 2 },
  bodyB: claw_hand_right,
  pointB: { x: 0, y: -50 },
  length: 5,
  stiffness: 1
});

Composite.add(claw_machine_hand, right_hand_constraint)

const claw_constraint = Constraint.create({
  bodyA: claw_machine_chain.bodies[2],
  pointA: { x: 0, y: link_length /2 },
  bodyB: claw_hand_top,
  pointB: { x: 0, y: -10 },
  length: 10,
  stiffness: 0
});
Composite.add(claw_machine_chain, claw_constraint)


Composite.add(engine.world, [boxA, boxB, ground, divider, prize_area, claw_machine_chain, claw_machine_hand]);



// //listen for keyboard press to move chain


document.addEventListener('keydown', (e) => {

  const body = claw_machine_chain.bodies[0];
  
  //move the claw machine
  if(e.key === "ArrowLeft") {
      Body.setPosition(body, { 
          x: body.position.x - 1, 
          y: body.position.y
      });
  }
  else if(e.key === "ArrowRight") {
      Body.setPosition(body, { 
        x: body.position.x + 1, 
        y: body.position.y
    });
  }
  //apply a force to grab it
  else if(e.key === "ArrowDown"){
    const left = claw_machine_hand.bodies[1]
    const right = claw_machine_hand.bodies[2]
    Body.applyForce(left, body.position, {x: -0.05, y : 0})
    Body.applyForce(right, body.position, {x: 0.05, y : 0})
  }
});


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
