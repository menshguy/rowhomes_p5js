let cw = 600;
let ch = 600;
let bottom = 100;
let drawControls = false;
let trees = []

function setup() {
  createCanvas(cw, ch);
  colorMode(HSL);
  let numTrees = 10
  let center = {x:cw/2, y:ch-bottom}
  
  for (let i = 0; i < numTrees; i++) {
    let numLines = floor(random(5,21));
    let startPoint = {x: random(center.x-(cw/2), center.x+(cw/2)), y: center.y};
    let treeHeight = random(100,200);
    let treeWidth = random(100,200)
    let tree = new Tree({numLines, startPoint, treeHeight, treeWidth})
    trees.push(tree)
  }
}

function draw() {
  background("antiquewhite");
  trees.forEach(tree => tree.draw()); //Draw the Tree(s)
}

class Tree {
  constructor({numLines, startPoint, treeHeight, treeWidth}){
    Object.assign(this, { numLines, startPoint, treeHeight, treeWidth });
    this.lines = this.generateTree()
  }

  generateTree() {
    let {startPoint, numLines, treeHeight, treeWidth} = this;
    let lines = [];

    for (let i = 0; i < numLines; i++) {
      let endPoint = {
        x: startPoint.x + random(-(treeWidth/2), treeWidth/2), 
        y: random((startPoint.y-bottom-treeHeight) + (treeHeight/2), startPoint.y-bottom-treeHeight)
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
    return lines;
  }

  draw(){
    this.lines.forEach(l => {
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

  clear() {
    this.lines = []
  }
}

function mousePressed() {
  if (drawControls){
    trees.forEach(tree => {
      let {lines} = tree;
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
    });
  } else {
    trees.forEach(tree => tree.clear());
    clear();
    setup();
    draw();
  }
}

function mouseDragged() {
  trees.forEach(tree => {
    let {lines} = tree;
    lines.forEach(line => {
      let p = line.controlPoints
      if (line.isDragging) {
        p[line.isDragging.i].x = mouseX;
        p[line.isDragging.i].y = mouseY;
      }
    });
  })
}

function mouseReleased() {
  trees.forEach(tree => {
    let {lines} = tree;
    lines.forEach(line => {
      line.isDragging = false;
    });
  })
}