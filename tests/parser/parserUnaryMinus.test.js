import { Parser } from "../../js/parser";

test("Parses unary minus at start of expression", () => {
  const parser = new Parser([
    { type: "operator", value: "-" },
    { type: "number", value: "2" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "-",
    left: { type: "number", value: "2" },
    right: null,
  });
});

test("Parses unary minus in the middle of an expression", () => {
  const parser = new Parser([
    { type: "number", value: "2" },
    { type: "operator", value: "*" },
    { type: "operator", value: "-" },
    { type: "number", value: "6" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "*",
    left: { type: "number", value: "2" },
    right: {
      type: "operator",
      value: "-",
      left: { type: "number", value: "6" },
      right: null,
    },
  });
});

test("Parses unary minus in front of a bracketed expression", () => {
  const parser = new Parser([
    { type: "operator", value: "-" },
    { type: "lBracket", value: "(" },
    { type: "number", value: "2" },
    { type: "operator", value: "*" },
    { type: "number", value: "10" },
    { type: "rBracket", value: ")" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "-",
    left: {
      type: "operator",
      value: "*",
      left: { type: "number", value: "2" },
      right: { type: "number", value: "10" },
    },
    right: null,
  });
});
