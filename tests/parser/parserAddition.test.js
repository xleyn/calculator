import { Parser } from "../../js/parser";

test("Parses basic addition", () => {
  const parser = new Parser([
    { type: "number", value: "1" },
    { type: "operator", value: "+" },
    { type: "number", value: "2" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "+",
    left: { type: "number", value: "1" },
    right: { type: "number", value: "2" },
  });
});

test("Parses chained addition", () => {
  const parser = new Parser([
    { type: "number", value: "1" },
    { type: "operator", value: "+" },
    { type: "number", value: "2" },
    { type: "operator", value: "+" },
    { type: "number", value: "3" },
    { type: "operator", value: "+" },
    { type: "number", value: "4" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    value: "+",
    left: {
      type: "operator",
      value: "+",
      left: {
        type: "operator",
        value: "+",
        left: { type: "number", value: "1" },
        right: { type: "number", value: "2" },
      },
      right: { type: "number", value: "3" },
    },
    right: { type: "number", value: "4" },
  });
});
