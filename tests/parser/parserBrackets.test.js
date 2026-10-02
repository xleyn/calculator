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
    operator: "*",
    left: { type: "number", value: "6" },
    right: { type: "number", value: "7" },
  });
});
