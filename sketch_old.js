function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  //background(220);
  let z = random(0,100);
  let freq = 0.04;
  //drawBark(freq, z);
  for (let i = 0; i < 10; i++) {
    let root = new Root(width/2+i*10, height/2, i);
    root.draw();
  }
}

class Root {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rootLen = 200;
    this.segmentSize = 10;
  }

  drawSegment() {
    circle(this.x, this.y, this.segmentSize);
    this.update();
  }

  update() {
    let noiseScale = 0.06;
    let noiseoff = noise(this.x*noiseScale, this.y*noiseScale);
    let noisea = TAU*noiseoff;
    let segmSizeOffs = sin(noisea)*0.5;
    this.segmentSize += segmSizeOffs;
    this.x += cos(noisea);
    this.y += sin(noisea);
  }

  draw() {
    for (let i = 0; i < this.rootLen; i++) {
      this.drawSegment();
    }
  }
}

function drawBark(freq, z) {
  for (let y = 0; y < height; y++) {
    let randOffs = map(noise(y*freq),0, 1, 0, 50);
    for (let x = 0; x < width; x++) {
      //console.log("finish");
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