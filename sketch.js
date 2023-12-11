function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  //background(220);
  let footX = width/2;
  let footY = height/3;
  let barkThick = 100;
  let rootThick = 40;
  let rootLen = 400;
  let rootSysWidth = 1;
  let z = random(0, 100);
  let freq = 0.05;
  let rsOrig = drawBark(footX, footY, barkThick, freq, z);
  //drawNoiseVects();

  let rs = new RootSystem(rsOrig.x, rsOrig.y, 
    rootSysWidth, rootLen, 
    rootThick, barkThick);
  rs.draw();

}

function drawNoiseVects() {
  let noiseScale = 0.01;
  let step = 50;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      //console.log("finish");
      let noiseoff = noise(x * noiseScale, y * noiseScale);
      let noisea = TAU * noiseoff;
      x1 = x + cos(noisea) * 20;
      y1 = y + sin(noisea) * 20;

      circle(x1, y1, 5)
      line(x, y, x1, y1);
    }
  }
}

class RootSystem {
  constructor(x, y, widthVar, maxLen, startSize, barkThick) {
    this.x = x;
    this.y = y;
    this.width = widthVar*PI;
    this.len = maxLen;
    this.startSize = startSize;
    this.rootStack = [];
    this.barkThick = barkThick

    let angle = PI/6;
    let orig = this.barkRootConnect(this.x, this.y, barkThick, this.x-barkThick/2, this.y+barkThick, this.startSize);
    let root = new Root(orig.x, orig.y, this.len, this.startSize, this.startSize, angle);
    //this.rootStack.push(root);
    let branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len/3;
        this.rootStack.push(br);
      }
    }
    angle = this.width/2 - PI/12;
    let orig1 = this.barkRootConnect(this.x, this.y, barkThick, this.x, this.y+barkThick, this.startSize);
    root = new Root(orig1.x, orig1.y, this.len, this.startSize, this.startSize, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len/3;
        this.rootStack.push(br);
      }
    }
    angle = this.width - PI/6;
    let orig2 = this.barkRootConnect(this.x, this.y, barkThick, this.x+barkThick/2, this.y+barkThick, this.startSize);
    root = new Root(orig2.x, orig2.y, this.len, this.startSize, this.startSize, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len/3;
        this.rootStack.push(br);
      }
    }
  }

  barkRootConnect(xB, yB, tB, xR, yR, tR) {
    stroke(0,50);
    let delX = xR-xB;
    let delY = abs(yB-yR);
    let delT = abs(tB-tR);
    let thickStep = delT/delY;
    let xStep = delX/delY;
    let thick = tB;
    let x = xB;
    let divis = 3;
    let y;
    for (y = yB; y < yR; y+=1/divis) {
      let xOfs = map(noise(y*0.08),0,1,-1,1);
      let yOfs = map(noise(y*0.08),0,1,-1,1);
      thick -= thickStep/divis;
      x += xStep/divis+xOfs/divis;
      circle(x, y+yOfs, thick);
    }
    return createVector(x, y);
  }

  draw() {
    while (this.rootStack.length > 0) {
      let root = this.rootStack.pop();
      let branches = root.draw();
      if (root.len > 50) {
        for (var br of branches) {
          br.len = br.len/3;
          this.rootStack.push(br);
        }
      }
    }
  }
}

class Root {
  constructor(x, y, len, initSize, startSize, angle) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.startSize = startSize;
    this.initSize = initSize;
    this.segmentSizeX = this.initSize;
    this.segmentSizeY = this.initSize;
    this.noiseZ = random(0, 1);
    this.angle = angle;
    this.numBranches = 6;
    this.noisea = angle;
  }

  draw() {
    while (this.segmentSizeX > this.startSize) {
      this.drawSegment();
    }

    let branchPoints = [];
    let nextBrPt = this.len/this.numBranches;
    let i = 0;
    while (this.segmentSizeX > 1) {
      this.drawSegment();
      if (i >= nextBrPt) {
        branchPoints.push(new Root(this.x, this.y, this.len, this.segmentSizeX, this.segmentSizeX, this.noisea));
        nextBrPt += this.len/this.numBranches;
      }
      i++;
    }
    return branchPoints;
  }

  drawSegment() {
    if (this.segmentSizeX > 1) {
      push();
      stroke(0, 100)
      //stroke(0, map(this.currLen,0,this.len/20,0,255,true))
      ellipse(this.x, this.y, this.segmentSizeX, this.segmentSizeY);
      this.update();
      this.currLen++;
      pop();
    }
  }

  update() {
    let noiseScale = 0.1;
    let noiseoff = noise(this.x * noiseScale,
      this.y * noiseScale,
      this.noiseZ * noiseScale);
    this.noisea = TAU * noiseoff - this.angle;
    let segmSizeOffs;
    if (this.segmentSizeX > this.startSize) {
      segmSizeOffs = -this.initSize/(this.initSize-this.startSize);
      this.x += cos(this.noisea)*0.3;
      this.y += sin(this.noisea)*0.3;
    } else {
      segmSizeOffs = -this.startSize/this.len;
      this.x += cos(this.noisea);
      this.y += sin(this.noisea);
    }
    //let segmSizeOffs = -this.startSize/this.len + noiseoff/this.len;
    //let segmSizeOffs = -(this.noisea)*0.11;
    this.segmentSizeX += segmSizeOffs;
    this.segmentSizeY += segmSizeOffs;

  }
}

function drawBark(btmX, btmY, thick, freq, z) {
  push();
  let randOffs = [];
  let lastC;
  for (let i = 0; i < btmY; i++) {
    stroke(0,100)
    //stroke(0, map(i,height/2,0,255,0))
    //noFill();
    let curOfs = map(noise(i * 0.03), 0, 1, -10, 10);
    randOffs.push(curOfs);
    circle(btmX+curOfs,i,thick);
    lastC = createVector(btmX+curOfs,i);
  }
  pop();

  let i = 0;
  for (let y = 0; y < btmY; y++) {
    //let randOffs = map(noise(y * freq), 0, 1, 20, 100);
    let curOfs = randOffs[i];
    let circL = btmX+curOfs - (thick+curOfs)/2;
    let circR = btmX+curOfs + (thick+curOfs)/2;
    for (let x = 0; x < width; x++) {
      let myNoise = marble(freq * x, freq * y, freq * z);
      stroke(map(myNoise, 0, 1, 0, 255),100);
      
      if (x > circL && x < circR) {
        //point(x, y);
      }
    }
    i++;
  }
  return lastC;
}

function marble(x, y, z) {
  let fi = 1.0;
  let fm = 2.0;
  let fs = 64.0;
  let ai = 1.0;
  let am = 0.5;
  let alpha = 10.0;
  let marble = 0.0;

  while (2 * fi <= fs) {
    marble += ai * noise(fi * x, fi * y, fi * z);
    fi = fi * fm;
    ai = ai * am;
    //console.log(fi);
  }
  marble = sin(alpha * (x + marble));
  return marble;
}