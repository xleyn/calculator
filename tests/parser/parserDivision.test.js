import { Parser } from "../../js/parser";

test("Parses basic division", () => {
  const parser = new Parser([
    { type: "number", value: "10" },
    { type: "operator", value: "/" },
    { type: "number", value: "5" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "/",
    left: { type: "number", value: "10" },
    right: { type: "number", value: "5" },
  });
});

test("Parses chained division", () => {
  const parser = new Parser([
    { type: "number", value: "10" },
    { type: "operator", value: "/" },
    { type: "number", value: "5" },
    { type: "operator", value: "/" },
    { type: "number", value: "2" },
  ]);
  expect(parser.parse()).toEqual({
    type: "operator",
    operator: "/",
    left: {
      type: "operator",
      operator: "/",
      left: { type: "number", value: "10" },
      right: { type: "number", value: "5" },
    },
    right: { type: "number", value: "2" },
  });
});
