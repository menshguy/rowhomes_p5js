function setup() {
    createCanvas(600, 600);
    noLoop();
    colorMode(HSL);
  }
  
  function draw() {
    background("antiquewhite");
    noStroke();
    
    const h = random(200, 600);
    const w = random(100, 600);
    const x = (width - w) / 2;
    const y = height;
    const rowhome = new Rowhome(x, y, w, h);
    rowhome.generateFloors();
    rowhome.draw();
    drawShadows();
  }
  
  class Rowhome {
    constructor (x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.floors = [];
      this.sections = []
    }
    
    generateFloors() {
      let numSections = random([2,3,4,4,4,5])
      let c = ['window', 'circle']
      let reducer = {remainder: this.h, original: this.h}
      let basement = [{
        h: getFloorHeight({min:0, max:30}, reducer),
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
      console.log("test", floorConfigs)
      
      let floors = floorConfigs.map((config, i) => {
        let {x, y, w} = this;
        let {h, sections} = config;
        let new_y = y - h;
        this.floors.push(new Floor(x, new_y, w, h, sections, i));
        this.y = new_y;
      })
    }
    
    draw() {
      this.floors.forEach(floor => floor.draw());
    }
  }
  
  class Floor {
    constructor (x, y, w, h, sections, i) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.sections = this.generateSections(sections);
      this.i = i;
    }
    
    generateSections(sections) {
      let {x, y, w, h} = this;
      let {proportions, contents} = sections;
  
      let curr_x = x;
      let section_w = w / sumArray(proportions);
      return proportions.map((proportion, i) => {
        let curr_w = proportion * section_w;
        let section = new Section(curr_x, y, curr_w, h, contents[i]);
        curr_x = curr_x + curr_w;
        return section;
      })
    }
    
    setStyles() {
      let fills = ["#FFCDAE", "#AEEEFF", "#FFAEDE", "#F9FF8C"]
      stroke("black");
      fill(fills[this.i])
    }
    
    unSetStyles() {
      noStroke();
      noFill();
    }
    
    draw() {
      this.setStyles()
      rect(this.x, this.y, this.w, this.h)
      // marker_rect(this.x, this.y, this.w, this.h)
      this.unSetStyles()
      
      this.sections.forEach(section => {
        section.draw()
      })
    }
  }
  
  class Section {
    constructor(x, y, w, h, content){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.content = content;
    }
    
    setStyles() {
      stroke("rgb(255,255,255)")
    }
    
    unSetStyles() {
      noStroke();
    }
    
    drawContent(content) {
      switch (this.content) {
        case "door":
          console.log("door");
          drawDoor(this.x, this.y, this.w, this.h, "#FEF828")
          break;
        case "window":
          drawWindow(this.x, this.y, this.w, this.h, "#C8FFBF")
          console.log("door");
          break;
        case "circle":
          drawCircle(this.x, this.y, this.w, this.h, "#FFBFFA")
          console.log("circle");
          break;
        default:
          console.error("Section content does not exist")
          break;
      }
          
    }
    
    draw () {
      this.setStyles();
      rect(this.x, this.y, this.w, this.h);
      this.drawContent()
      this.unSetStyles();
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
    console.log("window")
    // x,y should always be relative to the current section, so 
    let sx = x + 5;
    let sy = y + 5;
    let sw = w - 10;
    let sh = h - 10;
    
    console.log("window2")
    fill(fill_c);
    rect(sx, sy, sw, sh); 
    noFill();
    
  }
  
  function drawCircle (x, y, w, h, fill_c) {
    console.log("window")
    // x,y should always be relative to the current section, so 
    let sx = x + 5;
    let sy = y + 5;
    let sw = w - 10;
    let sh = h - 10;
    
    console.log("window2")
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
    let min_sections = sections, 
        max_sections = sections, 
        total_units = sections;
    // Will create an array of min_sections/max_sections indexes, filled with numbers that add up to total_units.
    
    // Randomly choose a number of indices/sections (between min and max)
    let numIndices = floor(random(min_sections, max_sections + 1)); // Random number between min_sections and max_sections
    let array = new Array(numIndices).fill(0); // Initialize the array with zeros
  
    for (let i = 0; i < numIndices - 1; i++) {
      // Generate a random number that will not exceed the remaining total_units
      let value = floor(random(1, total_units));
      array[i] = value;
      total_units -= value; // Decrease the total by the assigned value
    }
  
    // Assign the last index to the remaining total
    array[numIndices - 1] = total_units;
  
    return array;
  }
  
  function mousePressed(){
    redraw();
  }
  
  
  // -- MARKERS -- //
  function marker_rect (x, y, w, h) {
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
  
  
  function drawShadows(){
     // Circle parameters
    let cx = width / 2;
    let cy = height / 2;
    let r = 150; // Radius of the circle
    let lineSpacing = 12; // Spacing between lines
    let length = 40; // Length of each squiggly line
    let angle = PI / 4; // Direction for all lines (45 degrees)
  
    for (let y = cy - r; y < cy + r; y += lineSpacing) {
      for (let x = cx - r; x < cx + r; x += lineSpacing) {
        // Only draw lines within the circular boundary
        if (dist(cx, cy, x, y) < r) {
          drawSquigglyLine(x, y, length, angle, cx, cy, r);
        }
      }
    }
  
    // Draw the circle outline on top
    stroke("black");
    strokeWeight(2);
    noFill();
    ellipse(cx, cy, r * 2);
  }
  
  // Function to draw a single squiggly line
  function drawSquigglyLine(x, y, length, angle, cx, cy, r) {
    let segments = floor(length / 5); // Number of small segments in the line
    let amp = 1;  // Amplitude of squiggle
    stroke("rgb(0,0,0)");
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < segments; i++) {
      let offsetX = cos(angle) * i * 5 + sin(angle) * random(-amp, amp);
      let offsetY = sin(angle) * i * 5 + cos(angle) * random(-amp, amp);
  
      let px = x + offsetX;
      let py = y + offsetY;
  
      // Only add vertex if point is within the circle
      if (dist(cx, cy, px, py) < r) {
        vertex(px, py);
      } else {
        endShape(); // Ends the shape if it goes out of bounds
        beginShape(); // Start a new shape to continue with points inside
      }
    }
    endShape();
  }
  
  // function drawSquigglyLines() {
  
  //   let spacing = random(10, 20);
  //   let startX = random(50, width - 50);
  //   let startY = random(50, height - 50);
    
  //   for (let i = 0; i < 10; i++) {
  //     let x = startX + i * spacing;
  //     let y = startY + sin(i) * 10; // Use sin function for squiggles
  //     line(x, startY, x, y);
  //   }
  // }
  
  // function drawShadows() {
  //   drawSquigglyLines(); // Call squiggly lines drawing
  // }
  