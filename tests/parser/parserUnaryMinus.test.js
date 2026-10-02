import { Parser } from "../../js/parser";

test("Parses unary minus correctly", () => {
  const parser = new Parser([
    { type: "operator", value: "-" },
    { type: "number", value: "2" },
    { type: "operator", value: "*" },
    { type: "operator", value: "-" },
    { type: "number", value: "6" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "*",
    left: {
      type: "operator",
      operator: "*",
      left: { type: "number", value: "-1" },
      right: { type: "number", value: "2" },
    },
    right: {
      type: "operator",
      operator: "*",
      left: { type: "number", value: "-1" },
      right: { type: "number", value: "6" },
    },
  });
});
