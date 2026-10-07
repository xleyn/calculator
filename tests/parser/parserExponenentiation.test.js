import { Parser } from "../../js/parser";

test("Parses basic exponentiation", () => {
  const parser = new Parser([
    { type: "number", value: "10" },
    { type: "operator", value: "^" },
    { type: "number", value: "2" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "^",
    left: { type: "number", value: "10" },
    right: { type: "number", value: "2" },
  });
});

test("Parses chained exponentiation from right to left", () => {
  const parser = new Parser([
    { type: "number", value: "10" },
    { type: "operator", value: "^" },
    { type: "number", value: "2" },
    { type: "operator", value: "^" },
    { type: "number", value: "3" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "^",
    left: { type: "number", value: "10" },
    right: {
      type: "operator",
      value: "^",
      left: { type: "number", value: "2" },
      right: { type: "number", value: "3" },
    },
  });
});

test("Exponentiation has precedence over addition/subtraction and multiplication/division", () => {
  const parser = new Parser([
    { type: "number", value: "3" },
    { type: "operator", value: "+" },
    { type: "number", value: "4" },
    { type: "operator", value: "-" },
    { type: "number", value: "5" },
    { type: "operator", value: "*" },
    { type: "number", value: "6" },
    { type: "operator", value: "/" },
    { type: "number", value: "7" },
    { type: "operator", value: "^" },
    { type: "number", value: "8" },
    ,
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "-",
    left: {
      type: "operator",
      value: "+",
      left: { type: "number", value: "3" },
      right: { type: "number", value: "4" },
    },
    right: {
      type: "operator",
      value: "/",
      left: {
        type: "operator",
        value: "*",
        left: { type: "number", value: "5" },
        right: { type: "number", value: "6" },
      },
      right: {
        type: "operator",
        value: "^",
        left: { type: "number", value: "7" },
        right: { type: "number", value: "8" },
      },
    },
  });
});
