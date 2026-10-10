export class Tokeniser {
  static OPERATORS = ["+", "-", "/", "*", "^", "!"];

  constructor(inputString) {
    this.queue = inputString.split("").reverse();
    this.tokens = [];
    this.memory = [];
    this.memoryType = null;
  }

  tokenise() {
    while (this.queue.length > 0) {
      const [char, type] = this.popQueue();
      if (
        this.memory.length === 0 ||
        (type !== "operator" && type === this.memoryType)
      ) {
        this.addToMemory(char, type);
      } else {
        this.storeMemoryAsToken();
        this.resetMemory();
        this.addToMemory(char, type);
      }
    }
    this.storeMemoryAsToken();
    return this.tokens;
  }

  popQueue() {
    const char = this.queue.pop();
    return [char, Tokeniser.getType(char)];
  }

  resetMemory() {
    this.memory.length = 0;
    this.memoryType = null;
  }

  addToMemory(char, type) {
    this.memory.push(char);
    this.memoryType = type;
  }

  storeMemoryAsToken() {
    this.addToken(this.memoryType, this.memory.join(""));
  }
  addToken(type, value) {
    this.tokens.push({ type, value });
  }

  static getType(char) {
    if (Tokeniser.isNumerical(char)) {
      return "number";
    } else if (Tokeniser.isOperator(char)) {
      return "operator";
    } else if (char === "(") return "lBracket";
    else if (char === ")") return "rBracket";
  }

  static isNumerical(char) {
    return (char >= "0" && char <= "9") || char === ".";
  }

  static isOperator(char) {
    return this.OPERATORS.includes(char);
  }
}
