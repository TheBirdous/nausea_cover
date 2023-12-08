function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  //background(220);
  let z = random(0,100);
  let freq = 0.04;
  //drawBark(freq, z);
  //drawNoiseVects();

//for (let i = 0; i < 5; i++) {
//  let root = new Root(width/2+i*10, height/2, i);
//  root.draw();
//}
let root = new Root(width/2-5, height/2);
root.draw();
// root = new Root(width/2, height/2+5);
// root.draw();
// root = new Root(width/2+5, height/2);
// root.draw();
}

function drawNoiseVects() {
  let noiseScale = 0.01;
  let step = 50;
  for (let y = 0; y < height; y+=step) {
    for (let x = 0; x < width; x+=step) {
      //console.log("finish");
      let noiseoff = noise(x*noiseScale, y*noiseScale);
      let noisea = TAU*noiseoff;
      x1 = x + cos(noisea)*20;
      y1 = y + sin(noisea)*20;

      circle(x1, y1, 5)
      line(x, y, x1, y1);
    }
  }
}

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rootLen = 300;
    this.currLen = 0;
    this.startSize = 30;
    this.segmentSizeX = this.startSize;
    this.segmentSizeY = this.startSize;
    this.noiseZ = random(0,1);
    this.offsets = [-1,1]
    //this.xOrient = random(this.offsets);
    //this.yOrient = random(this.offsets);
    this.bx = this.x;
    this.by = this.y;
    this.bsgm = this.segmentSize;
    this.obsgm = this.bsgm;
  }

  drawSegment() {
    stroke(0,100)
    ellipse(this.x, this.y, this.segmentSizeX, this.segmentSizeY);
    this.update();
    this.currLen++; 
    if (this.currLen % 100 == 0) {
      console.log("branchd")
      this.by = this.y;
      this.bx = this.x;
      this.bsgm = this.segmentSizeX;
      this.drawBranch();
    }
  }

  drawBranch() {
    let cap = random(100,200);
    for (let i = 0; i < cap; i++) {
      //stroke(120,100,0,100)
      circle(this.bx, this.by, this.bsgm);
      this.updateBranch(cap);
    }
  }
 
  update() {
    let noiseScale = 0.1;
    let noiseoff = noise(this.x*noiseScale, 
                          this.y*noiseScale, 
                          this.noiseZ*noiseScale);
    let noisea = TAU*noiseoff - 2;
    let segmSizeOffs = -this.startSize/this.rootLen;
    console.log(this.segmentSizeX);
    this.segmentSizeX += segmSizeOffs;
    this.segmentSizeY += segmSizeOffs;
    this.x += cos(noisea)*1.5;
    this.y += sin(noisea)*1.5;


    // if (this.currLen > this.rootLen - this.rootLen/5) {
    //   let numElemsLeft = this.rootLen - this.currLen;
    //   this.segmentSizeY -= this.segmentSizeY/numElemsLeft;
    //   this.y += this.segmentSizeY/numElemsLeft;
    // } else {
    //   this.y += sin(noisea)*1.5;
    //   this.segmentSizeY += segmSizeOffs;
    // }
  }

  updateBranch(cap) {
    let noiseScale = 0.1;
    let noiseoff = noise(this.bx*noiseScale, 
                          this.by*noiseScale, 
                          (this.noiseZ+cap)*noiseScale);
    let noisea = TAU*noiseoff - PI;
    //console.log(noisea)
    let segmSizeOffs = -this.bsgm/50;
    this.bsgm += segmSizeOffs;
    this.bx += cos(noisea);
    this.by += sin(noisea);
  }

  draw() {
     
    for (let i = 0; i < this.rootLen; i++) {
      this.drawSegment();
    }
  }
}

function drawBark(freq, z) {
  for (let y = 0; y < height; y++) {
    let randOffs = map(noise(y*freq),0, 1, 20, 100);
    for (let x = 0; x < width; x++) {
      let myNoise = marble(freq*x, freq*y, freq*z);
      stroke(map(myNoise, 0,1,0,255));
      
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
    marble += ai * noise(fi*x, fi*y, fi*z);
    fi = fi * fm;
    ai = ai * am;
    //console.log(fi);
  }
  marble = sin(alpha*(x + marble));
  return marble;
}