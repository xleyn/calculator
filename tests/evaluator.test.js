import { Evaluator } from "../js/evaluator";

test("Evaluates a 3-node addition AST", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "+",
    left: { type: "number", value: "3" },
    right: { type: "number", value: "9" },
  });
  expect(evaluator.evaluate()).toEqual("12");
});

test("Evaluates a 3-node subtraction AST", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "-",
    left: { type: "number", value: "5" },
    right: { type: "number", value: "3" },
  });
  expect(evaluator.evaluate()).toEqual("2");
});

test("Evaluates a 3-node multiplication AST", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "*",
    left: { type: "number", value: "2" },
    right: { type: "number", value: "12" },
  });
  expect(evaluator.evaluate()).toEqual("24");
});

test("Evaluates a 3-node division AST", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "/",
    left: { type: "number", value: "21" },
    right: { type: "number", value: "3" },
  });
  expect(evaluator.evaluate()).toEqual("7");
});

test("Evaluates a 3-node exponentiation AST", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "^",
    left: { type: "number", value: "15" },
    right: { type: "number", value: "2" },
  });
  expect(evaluator.evaluate()).toEqual("225");
});

test("Evaluates complex AST with operation nesting", () => {
  const evaluator = new Evaluator({
    type: "operator",
    operator: "/",
    left: {
      type: "operator",
      operator: "*",
      left: {
        type: "operator",
        operator: "^",
        left: {
          type: "operator",
          operator: "+",
          left: { type: "number", value: "3" },
          right: { type: "number", value: "6" },
        },
        right: { type: "number", value: "2" },
      },
      right: {
        type: "operator",
        operator: "-",
        left: { type: "number", value: "10" },
        right: { type: "number", value: "9" },
      },
    },
    right: { type: "number", value: "4" },
  });
  expect(evaluator.evaluate()).toEqual("20.25");
});
