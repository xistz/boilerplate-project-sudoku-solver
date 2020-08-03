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

const combinationsValid = (combinations) => {
  return combinations
    .map((combination) => {
      return combinationValid(combination);
    })
    .every((combinationValid) => {
      return combinationValid;
    });
};

const completedPuzzleValid = (puzzleString) => {
  return /^[1-9]{81}$/.test(puzzleString);
};

const getBoxes = (puzzleString) => {
  const boxes = puzzleString
    .match(/.{27}/g)
    .map((boxRow) => {
      return boxRow.match(/.{3}/g).reduce((result, triplet, index) => {
        const tripletIndex = index % 3;
        result[tripletIndex] = [...result[tripletIndex], ...triplet];

        return result;
      }, Array(3).fill([]));
    })
    .reduce((result, boxRow) => {
      result = [...result, ...boxRow];

      return result;
    }, [])
    .map((box) => {
      return box.map((cell) => {
        const number = parseInt(cell) || '';

        return number;
      });
    });

  return boxes;
};

const getRows = (puzzleString) => {
  const rows = puzzleString
    .match(/.{9}/g)
    .map((rowString) => {
      return rowString.split('');
    })
    .map((row) => {
      return row.map((cell) => {
        const number = parseInt(cell) || '';

        return number;
      });
    });

  return rows;
};

const getColumns = (puzzleString) => {
  const columns = puzzleString.split('').reduce((result, cell, index) => {
    const rowIndex = index % 9;
    const number = parseInt(cell) || '';

    result[rowIndex] = [...result[rowIndex], number];

    return result;
  }, Array(9).fill([]));

  return columns;
};

const SolutionValid = (puzzleString) => {
  if (!completedPuzzleValid(puzzleString)) {
    return false;
  }

  const boxes = getBoxes(puzzleString);
  const rows = getRows(puzzleString);
  const columns = getColumns(puzzleString);

  const boxesValid = combinationsValid(boxes);
  const rowsValid = combinationsValid(rows);
  const columnsValid = combinationsValid(columns);

  return [boxesValid, rowsValid, columnsValid].every((pattern) => pattern);
};

const GetGridObject = (puzzleString) => {
  const errorDiv = document.getElementById('error-msg');
  errorDiv.innerHTML = '';

  if (!puzzleValid(puzzleString)) {
    errorDiv.innerHTML = 'Error: Expected puzzle to be 81 characters long.';

    return {};
  }

  const grid = getRows(puzzleString).reduce((result, row, rowIndex) => {
    const rowLetter = String.fromCharCode(rowIndex + 65);

    row.forEach((cell, columnIndex) => {
      const cellIndex = rowLetter + `${columnIndex + 1}`;

      if (cell) {
        result[cellIndex] = cell;
      }
    });

    return result;
  }, {});

  return grid;
};

const setGrid = (gridObject) => {
  for (const [cellIndex, value] of Object.entries(gridObject)) {
    const cell = document.getElementById(cellIndex);

    cell.value = value;
  }
};

const UpdateGrid = (e) => {
  const { value } = e.target;

  if (!puzzleValid(value)) {
    return;
  }

  const gridObject = GetGridObject(value);
  setGrid(gridObject);
};

const UpdatePuzzleString = (e) => {
  const { value, id } = e.target;

  if (!value || !InputValid(value)) {
    return;
  }

  const puzzleStringIndex = getPuzzleStringIndex(id);

  const puzzle = textArea.value.split('');
  puzzle[puzzleStringIndex] = value;
  textArea.value = puzzle.join('');
};

const getPuzzleStringIndex = (cellIndex) => {
  const [, row, column] = cellIndex.match(/^(?<row>[A-I])(?<column>[1-9])$/);

  const index = (row.charCodeAt(0) - 65) * 9 + parseInt(column) - 1;

  return index;
};

const ClearInput = () => {
  textArea.value = '';

  [...document.getElementsByClassName('sudoku-input')].forEach((cell) => {
    cell.value = '';
  });
};

// event listeners
textArea.addEventListener('input', UpdateGrid);
[...document.getElementsByClassName('sudoku-input')].forEach((cell) => {
  cell.addEventListener('input', UpdatePuzzleString);
});
document.getElementById('clear-button').addEventListener('click', ClearInput);

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  const puzzle =
    '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  textArea.value = puzzle;

  const event = new Event('input');
  textArea.dispatchEvent(event);
});

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    InputValid,
    GetGridObject,
    SolutionValid,
    UpdateGrid,
    UpdatePuzzleString,
    ClearInput,
  };
} catch (e) {}
