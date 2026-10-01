import { Parser } from "./parser.js";
import { Tokeniser } from "./tokeniser.js";
import { Evaluator } from "./evaluator.js";

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
const DISPLAY_SYMBOLS = {
  "*": "×",
  "/": "÷",
};
const ACTION_CODES = ["calculate", "clear", "backspace"];
const isAction = (code) => ACTION_CODES.includes(code);
const isInput = (code) => !isAction(code);

const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

let expression = "";

function updateDisplay() {
  panelDisplay.textContent = [...expression]
    .map((char) => DISPLAY_SYMBOLS[char] ?? char)
    .join("");
}

function addToExpression(input) {
  expression += input;
}

function clearExpression() {
  expression = "";
}

function backspaceExpression() {
  expression = expression.slice(0, -1);
}

function processCode(code) {
  if (isInput(code)) {
    handleInput(code);
  } else if (isAction(code)) {
    handleAction(code);
  }
}

function handleInput(input) {
  addToExpression(input);
}

function handleAction(action) {
  if (action === "clear") {
    clearExpression();
  } else if (action === "backspace") {
    backspaceExpression();
  } else if (action === "calculate") {
    const tokeniser = new Tokeniser(expression);
    const tokens = tokeniser.tokenise();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator(ast);
    const result = evaluator.evaluate();
    clearExpression();
    addToExpression(result);
  }
}

panelButtons.addEventListener("click", (event) => {
  const code = event.target.closest("button").dataset.code;
  if (code !== undefined) processCode(code);
  updateDisplay();
});
window.addEventListener("keydown", (event) => {
  const code = KEY_TO_CODE[event.key];
  if (code !== undefined) processCode(code);
  updateDisplay();
});
