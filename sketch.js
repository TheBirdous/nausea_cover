function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  //background(220);
  let z = random(0, 100);
  let freq = 0.04;
  //drawBark(freq, z);
  //drawNoiseVects();

  let rs = new RootSystem(width / 2 - 5, height / 2, 1, 300, 30);
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
  constructor(x, y, widthVar, maxLen, startSize) {
    this.x = x;
    this.y = y;
    this.width = widthVar*PI;
    this.len = maxLen;
    this.startSize = startSize;
    this.rootStack = [];

    let angle = PI/6;
    let root = new Root(this.x, this.y, this.len, this.startSize, angle);
    this.rootStack.push(root);
    angle = this.width/2 - PI/12;
    root = new Root(this.x, this.y, this.len, this.startSize, angle);
    this.rootStack.push(root);
    angle = this.width - PI/6;
    root = new Root(this.x, this.y, this.len, this.startSize, angle);
    this.rootStack.push(root);
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
  constructor(x, y, len, startSize, angle) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.startSize = startSize;
    this.segmentSizeX = this.startSize;
    this.segmentSizeY = this.startSize;
    this.noiseZ = random(0, 1);
    this.angle = angle;
    this.numBranches = 6;
    this.noisea = angle;
  }

  draw() {
    let branchPoints = [];
    let nextBrPt = this.len/this.numBranches;
    for (let i = 0; i < this.len; i++) {
      this.drawSegment();
      if (i >= nextBrPt) {
        branchPoints.push(new Root(this.x, this.y, this.len, this.segmentSizeX, this.noisea));
        nextBrPt += this.len/this.numBranches;
      }
    }
    return branchPoints;
  }

  drawSegment() {
    if (this.segmentSizeX > 1) {
      stroke(0, 100)
      ellipse(this.x, this.y, this.segmentSizeX, this.segmentSizeY);
      this.update();
      this.currLen++;
    }
  }

  update() {
    let noiseScale = 0.1;
    let noiseoff = noise(this.x * noiseScale,
      this.y * noiseScale,
      this.noiseZ * noiseScale);
    this.noisea = TAU * noiseoff - this.angle;
    let segmSizeOffs = -this.startSize / this.len;
    this.segmentSizeX += segmSizeOffs;
    this.segmentSizeY += segmSizeOffs;
    this.x += cos(this.noisea) * 1.5;
    this.y += sin(this.noisea) * 1.5;
  }
}

function drawBark(freq, z) {
  for (let y = 0; y < height; y++) {
    let randOffs = map(noise(y * freq), 0, 1, 20, 100);
    for (let x = 0; x < width; x++) {
      let myNoise = marble(freq * x, freq * y, freq * z);
      stroke(map(myNoise, 0, 1, 0, 255));

      if (x > randOffs && x < width - randOffs) {
        point(x, y);
      }
    }
  }
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