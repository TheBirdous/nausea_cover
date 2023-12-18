let cnv;
let z;
let noiseOffs;
let noiseOffsStep;
let imgCount;
// 3:4 settings
// cnv = createCanvas(300*1.5, 400*1.5);
// let footY = height / 2;

// 16:9 settings
// cnv = createCanvas(16 * 50, 9 * 50);
// let footY = height / 1.5;

function setup() {
  cnv = createCanvas(16 * 50, 9 * 50);
  z = random(0, 100);
  noiseOffs = 1;
  noiseOffsStep = 0.1;
  imgCount = 30;
  noLoop();
  pixelDensity(3);
  strokeWeight(1);
}

function draw() {
  push();
  background(255);
  let footX = 0;
  let footY = height / 1.4;
  let myScale = 0.5;
  translate(width / 2, height / 7)
  scale(myScale)
  let barkThick = 100;
  let rootThick = 40;
  let rootLen = 400;
  let rootSysWidth = 1;
  let freq = 0.05;
  let rsOrig = drawTrunk(footX, footY, barkThick, freq, z);
  //drawNoiseVects();

  let rs = new RootSystem(rsOrig.x, rsOrig.y,
    rootSysWidth, rootLen,
    rootThick, barkThick, freq);
  rs.draw();
  pop();
}

function drawNoiseVects() {
  let noiseScale = 0.01;
  let step = 50;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      //console.log("finish");
      let noiseoff = noise(x * noiseScale, y + noiseOffs * noiseScale);
      let noisea = TAU * noiseoff;
      x1 = x + cos(noisea) * 20;
      y1 = y + sin(noisea) * 20;

      circle(x1, y1, 5)
      line(x, y, x1, y1);
    }
  }
}

class RootSystem {
  constructor(x, y, widthVar, maxLen, startSize, barkThick, freq) {
    this.x = x;
    this.y = y;
    this.width = widthVar * PI;
    this.len = maxLen;
    this.startSize = startSize;
    this.rootStack = [];
    this.barkThick = barkThick;
    this.freq = freq;

    let angle = -PI / 12;
    let orig = this.barkRootConnect(this.x, this.y, barkThick, this.x - barkThick / 2, this.y + barkThick / 2, this.startSize);
    let root = new Root(orig.x, orig.y, this.len, this.startSize, this.startSize, angle);
    //this.rootStack.push(root);
    let branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len / 3;
        this.rootStack.push(br);
      }
    }

    angle = 0;
    orig = this.barkRootConnect(this.x, this.y, barkThick, this.x - barkThick / 3, this.y + barkThick, this.startSize - 20);
    root = new Root(orig.x, orig.y, this.len - 50, this.startSize - 20, this.startSize - 20, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len / 3;
        this.rootStack.push(br);
      }
    }

    angle = PI - PI / 8;
    orig = this.barkRootConnect(this.x, this.y, barkThick, this.x + barkThick / 3, this.y + barkThick, this.startSize - 20);
    root = new Root(orig.x, orig.y, this.len - 50, this.startSize - 20, this.startSize - 20, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len / 3;
        this.rootStack.push(br);
      }
    }

    angle = PI - PI / 12;
    orig = this.barkRootConnect(this.x, this.y, barkThick, this.x + barkThick / 2, this.y + barkThick / 2, this.startSize);
    root = new Root(orig.x, orig.y, this.len, this.startSize, this.startSize, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len / 3;
        this.rootStack.push(br);
      }
    }

    angle = PI / 12;
    orig = this.barkRootConnect(this.x, this.y, barkThick, this.x, this.y + barkThick, this.startSize + 15);
    root = new Root(orig.x, orig.y, this.len, this.startSize + 15, this.startSize + 15, angle);
    //this.rootStack.push(root);
    branches = root.draw();
    if (root.len > 50) {
      for (var br of branches) {
        br.len = br.len / 3;
        this.rootStack.push(br);
      }
    }
  }

  barkRootConnect(xB, yB, tB, xR, yR, tR) {
    stroke(0, 100);
    let delX = xR - xB;
    let delY = abs(yB - yR);
    let delT = abs(tB - tR);
    let thickStep = delT / delY;
    let xStep = delX / delY;
    let thick = tB;
    let x = xB;
    let divis = 1;
    let divCnt = 0;
    let y;
    for (y = yB; y < yR; y += 1 / divis) {
      let xOfs = map(noise(y * this.freq * divis + yB, noiseOffs), 0, 1, -2, 2);
      let yOfs = 1//map(noise(y*this.freq*divis),0,1,-1,1);
      thick -= thickStep / divis;
      x += xStep / divis + xOfs;


      circle(x, y + yOfs, thick);
    }
    return createVector(x, y);
  }

  draw() {
    while (this.rootStack.length > 0) {
      let root = this.rootStack.pop();
      let branches = root.draw();
      if (root.len > 50) {
        for (var br of branches) {
          br.len = br.len / 3;
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
    let nextBrPt = this.len / this.numBranches;
    let i = 0;
    while (this.segmentSizeX > 1) {
      this.drawSegment();
      if (i >= nextBrPt) {
        branchPoints.push(new Root(this.x, this.y, this.len, this.segmentSizeX, this.segmentSizeX, this.noisea));
        nextBrPt += this.len / this.numBranches;
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
      (this.noiseZ + noiseOffs) * noiseScale);
    this.noisea = TAU * noiseoff - this.angle;
    let segmSizeOffs;
    segmSizeOffs = -this.startSize / this.len;
    this.x += cos(this.noisea);
    this.y += sin(this.noisea);
    this.segmentSizeX += segmSizeOffs;
    this.segmentSizeY += segmSizeOffs;
  }
}

function drawTrunk(btmX, btmY, thick, freq, z) {
  push();
  let randOffs = [];
  let lastC;
  let top = 11;
  for (let i = 0; i < btmY; i += 1) {
    stroke(0, map(i, height / 2 - 100, 0, 100, 0, 1));

    //noFill();
    let dispers = 0.008;
    let curWidth = dispers * pow(i - btmY, 2) + thick;
    let h = -pow(2 * top * (1 / btmY) * i - top, 2) + pow(top, 2);
    console.log(h);
    let curOfs = map(noise(i * freq, noiseOffs), 0, 1, -5, 5);
    randOffs.push(curOfs);
    circle(btmX + curOfs, -h + btmY, curWidth)
    lastC = createVector(btmX + curOfs, -h + btmY);
  }

  pop();
  return lastC;
}


// Ulozeni obrazku
function keyPressed() {
  if (key === 's') {
    save(cnv, 'stromky/stromek.png');
  }
  if (key === 'd') {
    noiseOffs += noiseOffsStep;
    draw();
  }
  if (key === 'b') {
    exportVideo()
  }
}

function exportVideo() {
  for (let i = 0; i < imgCount; i++) {
    let imgName = `stromek${i}.png`;
    save(cnv, imgName);
    noiseOffs += noiseOffsStep;
    draw();
  }
}