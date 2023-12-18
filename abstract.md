# Roquentin's tree

## Abstrakt
Výstupem této práce je generativní obraz, který je koncipován jako součást designu přebalu knihy Nevolnost J. P. Sartra. Obraz je inspirován vrcholnou scénou z knihy, ve které se hlavní hrdina Antoine Roquentin, oproštěn od veškerých významů a ztracen v nahodilosti, zadívá do stromu, který mu připadá zcela odtržen od slovního označení, ale zároveň vzbuzuje nevolnost ze všech možných konotací, které nabízí. 

## Abstract
This work aims to create a generative image, which is conceived as a part of a book cover of J. P. Sartre's novel Nausea. The image is inspired by a climax scene from the book, where the main character Antoine Roquentin, increasingly lost in significance, and overcome by randomness, loses his grip on perception of a tree in front of him, which he perceives as thoroughly detached from it's signifier, but at the same time able to take on a completely random connotation. 

## Used technology
p5.js

## Code snippet

This function determines the direction, in which the individual roots grow.
```
update() {
    let noiseScale = 0.1;
    let noiseoff = noise(this.x * noiseScale,
      this.y * noiseScale,
      this.noiseZ * noiseScale);
    this.noisea = TAU * noiseoff - this.angle;
    let segmSizeOffs;
    segmSizeOffs = -this.startSize/this.len;
    this.x += cos(this.noisea);
    this.y += sin(this.noisea);
    this.segmentSizeX += segmSizeOffs;
    this.segmentSizeY += segmSizeOffs;
  }
}
```