import { Parser } from "../../js/parser";

test("Parses basic exponentiation", () => {
  const parser = new Parser([
    { type: "number", value: "10" },
    { type: "operator", value: "^" },
    { type: "number", value: "2" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "^",
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
    operator: "^",
    left: { type: "number", value: "10" },
    right: {
      type: "operator",
      operator: "^",
      left: { type: "number", value: "2" },
      right: { type: "number", value: "3" },
    },
  });
});
