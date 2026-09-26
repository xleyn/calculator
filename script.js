// global constants
const KEYS_TO_REPR = {
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
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  Enter: "calc",
  "=": "calc",
  Escape: "clear",
  c: "clear",
};

const OPERATOR_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};
const SORTED_OPERATORS = Object.entries(OPERATOR_PRECEDENCE)
  .sort(([, a], [, b]) => b - a)
  .map((arr) => arr[0]);
const queue = [0];
let errorMsg = null;
let lastInput;
class DivZeroError extends Error {}

// select elements from DOM
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

// utility arrow functions
const isStringNumeric = (a) => Number.isFinite(Number(a));
const isValidOperator = (operator) => SORTED_OPERATORS.includes(operator);

// main setup
panelButtons.addEventListener("click", (event) => {
  const repr = event.target.dataset.repr;
  handleInput(repr);
});
window.addEventListener("keydown", (event) => {
  const repr = KEYS_TO_REPR[event.key];
  if (repr === undefined) return;
  handleInput(repr);
});
updateDisplay();

// helper functions

function handleInput(input) {
  if (input === "calc") {
    computeResult();
  } else if (input === "clear") {
    resetQueue(0);
    clearErrors();
  } else {
    modifyQueue(input);
  }
  lastInput = input;
  updateDisplay();
}

function computeResult() {
  // do not compute if operator is last in queue
  if (isValidOperator(queue.at(-1))) return;

  try {
    for (const op of SORTED_OPERATORS) {
      reduceQueue(op);
    }
  } catch (err) {
    if (err instanceof DivZeroError) {
      resetQueue(0);
      errorMsg = "Cannot divide by zero!";
    } else {
      throw err;
    }
  }
}

function reduceQueue(op) {
  let opIdx = queue.indexOf(op);
  while (opIdx !== -1) {
    const num1 = queue[opIdx - 1];
    const num2 = queue[opIdx + 1];

    if (op === "/" && num2 === 0) throw new DivZeroError("Division by zero");
    queue.splice(opIdx - 1, 3, operate(num1, num2, op));
    opIdx = queue.indexOf(op);
  }
}

function operate(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
  }
}

function resetQueue(num) {
  queue.splice(0, Infinity, num);
}

function clearErrors() {
  errorMsg = null;
}

function modifyQueue(input) {
  if (isValidOperator(input)) {
    modifyQueueOperator(input);
  } else if (isStringNumeric(input)) {
    modifyQueueNumber(input);
  }
}

function modifyQueueNumber(str) {
  const num = Number(str);
  if (Number.isFinite(queue.at(-1))) {
    if (lastInput === "calc") {
      resetQueue(num);
    } else {
      queue.splice(-1, 1, Number(String(queue.at(-1)) + str));
    }
  } else {
    queue.push(num);
  }
  // Need to clear errors if number successfully passed into queue
  clearErrors();
}

function modifyQueueOperator(op) {
  if (queue.length === 0 || errorMsg) return;
  if (isValidOperator(queue.at(-1))) {
    queue.splice(-1, 1, op);
  } else {
    queue.push(op);
  }
}

function updateDisplay() {
  function fmt(num) {
    return (Math.round(num * 100) / 100)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
  const formattedQueue = queue.map((elem) => {
    if (Number.isFinite(elem)) {
      return fmt(elem);
    } else {
      // replace * and / with common symbols for display
      return elem.replace("*", "x").replace("/", "÷");
    }
  });

  // show either queue or error message if present
  panelDisplay.textContent = errorMsg ? errorMsg : formattedQueue.join(" ");
}
