import { Parser } from "./parser.js";
import { Tokeniser } from "./tokeniser.js";
import { Evaluator } from "./evaluator.js";
import { displayAST, clearAST } from "./displayAST.js";

// need to map keyboard inputs into relevant internal codes
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
  "^": "^",
  ".": ".",
  "!": "!",
  Enter: "calculate",
  "=": "calculate",
  Escape: "clear",
  c: "clear",
  Backspace: "backspace",
};

// used to convert some symbols to better visual representations
const DISPLAY_SYMBOLS = { "*": "×", "/": "÷" };

// functions to determine whether an internal code is an action or an input
const ACTION_CODES = ["calculate", "clear", "backspace"];
const isAction = (code) => ACTION_CODES.includes(code);
const isInput = (code) => !isAction(code);

// get relevant DOM nodes
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");
const panelCalculator = document.querySelector("#panel-calculator");
const panelAST = document.querySelector("#panel-ast");

// internal storage of what user is typing
let expression = "";

// error on the display
let displayError = null;

// stores whatever user last clicked
let lastCode = null;

// Need to initialise display when app first runs
updateDisplay();

function updateDisplay() {
  if (expression === "") {
    // if display is empty, need to set a default or display the error
    if (displayError) {
      panelDisplay.textContent = displayError;
      displayError = null;
    } else {
      panelDisplay.textContent = "0";
    }
  } else {
    // convert expression to visually improved string and add to DOM node
    panelDisplay.textContent = [...expression]
      .map((char) => DISPLAY_SYMBOLS[char] ?? char)
      .join("");
  }
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
  // handle internal code
  // code sent to different handlers if "input" (i.e. must be added to expression) or "action"
  if (isInput(code)) {
    handleInput(code);
  } else if (isAction(code)) {
    handleAction(code);
  }
  // track last button user clicked
  lastCode = code;
}

function handleInput(input) {
  // check that input is allowed
  if (!inputAllowed(input)) return;

  // modify expression before adding the input, if needed
  modifyExpressionPreInput(input);

  // add input to end of expression
  addToExpression(input);
}

function inputAllowed(input) {
  if (input === ".") {
    // forbid more than one decimal point per typed number
    const idxLastOp = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("-"),
      expression.lastIndexOf("*"),
      expression.lastIndexOf("/"),
      expression.lastIndexOf("^"),
      expression.lastIndexOf("!"),
      -1,
    );
    if (expression.slice(idxLastOp + 1).includes(".")) {
      return false;
    }
  }
  return true;
}

function modifyExpressionPreInput(input) {
  if (lastCode === "calculate" && Tokeniser.isNumerical(input)) {
    // if user has just calculated an answer, typing another number replaces the answer
    // Note that typing an operator does not
    clearExpression();
  }
}

function handleAction(action) {
  // handle different action codes
  if (action === "clear") {
    clearExpression();
    clearAST();
  } else if (action === "backspace") {
    backspaceExpression();
  } else if (action === "calculate") {
    // tokenise the expression
    const tokeniser = new Tokeniser(expression);
    const tokens = tokeniser.tokenise();

    clearExpression();

    // parse the tokens into an AST
    const parser = new Parser(tokens);
    let ast;
    try {
      ast = parser.parse();
    } catch (error) {
      displayError = error.message;
      return;
    }

    // clear the old AST and display the new one
    clearAST();
    displayAST(ast);

    // evaluate the result of the AST
    const evaluator = new Evaluator(ast);
    const result = evaluator.evaluate();

    // clear old expression and add result of calculation to end
    addToExpression(result);
  }
}

panelButtons.addEventListener("click", (event) => {
  // use bubbling to listen for calculator buttons being clicked
  const btn = event.target.closest("button");
  const code = btn.dataset.code;

  // send code to be processed and update display
  if (code !== undefined) processCode(code);
  updateDisplay();
  btn.blur();
});

window.addEventListener("keydown", (event) => {
  // listen for keyboard inputs and send corresponding codes (if they exist) to be processed
  const code = KEY_TO_CODE[event.key];
  if (code !== undefined) {
    event.preventDefault();
    processCode(code);
    updateDisplay();
  }
});

// as panelAST has relative positioning with absolute children it has no native height
// must manually sync AST height with calculator height so it doesn't disappear when div wrapped to next row
function syncASTHeight() {
  panelAST.style.minHeight = `${panelCalculator.offsetHeight}px`;
}
window.addEventListener("resize", syncASTHeight);
syncASTHeight();
