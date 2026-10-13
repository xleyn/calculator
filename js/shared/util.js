// convert some symbols to better visual representations
const DISPLAY_SYMBOLS = { "*": "×", "/": "÷" };
export const toDisplayChar = (char) => DISPLAY_SYMBOLS[char] ?? char;
