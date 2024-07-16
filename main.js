import * as Matter from 'matter-js'

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);

//
var ground = Bodies.rectangle(150, 610, render.options.width - 100, 60, { isStatic: true });
var divider = Bodies.rectangle(render.options.width - 305, 610, 10, 400, { isStatic: true });
var prize_area = Bodies.rectangle(650, 610, 300, 60, { isStatic: true });

//create a claw machine gripper
var link_length = 50
var link_width = 25
var top_link = Bodies.rectangle(render.options.width / 2, link_length / 2,  link_width, link_length, {isStatic: true})
var middle_link = Bodies.rectangle(render.options.width / 2, 3 * link_length / 2,  link_width, link_length)
var bottom_link = Bodies.rectangle(render.options.width / 2, 5 * link_length / 2,  link_width, link_length)

// add all of the bodies to the world
var claw_machine_chain = Composite.create()
Composite.add(claw_machine_chain, [top_link, middle_link, bottom_link])

  
Composites.chain(claw_machine_chain, 0, 0, 0, 0)




Composite.add(engine.world, [boxA, boxB, ground, divider, prize_area, claw_machine_chain]);



// //listen for keyboard press to move chain


document.addEventListener('keydown', (e) => {
  
  console.log(e.key)
  if(e.key === "ArrowLeft") {
    Composite.translate(claw_machine_chain, {x: -1, y: 0})
  }
  else if(e.key === "ArrowRight") {
    Composite.translate(claw_machine_chain, {x: 1, y: 0})
  
  }
});




// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
