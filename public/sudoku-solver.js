const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

const updateGrid = (puzzle) => {
  [...puzzle].forEach((char, index) => {
    const number = parseInt(char);

    if (number) {
      setCell(number, index);
    }
  });
};

const InputValid = (input) => {
  return /^[1-9]$/.test(input);
};

const PuzzleValid = (puzzleString) => {
  return /^([1-9]|\.){81}$/.test(puzzleString);
};

const setCell = (number, index) => {
  const row = Math.floor(index / 9);
  const column = (index % 9) + 1;
  const cell = String.fromCharCode(row + 65) + column;

  const td = document.getElementById(cell);
  td.value = number;
};

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  const puzzle =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  textArea.value = puzzle;
  updateGrid(puzzle);
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    PuzzleValid,
    InputValid,
  };
} catch (e) {}
