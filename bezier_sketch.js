let cw = 600;
let ch = 600;
let bottom;
let x1, x2, y1, y2, endX, endY;
let startPoint = {x:100, y: 200}
let endPoint = {x:400, y:400}
let controlPoints = [
  {x: 200, y: 400}, 
  {x: 200, y: 50}
]

function setup() {
  createCanvas(cw, ch);
  colorMode(HSL);
}

function draw() {
  background("antiquewhite");

  beginShape();
  vertex(startPoint.x, startPoint.y)
  bezierVertex(
    controlPoints[0].x, controlPoints[0].y,
    controlPoints[1].x, controlPoints[1].y,
    endPoint.x, endPoint.y
  )
  endShape();

  //Draw Anchor Points
  stroke("black");
  strokeWeight(5);
  point(startPoint.x, startPoint.y)
  point(endPoint.x, endPoint.y)
  //Draw Control Points for Reference
  stroke("red");
  strokeWeight(5);
  controlPoints.forEach(p => {
    line()
    point(p.x, p.y)
  })

  //Connect Control Points to Anchor Points
  stroke("red")
  strokeWeight(1);
  line(startPoint.x, startPoint.y, controlPoints[0].x, controlPoints[0].y)
  line(endPoint.x, endPoint.y, controlPoints[1].x, controlPoints[1].y)
}

function mousePressed() {
  controlPoints.forEach(p => {
    if (dist(mouseX, mouseY, p.x, p.y) < 10) {
      p.isDragging = true;
    }
  });
}

function mouseDragged() {
  controlPoints.forEach(p => {
    if (p.isDragging) {
      p.x = mouseX;
      p.y = mouseY;
    }
  });
}

function mouseReleased() {
  controlPoints.forEach(p => {
    p.isDragging = false;
  });
}