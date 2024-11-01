let cw = 600;
let ch = 600;
let bottom = 100;
let drawControls = false;
let lines = []

function setup() {
  createCanvas(cw, ch);
  colorMode(HSL);
  // let numLines = floor(random(3, 20));
  let numLines = 5
  
  for (let i = 0; i < numLines; i++) {
    let lineLength = 400
    let startPoint = {
      x:cw/2, 
      y:ch-bottom
    };
    let endPoint = {
      x:startPoint.x + random(-250, 250), 
      y:random((ch-bottom-lineLength) + (lineLength/2), ch-bottom-lineLength)
    }
    let startControlPoint = {
      x: startPoint.x, 
      y: random(startPoint.y, endPoint.y)
    }
    let endControlPoint = {
      x: endPoint.x < startPoint.x ? random(endPoint.x, startPoint.x) : random(startPoint.x, endPoint.x),
      y: random(startControlPoint.y, endPoint.y)
    }
    let controlPoints = [startControlPoint, endControlPoint]
    lines.push({ startPoint, endPoint, controlPoints })
  }
}

function draw() {
  background("antiquewhite");
 
  //Draw the Lines
  lines.forEach(l => {
    let {startPoint, controlPoints, endPoint} = l

    //Style the line
    stroke(color(15, 50, 56,))
    strokeWeight(2);
    noFill()
    beginShape();
    vertex(startPoint.x, startPoint.y)
    bezierVertex(
      controlPoints[0].x, controlPoints[0].y,
      controlPoints[1].x, controlPoints[1].y,
      endPoint.x, endPoint.y
    )
    endShape();
    
    // Draw Control UI
    if(drawControls){
      //Draw Anchor Points
      stroke("black");
      strokeWeight(5);
      point(startPoint.x, startPoint.y)
      point(endPoint.x, endPoint.y)
      
      //Draw Control Points for Reference
      stroke("red");
      strokeWeight(5);
      controlPoints.forEach(p => {
        point(p.x, p.y)
      })
    
      //Connect Control Points to Anchor Points
      stroke("red")
      strokeWeight(1);
      line(startPoint.x, startPoint.y, controlPoints[0].x, controlPoints[0].y)
      line(endPoint.x, endPoint.y, controlPoints[1].x, controlPoints[1].y)
    }
  })
}

function mousePressed() {
  if (drawControls){
    lines.forEach(line => {
      let p = line.controlPoints
      let x1 = p[0].x
      let y1 = p[0].y
      let x2 = p[1].x
      let y2 = p[1].y
      if (dist(mouseX, mouseY, x1, y1) < 10) {
        line.isDragging = {i: 0};
      }
      if (dist(mouseX, mouseY, x2, y2) < 10) {
        line.isDragging = {i: 1};
      }
    });
  } else {
    lines =[];
    clear();
    setup();
    draw();
  }
}

function mouseDragged() {
  lines.forEach(line => {
    let p = line.controlPoints
    if (line.isDragging) {
      p[line.isDragging.i].x = mouseX;
      p[line.isDragging.i].y = mouseY;
    }
  });
}

function mouseReleased() {
  lines.forEach(line => {
    line.isDragging = false;
  });
}