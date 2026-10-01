export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  current() {
    return this.tokens[this.position];
  }

  consume() {
    return this.tokens[this.position++];
  }

  parse() {
    return this.parseAddSub();
  }

  parseAddSub() {
    let res = this.parseMulDiv();

    while (
      this.current() &&
      (this.current().value === "+" || this.current().value === "-")
    ) {
      const op = this.consume().value;
      const right = this.parseMulDiv();
      res = Parser.createASTNode(op, res, right);
    }

    return res;
  }

  parseMulDiv() {
    let res = this.parseExponents();

    while (
      this.current() &&
      (this.current().value === "*" || this.current().value === "/")
    ) {
      const op = this.consume().value;
      const right = this.parseExponents();
      res = Parser.createASTNode(op, res, right);
    }

    return res;
  }

  parseExponents() {
    let res = this.parsePrimary();

    if (!this.current() || this.current().value !== "^") return res;

    this.consume();
    const right = this.parseExponents();

    return Parser.createASTNode("^", res, right);
  }

  parsePrimary() {
    if (!this.current()) return;
    const currentType = this.current().type;
    if (currentType === "number") {
      return this.consume();
    } else if (currentType === "lBracket") {
      this.consume();
      const res = this.parseAddSub();
      if (this.current().type !== "rBracket")
        throw Error("Right bracket is missing!");
      this.consume();
      return res;
    }
  }

  static createASTNode(operator, left, right) {
    return { type: "operator", operator: operator, left, right };
  }
}
