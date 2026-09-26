// global constants
const VALID_OPERATORS = ["+", "-", "x", "÷"];
const REVERSE_PRIORITY_ORDER = ["-", "+", "x", "÷"];
const queue = [];

// select elements from DOM
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

// utility arrow functions
const isStringNumeric = (a) => Number.isFinite(Number(a));
const isOperator = (operator) => VALID_OPERATORS.includes(operator);

function operate(num1, num2, operator) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "x":
      return num1 * num2;
    case "÷":
      return num1 / num2;
  }
}

function computeResult() {
  let priorityOperator;
  do {
    priorityOperator = REVERSE_PRIORITY_ORDER.reduce((priority, operator) => {
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

function updateDisplay() {
  panelDisplay.textContent = queue.join(" ");
}

function updateQueue(val) {
  if (val === "=") {
    computeResult();
  } else if (isOperator(val)) {
    if (isOperator(queue.at(-1))) {
      queue.splice(-1, 1, val);
    } else {
      queue.push(val);
    }
  } else if (val === "ac") {
    queue.length = 0;
  } else if (isStringNumeric(val)) {
    valNumber = Number(val);
    if (Number.isFinite(queue.at(-1))) {
      queue.splice(-1, 1, Number(String(queue.at(-1)) + val));
    } else {
      queue.push(valNumber);
    }
  }
}

panelButtons.addEventListener("click", (event) => {
  const val = event.target.dataset.val;
  updateQueue(val);
  updateDisplay();
});
