const panelAST = document.querySelector("#panel-ast");

let maxDepth;
let leafCount;
let nodeX;
const marginX = 10;
const marginY = 10;
const spacePerRow = 20; //%

function addLayoutInfo(ast) {
  maxDepth = 0;
  leafCount = 0;
  nodeX = 0;
  positionAST(ast);
  convertLayoutCoords(ast);
}

function positionAST(node, depth = 0) {
  node.y = depth;
  maxDepth = Math.max(maxDepth, depth);

  // if leaf
  if (!node.left && !node.right) {
    node.x = nodeX++;
    leafCount++;
    return;
  }

  positionAST(node.left, depth + 1);
  positionAST(node.right, depth + 1);

  node.x = (node.left.x + node.right.x) / 2;
}

function convertLayoutCoords(ast) {
  const availableWidth = 100 - marginX * 2;
  const xStep = availableWidth / (leafCount - 1);

  ast.x = `${ast.x * xStep + marginX}%`;
  ast.y = `${marginY + ast.y * spacePerRow}%`;

  if (ast.left) {
    convertLayoutCoords(ast.left);
  }
  if (ast.right) {
    convertLayoutCoords(ast.right);
  }
}

function drawAST(ast) {
  drawNode(ast);

  if (ast.left) {
    drawAST(ast.left);
  }
  if (ast.right) {
    drawAST(ast.right);
  }
}

function drawNode(node) {
  const div = document.createElement("div");
  div.textContent = node.value;
  div.style.setProperty("--astDivTop", node.y);
  div.style.setProperty("--astDivLeft", node.x);
  panelAST.appendChild(div);
}

export function clearAST() {
  panelAST.replaceChildren();
}

export function displayAST(ast) {
  addLayoutInfo(ast);
  drawAST(ast);
}
