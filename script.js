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
const queue = [];

// select elements from DOM
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

// utility arrow functions
const isStringNumeric = (a) => Number.isFinite(Number(a));
const isValidOperator = (operator) => SORTED_OPERATORS.includes(operator);

// main
panelButtons.addEventListener("click", (event) => {
  const repr = event.target.dataset.repr;
  updateQueue(repr);
  updateDisplay();
});
window.addEventListener("keydown", (event) => {
  const key = event.key;
  updateQueue(KEYS_TO_REPR[key]);
  updateDisplay();
});

function updateQueue(input) {
  if (input === "calc") {
    computeResult();
  } else if (isValidOperator(input)) {
    handleOperator(input);
  } else if (input === "clear") {
    queue.length = 0;
  } else if (isStringNumeric(input)) {
    handleNumeric(input);
  }
}

function updateDisplay() {
  const formattedQueue = queue.map((elem) => {
    if (Number.isFinite(elem)) {
      // format to 2dp and add commas for large numbers
      elem = Math.round(elem * 100) / 100;
      return elem.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // replace * and / with common symbols for display
      return elem.replace("*", "x").replace("/", "÷");
    }
  });
  panelDisplay.textContent = formattedQueue.join(" ");
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

function computeResult() {
  for (const op of SORTED_OPERATORS) {
    reduceQueue(op);
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

function handleNumeric(val) {
  num = Number(val);
  if (Number.isFinite(queue.at(-1))) {
    queue.splice(-1, 1, Number(String(queue.at(-1)) + val));
  } else {
    queue.push(num);
  }
}

function handleOperator(op) {
  if (queue.length === 0) return;
  if (isValidOperator(queue.at(-1))) {
    queue.splice(-1, 1, op);
  } else {
    queue.push(op);
  }
}
