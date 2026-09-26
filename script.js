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

const REVERSE_BODMAS = ["-", "+", "*", "/"];
const queue = [];

// select elements from DOM
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

// utility arrow functions
const isStringNumeric = (a) => Number.isFinite(Number(a));
const isOperator = (operator) => REVERSE_BODMAS.includes(operator);

// main
panelButtons.addEventListener("click", (event) => {
  const repr = event.target.dataset.repr;
  updateQueue(repr);
  updateDisplay();
});

function updateQueue(input) {
  if (input === "calc") {
    computeResult();
  } else if (isOperator(input)) {
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

function computeResult() {
  let priorityOperator;
  do {
    priorityOperator = REVERSE_BODMAS.reduce((priority, operator) => {
      return queue.includes(operator) ? operator : priority;
    }, null);
    if (priorityOperator) {
      let operatorIdx = queue.indexOf(priorityOperator);
      while (operatorIdx !== -1) {
        const [startIdx, endIdx] = [operatorIdx - 1, operatorIdx + 2];
        const [num1, _, num2] = queue.slice(startIdx, endIdx);
        queue.splice(startIdx, 3, operate(num1, num2, priorityOperator));
        operatorIdx = queue.indexOf(priorityOperator);
      }
    }
  } while (priorityOperator);
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
  if (isOperator(queue.at(-1))) {
    queue.splice(-1, 1, op);
  } else {
    queue.push(op);
  }
}
