class Tokenizer {
  static OPERATORS = ["+", "-", "/", "*"];

  constructor(inputString) {
    this.queue = inputString.split("").reverse();
    this.tokens = [];
    this.memory = [];
    this.memoryType = null;
  }

  tokenize() {
    while (this.queue.length > 0) {
      const [char, type] = this.popQueue();
      if (this.memory.length === 0 || type === this.memoryType) {
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
    return [char, Tokenizer.getType(char)];
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
    if (Tokenizer.isNumerical(char)) {
      return "number";
    } else if (Tokenizer.isOperator(char)) {
      return "operator";
    } else if (char === "(") return "lBracket";
    else if (char === ")") return "rBracket";
  }

  static isNumerical(char) {
    return char >= "0" && char <= "9";
  }

  static isOperator(char) {
    return this.OPERATORS.includes(char);
  }
}

class Parser {
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
    let res = this.parsePrimary();

    while (
      this.current() &&
      (this.current().value === "*" || this.current().value === "/")
    ) {
      const op = this.consume().value;
      const right = this.parsePrimary();
      res = Parser.createASTNode(op, res, right);
    }

    return res;
  }

  parsePrimary() {
    if (this.current() && this.current().type === "number") {
      return this.consume();
    }
  }

  static createASTNode(operator, left, right) {
    return { operator: operator, left, right };
  }
}

const KEY_TO_CODE = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  "(": "(",
  ")": ")",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  Enter: "calculate",
  "=": "calculate",
  Escape: "clear",
  c: "clear",
  Backspace: "backspace",
};

const ACTION_CODES = ["calculate", "clear", "backspace"];
const isAction = (code) => ACTION_CODES.includes(code);
const isInput = (code) => !isAction(code);

const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

function addToDisplay(input) {
  panelDisplay.textContent += input;
}

function clearDisplay() {
  panelDisplay.textContent = "";
}

function backspaceDisplay() {
  panelDisplay.textContent = panelDisplay.textContent.slice(0, -1);
}

function processCode(code) {
  if (isInput(code)) {
    addToDisplay(code);
  } else if (isAction(code)) {
    handleAction(code);
  }
}

function handleAction(action) {
  if (action === "clear") {
    clearDisplay();
  } else if (action === "backspace") {
    backspaceDisplay();
  } else if (action === "calculate") {
    const tokenizer = new Tokenizer(panelDisplay.textContent);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log(ast);
  }
}

panelButtons.addEventListener("click", (event) => {
  const code = event.target.closest("button").dataset.code;
  if (code !== undefined) processCode(code);
});
window.addEventListener("keydown", (event) => {
  const code = KEY_TO_CODE[event.key];
  if (code !== undefined) processCode(code);
});
