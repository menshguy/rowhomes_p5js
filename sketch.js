let buffers = [];
let cw = 600;
let ch = 600;

function setup() {
  createCanvas(cw, ch);
  colorMode(HSL);
}

function draw() {
  background("antiquewhite");
  noStroke();
  noLoop();

  // Clear the graphics buffers
  buffers.forEach(buffer => { buffer?.clear() })

  //Draw Rowhome
  const h = random(ch/3, ch);
  const w = random(ch/6, cw);
  const x = (width - w) / 2;
  const y = height;
  const rowhome = new Rowhome(x, y, w, h);
  rowhome.generateFloors();
  rowhome.draw();
}

class Rowhome {
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.floors = [];
  }

  generateFloors() {
    let numSections = random([2,3,4,4,4,5]);
    let c = ['window', 'circle'];
    let reducer = {remainder: this.h, original: this.h};
    let basement = [{
      h: getFloorHeight({min:20, max:40}, reducer),
      sections: {
        proportions: getSectionProportions(numSections),
        contents: [random(c), random(c), random(c), random(c), random(c)]
      }
    }]
    let mainFloor = [{
      h: getFloorHeight({min:100, max:200}, reducer),
      sections: {
        proportions: getSectionProportions(numSections),
        contents: ['door', random(c), random(c), random(c), random(c)]
      }
    }]
    let middleFloors = [{
      h: getFloorHeight({min:100, max:150}, reducer),
      sections: {
        proportions: getSectionProportions(numSections),
        contents: [random(c), random(c), random(c), random(c), random(c)]
      }
    }]
    let topFloor = [{
      h: getFloorHeight({min:100, max:150}, reducer),
      sections: {
        proportions: getSectionProportions(numSections),
        contents: [random(c), random(c), random(c), random(c), random(c)]
      }
    }]

    let floorConfigs = [...basement, ...mainFloor, ...middleFloors, ...topFloor];
    floorConfigs.forEach((config, i) => {
      let {x, y, w} = this;
      let {h, sections} = config;
      let new_y = y - h;
      this.floors.push(new Floor(x, new_y, w, h, sections, i));
      this.y = new_y;
    })
  }

  drawFullHouseForTesting(){
    fill("red")
    rect(this.x, height - this.h, this.w, this.h)
    noFill()
  }

  draw() {
    this.drawFullHouseForTesting()
    this.floors.forEach(floor => floor.draw());
  }
}

class Floor {
  constructor (x, y, w, h, sections, i) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
    this.fills = [color(23, 100, 94), color(193, 100, 84), color(324, 100, 94), color(14, 100, 87)];
    this.sections = this.generateSections(sections);
  }

  generateSections(sections) {
    let {x, y, w, h, fills, i} = this;
    let {proportions, contents} = sections;

    let curr_x = x;
    let section_w = w / sumArray(proportions);
    let stroke_c = 'black'
    let fill_c = fills[i]
    return proportions.map((proportion, i) => {
      let curr_w = proportion * section_w;
      
      let section = new Section(
        curr_x, 
        y, 
        curr_w, 
        h, 
        contents[i],
        stroke_c,
        fill_c
      );
      curr_x = curr_x + curr_w;
      return section;
    })
  }

  setStyles() {
    stroke("black");
    fill(this.fills[this.i])
  }

  unSetStyles() {
    noStroke();
    noFill();
  }

  draw() {
    this.setStyles()
    marker_rect(this.x, this.y, this.w, this.h, color(40, 59, 79), this.fills[this.i])
    this.unSetStyles()
      
    this.sections.forEach((section) => {
      if (section.w) section.draw()
    })
  }
}

class Section {
  constructor(x, y, w, h, content, stroke_c, fill_c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.content = content;
    this.stroke_c = stroke_c;
    this.fill_c = fill_c;
  }

  setStyles() {
    stroke(this.stroke_c)
    fill(this.fill_c)
  }

  unSetStyles() {
    noStroke();
    noFill()
  }

  drawShadows() {
    if (this.w <= 0 || this.h <= 0) {
      console.error("Invalid buffer dimensions", this.w, this.h);
      return;
    }

    let shadowBuffer = createGraphics(this.w, this.h);
    let shadowMaskBuffer = createGraphics(this.w, this.h);
    buffers.push(shadowBuffer, shadowMaskBuffer); // This will let us clear all buffers later

    drawShadows(0, 0, this.w, this.h, shadowBuffer);

    shadowMaskBuffer.fill("black");
    shadowMaskBuffer.rect(0, 0, this.w, this.h);
    shadowMaskBuffer.noFill();

    let shadowImage = shadowBuffer.get(); // Get the current state of the graphics buffers
    let shadowMask = shadowMaskBuffer.get();
    // shadowImage.filter(BLUR, 1)
    
    shadowImage.mask(shadowMask); // Use the mask on the image
    
    blendMode(BURN);
    image(shadowImage, this.x, this.y);
    blendMode(BLEND); // Reset blend mode to default
  }

  drawContent() {
    let originalColor = this.fill_c
    let darkenedColor = color(
      hue(originalColor), 
      saturation(originalColor), 
      max(0, lightness(originalColor) - 10)
    );
    switch (this.content) {
      case "door":
        drawDoor(this.x, this.y, this.w, this.h, darkenedColor)
        break;
      case "window":
        drawWindow(this.x, this.y, this.w, this.h, darkenedColor)
        break;
      case "circle":
        drawWindow(this.x, this.y, this.w, this.h, darkenedColor)
        break;
      default:
        console.error("Section content does not exist")
        break;
    }
  }

  draw () {
    this.setStyles();
    // marker_rect(this.x, this.y, this.w, this.h);
    this.unSetStyles();

    this.drawContent();

    this.drawShadows();
  }
}

//-- Details --//
function drawDoor (x, y, w, h, fill_c) {
  // x,y should always be relative to the current section, so 
  let sw = random(40, 50);
  let sh = random(80, 100);

  let centered = x + (w/2) - (sw/2);
  let aligned_left = x + random(5, 10);
  let aligned_right = x + w - (sw + random(5, 10));
  let sx = random([centered, aligned_left, aligned_right]);
  let sy = y + h - sh;

  fill(fill_c);
  noStroke()
  rect(sx, sy, sw, sh); 
  noFill();
}

function drawWindow (x, y, w, h, fill_c) {
  let sx = x + 5;
  let sy = y + 5;
  let sw = w - 10;
  let sh = h - 10;

  fill(fill_c);
  rect(sx, sy, sw, sh); 
  noFill();
}

function drawCircle (x, y, w, h, fill_c) {
  // x,y should always be relative to the current section, so 
  let sx = x + 5;
  let sy = y + 5;
  let sw = w - 10;
  let sh = h - 10;

  fill(fill_c);
  rect(sx, sy, sw, sh); 
  noFill();
}

function drawAwning (x, y, w, h, fill_c) {
  fill(fill_c)
  quad(x, y, x+w, y+10, x-10, y+10, x+w+10, y+10); // quad(x1, y1, x2, y2, x3, y3, x4, y4)
  noFill()
}

//-- HELPER FUNCS --//
function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function getFloorHeight(range, reducer) {
  let randomValue = Math.random() * (range.max - range.min) + range.min;
  let floor_height = (randomValue / reducer.remainder) * reducer.original;
  return floor_height;
}

function getSectionProportions(sections) {
  // Will create an array of min_sections/max_sections indexes, filled with numbers that add up to total_units.
  
  // Randomly choose a number of indices/sections (between min and max)
  let numIndices = sections; // Random number between min_sections and max_sections
  let array = new Array(numIndices).fill(0); // Initialize the array with zeros

  let remaining_units = sections;
  for (let i = 0; i < numIndices; i++) {
    // Generate a random number that will not exceed the remaining total_units
    let value = floor(random(0, remaining_units));
    array[i] = value;
    remaining_units = remaining_units - value < 0 ? 0 : remaining_units - value; // Decrease the total by the assigned value
  }

  // Assign the last index to the remaining total
  array[numIndices - 1] = remaining_units;

  return array;
}


// -- MARKERS -- //
function marker_rect (x, y, w, h, stroke_c = "black", fill_c = "white") {
  
  stroke(stroke_c)
  rect(x, y, w, h)

  for (let i = 0; i < 3; i++) {  // Draw multiple lines to make it look rough
    let xOffset = random(-5, 4);  // Random offset for sketchy effect
    let yOffset = random(-5, 6);
    
    // Top line
    line(
      x + random(-2, 2), 
      y + random(-2, 2), 
      x + w + random(-2, 2), 
      y + random(-2, 2)
    );
    
    // Right line
    line(
      x + w + random(-2, 2), 
      y + random(-2, 2), 
      x + w + random(-2, 2), 
      y + h + random(-2, 2)
    );
    
    // Bottom line
    line(
      x + random(-2, 2), 
      y + h + random(-2, 2), 
      x + w + random(-2, 2), 
      y + h + random(-2, 2)
    );
    
    // Left line
    line(
      x + random(-2, 2), 
      y + random(-2, 2), 
      x + random(-2, 2), 
      y + h + random(-2, 2)
    );
  }
}

function drawShadows(_x, _y, w, h, buffer) {
  let lineSpacing = 6;  // Spacing between squiggly lines
  let length = 20;       // Length of each squiggly line
  let angle = PI / 4;    // Direction for all lines (45 degrees)

  for (let y = _y; y < h; y += lineSpacing) {
    for (let x = _x; x < w; x += lineSpacing) {
      drawSquigglyLine(x, y, length, angle, buffer);
    }
  }
}

// Function to draw a single squiggly line
function drawSquigglyLine(x, y, length, angle, buffer) {
  let segments = floor(length / 5); // Number of small segments in the line
  let amp = 1;                  // Amplitude of squiggle
  buffer.stroke("grey")
  buffer.strokeWeight(0.5);                // Thinner lines for finer ink-like detail
  // buffer.stroke(0);                        // Black ink for squiggle lines

  buffer.beginShape();
  for (let i = 0; i < segments; i++) {
    let offsetX = cos(angle) * i * 5 + sin(angle) * random(-amp, amp);
    let offsetY = sin(angle) * i * 5 + cos(angle) * random(-amp, amp);

    let px = x + offsetX;
    let py = y + offsetY;

    buffer.vertex(px, py);
  }
  buffer.endShape();
}

// -- Events -- //
function mousePressed(){
  redraw();
}