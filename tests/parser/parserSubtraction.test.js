import { Parser } from "../../js/parser";

test("Parses basic subtraction", () => {
  const parser = new Parser([
    { type: "number", value: "2" },
    { type: "operator", value: "-" },
    { type: "number", value: "1" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "-",
    left: { type: "number", value: "2" },
    right: { type: "number", value: "1" },
  });
});

test("Parses chained subtraction", () => {
  const parser = new Parser([
    { type: "number", value: "4" },
    { type: "operator", value: "-" },
    { type: "number", value: "3" },
    { type: "operator", value: "-" },
    { type: "number", value: "2" },
    { type: "operator", value: "-" },
    { type: "number", value: "1" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "-",
    left: {
      type: "operator",
      operator: "-",
      left: {
        type: "operator",
        operator: "-",
        left: { type: "number", value: "4" },
        right: { type: "number", value: "3" },
      },
      right: { type: "number", value: "2" },
    },
    right: { type: "number", value: "1" },
  });
});
