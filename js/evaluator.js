export class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  evaluate() {
    return this.evaluateNode(this.ast).value;
  }

  evaluateNode(node) {
    let left = node.left;
    let right = node.right;

    if (left.type !== "number") {
      left = this.evaluateNode(left);
    }
    if (right.type !== "number") {
      right = this.evaluateNode(right);
    }
    const op = node.operator;
    const leftVal = Number(left.value);
    const rightVal = Number(right.value);
    if (op === "+") {
      return Evaluator.createNode("number", leftVal + rightVal);
    } else if (op === "-") {
      return Evaluator.createNode("number", leftVal - rightVal);
    } else if (op === "*") {
      return Evaluator.createNode("number", leftVal * rightVal);
    } else if (op === "/") {
      return Evaluator.createNode("number", leftVal / rightVal);
    }
  }

  static createNode(type, value) {
    return { type, value };
  }
}
