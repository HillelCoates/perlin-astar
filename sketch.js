let camera;
let noiseScale = 0.12;
let gridSize = 10;
let totalSize = 500;
let heights;
let walkableMap;
let maxHeight = 100;
let maxArray;
let startPos = [2, 2];
let endPos = [8, 8];
let path = [...Array(gridSize)].map(e => Array(gridSize).fill(0));
let enableDiagonal = false;
let showPath = false;


function setup() {
  let canvas = createCanvas(600, 600, WEBGL);
  canvas.parent('canvasContainer');
  camera = createCamera();

  camera.move(0, 0.4 * height, 0.5*maxHeight);
  camera.tilt(-PI / 8);

  regeneratePerlinNoiseArray();
}

function draw() {
  background(255);

  translate(-totalSize / 2 + (totalSize / (2 *  gridSize)), -totalSize / 2 + (totalSize / (2 * gridSize)), 0);
  ambientLight(120);
  pointLight(255, 255, 255, mouseX - width / 2, mouseY - height / 2, 300);
  noStroke();

  noiseDetail(4, 0.5);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      push();
      translate((totalSize / gridSize) * x, (totalSize / gridSize) * y, (heights[x][y] * maxHeight) / 2.0);
      fill(getColor(x, y));
      box(totalSize / gridSize, totalSize / gridSize, heights[x][y] * maxHeight);
      pop();
    }
  }
}

function setGridSize(size) {
  gridSize = size;

  if (size > heights.length) {
    regeneratePerlinNoiseArray();
  }
  calculatePath(heights);
}

function regeneratePerlinNoiseArray() {
  heights = [];
  noiseSeed(millis());
  for (let x = 0; x < gridSize; x++) {
    heights[x] = [];
    for (let y = 0; y < gridSize; y++) {
      heights[x][y] = (noise(x * noiseScale, y * noiseScale)
        + 0.5 * noise(2 * x * noiseScale, 2 * y * noiseScale)
        + 0.25 * noise(4 * x * noiseScale, 4 * y * noiseScale)) / 1.75;
    }
  }

  calculatePath(heights);
}

function calculatePath(heights) {
  var graph = new Graph(heights, { diagonal: enableDiagonal });
  var result = astar.search(graph, graph.grid[startPos[0]][startPos[1]], graph.grid[endPos[0]][endPos[1]]);
  path = [...Array(heights.length)].map(e => Array(heights[0].length).fill(0));

  result.forEach(element => {
    path[element.x][element.y] = 1;
  });
}

function setRandomTargets() {
  startPos = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
  do {
    endPos = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
  } while (startPos[0] == endPos[0] && startPos[1] == endPos[1]);
  calculatePath(heights);
}

function getColor(x, y) {
  var currentHeight = heights[parseInt(x)][parseInt(y)];

  if (startPos[0] == x && startPos[1] == y) return color(255, 0, 0);
  else if (endPos[0] == x && endPos[1] == y) return color(0, 255, 0);
  else if (showPath && path[x][y] == 1) return color(255);
  else return lerpColor(color(0), color(255), currentHeight ** 2);
}
