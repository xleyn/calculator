import { Tokeniser } from "../js/tokeniser";

test("Tokenises a number", () => {
  const tokeniser = new Tokeniser("123");
  expect(tokeniser.tokenise()).toEqual([{ type: "number", value: "123" }]);
});
test("Tokenises an operator", () => {
  const tokeniser = new Tokeniser("+");
  expect(tokeniser.tokenise()).toEqual([{ type: "operator", value: "+" }]);
});
test("Tokenises numbers and operators together", () => {
  const tokeniser = new Tokeniser("3+4");
  expect(tokeniser.tokenise()).toEqual([
    { type: "number", value: "3" },
    { type: "operator", value: "+" },
    { type: "number", value: "4" },
  ]);
});
test("Tokenises all operators correctly", () => {
  const tokeniser = new Tokeniser("1+2-3*4/5^6");
  expect(tokeniser.tokenise()).toEqual([
    { type: "number", value: "1" },
    { type: "operator", value: "+" },
    { type: "number", value: "2" },
    { type: "operator", value: "-" },
    { type: "number", value: "3" },
    { type: "operator", value: "*" },
    { type: "number", value: "4" },
    { type: "operator", value: "/" },
    { type: "number", value: "5" },
    { type: "operator", value: "^" },
    { type: "number", value: "6" },
  ]);
});
test("Tokenises decimals correctly", () => {
  const tokeniser = new Tokeniser("1.23+4.56");
  expect(tokeniser.tokenise()).toEqual([
    { type: "number", value: "1.23" },
    { type: "operator", value: "+" },
    { type: "number", value: "4.56" },
  ]);
});
test("Tokenises brackets correctly", () => {
  const tokeniser = new Tokeniser("(1+2)");
  expect(tokeniser.tokenise()).toEqual([
    { type: "lBracket", value: "(" },
    { type: "number", value: "1" },
    { type: "operator", value: "+" },
    { type: "number", value: "2" },
    { type: "rBracket", value: ")" },
  ]);
});
