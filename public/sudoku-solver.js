const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

const InputValid = (input) => {
  return /^[1-9]$/.test(input);
};

const puzzleValid = (puzzleString) => {
  return /^([1-9]|\.){81}$/.test(puzzleString);
};

const combinationValid = (combination) => {
  if (combination.length !== 9) {
    return false;
  }

  const counts = new Array(9).fill(0);

  combination.forEach((cell) => {
    counts[cell - 1] += 1;
  });

  const result = counts.every((count) => count == 1);

  return result;
};

const getBoxes = (puzzleString) => {
  if (!puzzleValid(puzzleString)) {
    return [];
  }
};

const getRows = (puzzleString) => {
  if (!puzzleValid(puzzleString)) {
    return [];
  }
};

const getColumns = (puzzleString) => {
  if (!puzzleValid(puzzleString)) {
    return [];
  }
};

const GetGrid = (puzzleString) => {
  const grid = {};

  if (!puzzleValid(puzzleString)) {
    const errorDiv = document.getElementById('error-msg');
    errorDiv.innerHTML = 'Error: Expected puzzle to be 81 characters long.';

    return grid;
  }

  puzzleString.split('').forEach((char, index) => {
    const number = parseInt(char);

    if (number) {
      const row = Math.floor(index / 9);
      const column = (index % 9) + 1;
      const cell = String.fromCharCode(row + 65) + column;

      grid[cell] = number;
    }
  });

  return grid;
};

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  const puzzle =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  textArea.value = puzzle;
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    InputValid,
    GetGrid,
  };
} catch (e) {}
