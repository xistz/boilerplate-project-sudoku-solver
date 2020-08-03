/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { text } = require('body-parser');
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });

  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', (done) => {
      const input =
        '7.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

      const textarea = document.getElementById('text-input');
      textarea.value = input;
      textarea.addEventListener('input', Solver.UpdateGrid);

      const event = new window.Event('input');
      textarea.dispatchEvent(event);

      input.split('').forEach((char, index) => {
        const rowLetter = String.fromCharCode(Math.floor(index / 9) + 65);
        const cellIndex = rowLetter + ((index % 9) + 1);

        const cellInput = document.getElementById(cellIndex).value;

        if (char === '.') {
          assert.equal(cellInput, '');
        } else {
          assert.equal(cellInput, char);
        }
      });

      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', (done) => {
      for (let index = 0; index < 81; index++) {
        const input = Math.floor(Math.random() * 8 + 1).toString();

        const rowIndex = Math.floor(index / 9);
        const columnIndex = (index % 9) + 1;
        const cellIndex = String.fromCharCode(rowIndex + 65) + `${columnIndex}`;

        const cell = document.getElementById(cellIndex);
        cell.value = input;
        cell.addEventListener('input', Solver.UpdatePuzzleString);

        const event = new window.Event('input');
        cell.dispatchEvent(event);

        const textarea = document.getElementById('text-input');
        const puzzleString = textarea.value;
        const puzzle = puzzleString.split('');

        assert.equal(puzzle[index], input);
      }

      done();
    });
  });

  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku
    // grid and the text area
    test('Function clearInput()', (done) => {
      // done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', (done) => {
      // done();
    });
  });
});
