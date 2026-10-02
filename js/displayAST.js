const panelAST = document.querySelector("#panel-ast");

function drawNode(textContent, positionX, positionY) {
  const node = document.createElement("div");
  node.textContent = textContent;
  panelAST.appendChild(node);
}

const testAST = {
  type: "operator",
  operator: "/",
  left: { type: "number", value: "10" },
  right: { type: "number", value: "5" },
};
export function displayAST(ast) {
  drawNode(ast.operator);
  drawNode(ast.left.value);
  drawNode(ast.right.value);
}

displayAST(testAST);
