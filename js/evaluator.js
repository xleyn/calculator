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
    const op = node.value;

    if (left.type !== "number") {
      left = this.evaluateNode(left);
    }

    // Right may be null because of unary operators
    if (right && right.type !== "number") {
      right = this.evaluateNode(right);
    }

    const leftVal = Number(left.value);
    const rightVal = right ? Number(right.value) : null;

    if (op === "+") {
      return Evaluator.createNode("number", String(leftVal + rightVal));
    } else if (op === "-") {
      if (rightVal) {
        return Evaluator.createNode("number", String(leftVal - rightVal));
      } else {
        // Unary minus
        return Evaluator.createNode("number", String(-1 * leftVal));
      }
    } else if (op === "*") {
      return Evaluator.createNode("number", String(leftVal * rightVal));
    } else if (op === "/") {
      return Evaluator.createNode("number", String(leftVal / rightVal));
    } else if (op === "^") {
      return Evaluator.createNode("number", String(leftVal ** rightVal));
    } else if (op === "!") {
      let total = 1;
      for (let i = leftVal; i > 1; i--) {
        total *= i;
      }
      return Evaluator.createNode("number", String(total));
    }
  }

  static createNode(type, value) {
    return { type, value };
  }
}
