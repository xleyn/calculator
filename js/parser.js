export class Parser {
  static NEGATIVE = { type: "number", value: "-1" };

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
    if (this.tokens.at(-1).type !== "number") {
      throw new Error("Syntax Error!");
    }
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
      (this.current().value === "*" ||
        this.current().value === "/" ||
        this.current().type === "lBracket")
    ) {
      const op =
        this.current().type === "lBracket" ? "*" : this.consume().value;
      const right = this.parseExponents();
      res = Parser.createASTNode(op, res, right);
    }

    return res;
  }

  parseExponents() {
    let res = this.parseFactorial();

    if (!this.current() || this.current().value !== "^") return res;

    this.consume();
    const right = this.parseExponents();

    return Parser.createASTNode("^", res, right);
  }

  parseFactorial() {
    let res = this.parseUnary();

    while (this.current() && this.current().value === "!") {
      this.consume();
      res = Parser.createASTNode("!", res, null);
    }

    return res;
  }

  parseUnary() {
    if (this.current() && this.current().value === "-") {
      this.consume();
      const left = this.parseExponents();

      return Parser.createASTNode("-", left, null);
    }

    return this.parsePrimary();
  }

  parsePrimary() {
    if (!this.current()) {
      return;
    }
    const currentType = this.current().type;
    if (currentType === "number") {
      return this.consume();
    } else if (currentType === "lBracket") {
      this.consume();
      const res = this.parseAddSub();
      if (this.current().type !== "rBracket") {
        throw Error("Right bracket is missing!");
      }
      this.consume();
      return res;
    }
    if (currentType === "operator") {
      throw new Error("Syntax Error!");
    }
  }

  static createASTNode(operator, left, right) {
    return { type: "operator", value: operator, left, right };
  }
}
