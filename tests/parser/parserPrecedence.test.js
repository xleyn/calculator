import { Parser } from "../../js/parser";

test("Exponents take precedence over addition/subtraction/multiplication/division", () => {
  const parser = new Parser([
    { type: "number", value: "5" },
    { type: "operator", value: "+" },
    { type: "number", value: "6" },
    { type: "operator", value: "-" },
    { type: "number", value: "10" },
    { type: "operator", value: "*" },
    { type: "number", value: "4" },
    { type: "operator", value: "/" },
    { type: "number", value: "7" },
    { type: "operator", value: "^" },
    { type: "number", value: "3" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "-",
    left: {
      type: "operator",
      operator: "+",
      left: { type: "number", value: "5" },
      right: { type: "number", value: "6" },
    },
    right: {
      type: "operator",
      operator: "/",
      left: {
        type: "operator",
        operator: "*",
        left: { type: "number", value: "10" },
        right: { type: "number", value: "4" },
      },
      right: {
        type: "operator",
        operator: "^",
        left: { type: "number", value: "7" },
        right: { type: "number", value: "3" },
      },
    },
  });
});

test("Brackets take precedence over all other operations", () => {
  const parser = new Parser([
    { type: "lBracket", value: "(" },
    { type: "number", value: "3" },
    { type: "operator", value: "+" },
    { type: "number", value: "6" },
    { type: "rBracket", value: ")" },
    { type: "operator", value: "+" },
    { type: "number", value: "4" },
    { type: "operator", value: "-" },
    { type: "number", value: "7" },
    { type: "operator", value: "*" },
    { type: "number", value: "9" },
    { type: "operator", value: "/" },
    { type: "number", value: "10" },
    { type: "operator", value: "^" },
    { type: "number", value: "7" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "-",
    left: {
      type: "operator",
      operator: "+",
      left: {
        type: "operator",
        operator: "+",
        left: { type: "number", value: "3" },
        right: { type: "number", value: "6" },
      },
      right: { type: "number", value: "4" },
    },
    right: {
      type: "operator",
      operator: "/",
      left: {
        type: "operator",
        operator: "*",
        left: { type: "number", value: "7" },
        right: { type: "number", value: "9" },
      },
      right: {
        type: "operator",
        operator: "^",
        left: { type: "number", value: "10" },
        right: { type: "number", value: "7" },
      },
    },
  });
});
