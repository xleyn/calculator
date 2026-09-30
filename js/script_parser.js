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
    const tokeniser = new Tokeniser(panelDisplay.textContent);
    const tokens = tokeniser.tokenise();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator(ast);
    console.log(evaluator.evaluate());
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
