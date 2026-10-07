import { Parser } from "../../js/parser";

test("Parses implicit bracket multiplication correctly", () => {
  const parser = new Parser([
    { type: "number", value: "6" },
    { type: "lBracket", value: "(" },
    { type: "number", value: "7" },
    { type: "rBracket", value: ")" },
    { type: "number", value: "9" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "*",
    left: { type: "number", value: "6" },
    right: { type: "number", value: "7" },
  });
});

test("Brackets take precedence over other operators", () => {
  const parser = new Parser([
    { type: "lBracket", value: "(" },
    { type: "number", value: "8" },
    { type: "operator", value: "+" },
    { type: "number", value: "6" },
    { type: "rBracket", value: ")" },
    { type: "operator", value: "*" },
    { type: "number", value: "9" },
    { type: "operator", value: "/" },
    { type: "number", value: "6" },
    { type: "operator", value: "-" },
    { type: "number", value: "4" },
    { type: "operator", value: "^" },
    { type: "number", value: "7" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "-",
    left: {
      type: "operator",
      value: "/",
      left: {
        type: "operator",
        value: "*",
        left: {
          type: "operator",
          value: "+",
          left: { type: "number", value: "8" },
          right: { type: "number", value: "6" },
        },
        right: { type: "number", value: "9" },
      },
      right: { type: "number", value: "6" },
    },
    right: {
      type: "operator",
      value: "^",
      left: { type: "number", value: "4" },
      right: { type: "number", value: "7" },
    },
  });
});
