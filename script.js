const VALID_OPERATORS = ["+", "-", "x", "÷"];
const REVERSE_PRIORITY_ORDER = ["-", "+", "x", "÷"];
const queue = [];

const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

const isStringNumeric = (a) => Number.isFinite(Number(a));
const isOperator = (operator) => VALID_OPERATORS.includes(operator);

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

function computeResult() {
  let priorityOperator;
  do {
    priorityOperator = REVERSE_PRIORITY_ORDER.reduce((priority, operator) => {
      return queue.includes(operator) ? operator : priority;
    }, null);
    if (priorityOperator) {
      let operatorIdx = queue.indexOf(priorityOperator);
      while (operatorIdx !== -1) {
        const [num1, _, num2] = queue.slice(operatorIdx - 1, 3);
        queue.splice(operatorIdx - 1, 3, operate(num1, num2, priorityOperator));
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
    queue.push(val);
  } else if (val === "clear") {
    // handle clear
  } else if (isStringNumeric(val)) {
    valNumber = Number(val);

    // If a
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
