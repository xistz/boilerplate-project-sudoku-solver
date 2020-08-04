const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

// sudoku table
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

const cells = ROWS.reduce((result, row) => {
  const rowCells = COLUMNS.map((column) => `${row}${column}`);
  result = [...result, ...rowCells];

  return result;
}, []);
const cellsByRow = ROWS.map((row) => {
  return COLUMNS.map((column) => `${row}${column}`);
});
const cellsByColumn = COLUMNS.map((column) => {
  return ROWS.map((row) => `${row}${column}`);
});
const cellsByBox = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['G', 'H', 'I'],
]
  .map((rows) => {
    // each triplet (eg. [A, B, C])
    return [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ].map((columns) => {
      // each triplet (eg. [1, 2, 3])
      return rows
        .map((row) => {
          return columns.map((column) => `${row}${column}`); // [A1, A2, A3]
        })
        .reduce((result, box) => [...result, ...box], []);
    });
  })
  .reduce((result, row) => [...result, ...row], []);

const InputValid = (input) => {
  return /^[1-9]$/.test(input);
};

const puzzleValid = (puzzleString) => {
  return /^([1-9]|\.){81}$/.test(puzzleString);
};

const GetGridObject = (puzzleString) => {
  const errorDiv = document.getElementById('error-msg');
  errorDiv.innerHTML = '';

  if (!puzzleValid(puzzleString)) {
    errorDiv.innerHTML = 'Error: Expected puzzle to be 81 characters long.';

    return {};
  }

  const grid = puzzleString.split('').reduce((result, cell, index) => {
    const number = parseInt(cell) || '';

    result[cells[index]] = number;

    return result;
  }, {});

  return grid;
};

const combinationValid = (combination) => {
  if (combination.length !== 9) {
    return false;
  }

  const counts = new Array(9).fill(0);

  combination.forEach((cell) => {
    counts[cell - 1] += 1;
  });

  const result = counts.every((count) => count === 1);

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

const getCombinations = (puzzleString, combinationType) => {
  const gridObject = GetGridObject(puzzleString);

  let cellOrder;

  switch (combinationType) {
    case 'box':
      cellOrder = cellsByBox;
      break;
    case 'column':
      cellOrder = cellsByColumn;
      break;
    case 'row':
      cellOrder = cellsByRow;
      break;
  }

  const combinations = cellOrder.map((order) => {
    return order.map((cell) => {
      return gridObject[cell];
    });
  });

  return combinations;
};

const SolutionValid = (puzzleString) => {
  if (!completedPuzzleValid(puzzleString)) {
    return false;
  }

  const boxes = getCombinations(puzzleString, 'box');
  const rows = getCombinations(puzzleString, 'row');
  const columns = getCombinations(puzzleString, 'column');

  const boxesValid = combinationsValid(boxes);
  const rowsValid = combinationsValid(rows);
  const columnsValid = combinationsValid(columns);

  return [boxesValid, rowsValid, columnsValid].every((pattern) => pattern);
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

const getPuzzleStringIndex = (cellIndex) => {
  const [, row, column] = cellIndex.match(/^(?<row>[A-I])(?<column>[1-9])$/);

  const index = (row.charCodeAt(0) - 65) * 9 + parseInt(column) - 1;

  return index;
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

const ClearInput = () => {
  textArea.value = '';

  [...document.getElementsByClassName('sudoku-input')].forEach((cell) => {
    cell.value = '';
  });
};

const GetSolution = () => {
  const puzzleString = textArea.value;
};

const getTree = () => {
  const tree = cells.reduce((result, cell) => {
    const row = cell.charAt(0);
    const column = cell.charAt(1);

    const combinations = [
      columns.map((c) => `${row}${c}`),
      rows.map((r) => `${r}${column}`),
    ];
  }, {});
};

const getBox = (cell) => {};

// event listeners
textArea.addEventListener('input', UpdateGrid);
[...document.getElementsByClassName('sudoku-input')].forEach((cell) => {
  cell.addEventListener('input', UpdatePuzzleString);
});
document.getElementById('clear-button').addEventListener('click', ClearInput);
document.getElementById('solve-button').addEventListener('click', GetSolution);

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
