const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

// sudoku table
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

// ['A1', 'A2', 'A3', 'A4', ...]
const CELLS = ROWS.reduce((result, row) => {
  const rowCells = COLUMNS.map((column) => `${row}${column}`);
  result = [...result, ...rowCells];

  return result;
}, []);

// [['A1', 'A2', ...], ['B1', 'B2', ...], ...]
const cellsByRow = ROWS.map((row) => {
  return COLUMNS.map((column) => `${row}${column}`);
});

// [['A1', 'B1', ...], ['A2', 'B2', ...], ...]
const cellsByColumn = COLUMNS.map((column) => {
  return ROWS.map((row) => `${row}${column}`);
});

// [['A1', 'A2', 'A3', 'B1', ...], ...]
const BOXES = [
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

// { A1: [box, row, column], ...}
const COMBINATIONS = CELLS.reduce((result, cell, index) => {
  const boxIndex = BOXES.findIndex((box) => box.includes(cell));
  const rowIndex = cellsByRow.findIndex((row) => row.includes(cell));
  const columnIndex = cellsByColumn.findIndex((column) =>
    column.includes(cell)
  );

  result[cell] = [
    [...BOXES[boxIndex]],
    [...cellsByRow[rowIndex]],
    [...cellsByColumn[columnIndex]],
  ];

  return result;
}, {});

const PEERS = CELLS.reduce((result, cell) => {
  const combinations = COMBINATIONS[cell];

  const peers = combinations.reduce((peerResult, combination) => {
    combination.forEach((cell) => {
      peerResult.add(cell);
    });

    peerResult.delete(cell);

    return peerResult;
  }, new Set());

  result[cell] = [...peers];

  return result;
}, {});

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

    result[CELLS[index]] = number;

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
      cellOrder = BOXES;
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

const Solve = (puzzleString) => {
  const matches = puzzleString.match(/\./);

  // completed
  if (!matches) {
    return puzzleString;
  }

  // get next empty cell
  const { index } = matches;
  const cell = CELLS[index];

  const choices = getChoices(cell, puzzleString);

  for (const choice of choices) {
    const updatedPuzzleString = puzzleString.replace(/\./, choice);
    const solvedPuzzleString = Solve(updatedPuzzleString);

    // unable to continue solving, try next choice
    if (/\./.test(solvedPuzzleString)) {
      continue;
    }

    return solvedPuzzleString;
  }

  // exhausted all choices
  return puzzleString;
};

const getChoices = (cell, puzzleString) => {
  const gridObject = GetGridObject(puzzleString);

  const cellCombinationsUnique = PEERS[cell];

  const constraints = cellCombinationsUnique.reduce((result, cellIndex) => {
    const constraint = gridObject[cellIndex];

    if (constraint) {
      return result.add(constraint);
    }

    return result;
  }, new Set());

  const choices = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((result, choice) => {
    if (constraints.has(choice)) {
      return result;
    }
    return [...result, choice];
  }, []);

  return choices;
};

const GetSolution = () => {
  const puzzleString = textArea.value;

  const solvedPuzzleString = Solve(puzzleString);
  textArea.value = solvedPuzzleString;

  const event = new window.Event('input');
  textArea.dispatchEvent(event);
};

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
    Solve,
    GetSolution,
  };
} catch (e) {}
