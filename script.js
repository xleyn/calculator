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
let lastInput;

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
    clearQueue();
  } else {
    modifyQueue(input);
  }
  lastInput = input;
  updateDisplay();
}

function computeResult() {
  // do not compute if operator is last in queue
  if (isValidOperator(queue.at(-1))) return;

  for (const op of SORTED_OPERATORS) {
    reduceQueue(op);
  }
}

function reduceQueue(op) {
  let opIdx = queue.indexOf(op);
  while (opIdx !== -1) {
    const num1 = queue[opIdx - 1];
    const num2 = queue[opIdx + 1];
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

function clearQueue() {
  queue.length = 0;
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
      clearQueue();
      queue.push(num);
    } else {
      queue.splice(-1, 1, Number(String(queue.at(-1)) + str));
    }
  } else {
    queue.push(num);
  }
}

function modifyQueueOperator(op) {
  if (queue.length === 0) return;
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
  panelDisplay.textContent = formattedQueue.join(" ");
  console.log(queue, lastInput);
}
