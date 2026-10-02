import { Parser } from "../../js/parser";

test("Parses basic multiplication", () => {
  const parser = new Parser([
    { type: "number", value: "2" },
    { type: "operator", value: "*" },
    { type: "number", value: "3" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "*",
    left: { type: "number", value: "2" },
    right: { type: "number", value: "3" },
  });
});

test("Parses chained multiplication", () => {
  const parser = new Parser([
    { type: "number", value: "2" },
    { type: "operator", value: "*" },
    { type: "number", value: "3" },
    { type: "operator", value: "*" },
    { type: "number", value: "4" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "*",
    left: {
      type: "operator",
      operator: "*",
      left: { type: "number", value: "2" },
      right: { type: "number", value: "3" },
    },
    right: { type: "number", value: "4" },
  });
});

test("Multiplication has precedence over addition/subtraction", () => {
  const parser = new Parser([
    [
      { type: "number", value: "2" },
      { type: "operator", value: "*" },
      { type: "number", value: "3" },
      { type: "operator", value: "+" },
      { type: "number", value: "4" },
      { type: "operator", value: "-" },
      { type: "number", value: "5" },
    ],
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "-",
    left: {
      type: "operator",
      operator: "+",
      left: {
        type: "operator",
        operator: "*",
        left: { type: "number", value: "2" },
        right: { type: "number", value: "3" },
      },
      right: { type: "number", value: "4" },
    },
    right: { type: "number", value: "5" },
  });
});
