// --------- GLOBAL VARIABLES ---------
// need to map keyboard keys to internal representations
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
  Backspace: "backspace",
  ".": ".",
};

// controls BODMAS order - higher number is greater precedence!
const OPERATOR_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};
// Convenient to evaluate OPERATOR_PRECEDENCE so order of operation stored in an array
const SORTED_OPERATORS = Object.entries(OPERATOR_PRECEDENCE)
  .sort(([, a], [, b]) => b - a)
  .map((arr) => arr[0]);

// Need a queue to store arithmetic operations (both numbers and operators)
const queue = [0];

// store errors are last input for convenience
let errorMsg = null;
let lastInput;
class DivZeroError extends Error {}

// SELECT ELEMENTS FROM THE DOM
const panelButtons = document.querySelector("#panel-buttons");
const panelDisplay = document.querySelector("#panel-display");

// --------- MAIN JS SETUP ---------
// listen to button clicks and pass to input handler function
panelButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const repr = button.dataset.repr;
  if (repr === undefined) return;
  handleInput();
});
// also need to monitor keydown events, convert to internal representation and pass to input handler function
window.addEventListener("keydown", (event) => {
  const repr = KEYS_TO_REPR[event.key];
  if (repr === undefined) return;
  handleInput(repr);
});
// show display to start with
updateDisplay();

// --------- SIMPLE UTILITY FUNCTIONS ---------
const isNumericString = (a) => Number.isFinite(Number(a));
const isValidOperator = (operator) => SORTED_OPERATORS.includes(operator);

// --------- BIGGER HELPER FUNCTIONS ---------

function handleInput(input) {
  if (input === "calc") {
    // handle calculation
    computeResult();
  } else if (input === "clear") {
    // handle clearing input e.g. AC
    handleClear();
  } else if (input === "backspace") {
    handleBackspace();
  } else {
    // otherwise input needs to modify the queue
    addToQueue(input);
  }

  // need to track type of input and update display
  lastInput = input;
  updateDisplay();
}

function computeResult() {
  // do not compute if operator is last in queue as invalid
  if (isValidOperator(queue.at(-1))) return;

  try {
    // try and evaluate queue in order using BODMAS
    for (const op of SORTED_OPERATORS) {
      reduceQueue(op);
    }
  } catch (err) {
    // catch zero division error and display
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
  // keep evaluating expressions around operator until all instances of operator disappear
  while (opIdx !== -1) {
    const num1 = queue[opIdx - 1];
    const num2 = queue[opIdx + 1];

    // throw zero division error if appropriate
    if (op === "/" && num2 === 0) throw new DivZeroError("Division by zero");
    queue.splice(opIdx - 1, 3, operate(num1, num2, op));
    opIdx = queue.indexOf(op);
  }
}

function operate(num1, num2, operator) {
  // perform arithmetic operation
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

function handleClear() {
  resetQueue(0);
  clearErrors();
}

function resetQueue(num) {
  // reset queue to [num]
  queue.splice(0, Infinity, num);
}

function clearErrors() {
  errorMsg = null;
}

function handleBackspace() {
  let last = queue.at(-1);

  // if backspacing after a calculation, reset queue to zero so can't modify calculation result
  if (lastInput === "calc") {
    resetQueue(0);
    return;
  }
  if (typeof last !== "string") {
    last = String(last);
  }
  if (isNumericString(last)) {
    // handle when numbers last in queue
    if (last.length === 1) {
      if (queue.length === 1) {
        // if there's only one number in queue and it's single digit, reset queue to zero
        resetQueue(0);
      } else {
        // otherwise remove number from queue
        queue.pop(last);
      }
    } else {
      // if number is multi-digit, take off last digit
      queue.splice(-1, 1, Number(last.slice(0, -1)));
    }

    // if operator, remove from queue
  } else if (isValidOperator(last)) {
    queue.pop(last);
  }
}

function addToQueue(input) {
  // two possible inputs - operators or numbers - pass to relevant function
  if (isValidOperator(input)) {
    addToQueueOperator(input);
  } else if (isNumericString(input)) {
    addToQueueNumber(input);
  }
}

function addToQueueNumber(str) {
  const num = Number(str);
  if (Number.isFinite(queue.at(-1))) {
    // run if last element of queue array is a number
    if (lastInput === "calc") {
      // Need to reset the queue to input if typing another number immediately after a calculation
      resetQueue(num);
    } else {
      // Otherwise need to concatenate new input with existing number at end of queue e.g. "7" -> "76"
      queue.splice(-1, 1, Number(String(queue.at(-1)) + str));
    }
  } else {
    // Otherwise operator is at end of queue - push number to end
    queue.push(num);
  }
  // Can clear errors if number successfully passed into queue
  clearErrors();
}

function addToQueueOperator(op) {
  // Do not process if empty queue or an error
  if (queue.length === 0 || errorMsg) return;
  if (isValidOperator(queue.at(-1))) {
    // If an operator is already at the end of the queue, replace it
    queue.splice(-1, 1, op);
  } else {
    // Otherwise push it (there's a number at end of queue)
    queue.push(op);
  }
}

function updateDisplay() {
  function fmt(num) {
    const dp = 4;
    return (Math.round(num * 10 ** dp) / 10 ** dp)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
  // Convert all elements in queue to formatted string
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
