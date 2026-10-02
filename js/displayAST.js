const panelAST = document.querySelector("#panel-ast");

function drawNode(textContent, topPercent, leftPercent) {
  const node = document.createElement("div");
  node.textContent = textContent;
  node.style.setProperty("--astDivTop", `${topPercent}%`);
  node.style.setProperty("--astDivLeft", `${leftPercent}%`);
  panelAST.appendChild(node);
}

const testAST = {
  type: "operator",
  operator: "*",
  left: {
    type: "operator",
    operator: "+",
    left: { type: "number", value: "10" },
    right: { type: "number", value: "5" },
  },
  right: {
    type: "operator",
    operator: "-",
    left: { type: "number", value: "4" },
    right: { type: "number", value: "20" },
  },
};
export function displayAST(ast) {
  drawNode(ast.operator, 10, 50);
  drawNode(ast.left.operator, 20, 50 - 50 / 2);
  drawNode(ast.right.operator, 20, 50 + 50 / 2);
  drawNode(ast.left.left.value, 30, 25 - 25 / 2);
  drawNode(ast.left.right.value, 30, 25 + 25 / 2);
  drawNode(ast.right.left.value, 30, 75 - 25 / 2);
  drawNode(ast.right.right.value, 30, 75 + 25 / 2);
}

// recursive positioning func for nodes in nodes?
displayAST(testAST);
