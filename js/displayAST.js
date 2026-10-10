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
  if (node.right) {
    positionAST(node.right, depth + 1);
    node.x = (node.left.x + node.right.x) / 2;
  } else {
    node.x = node.left.x;
  }
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

function drawASTLines(ast) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  attachParentNode(ast, svg);
  panelAST.appendChild(svg);
}

function attachParentNode(node, svg) {
  if (node.left) {
    const lineToLeft = createLineElement(
      node.x,
      node.left.x,
      node.y,
      node.left.y,
    );
    svg.appendChild(lineToLeft);
    attachParentNode(node.left, svg);
  }
  if (node.right) {
    const lineToRight = createLineElement(
      node.x,
      node.right.x,
      node.y,
      node.right.y,
    );
    svg.appendChild(lineToRight);
    attachParentNode(node.right, svg);
  }
}

function createLineElement(x1, x2, y1, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("x2", x2);
  line.setAttribute("y1", y1);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "black");
  return line;
}

export function clearAST() {
  panelAST.replaceChildren();
}

export function displayAST(ast) {
  addLayoutInfo(ast);
  drawAST(ast);
  drawASTLines(ast);
}
