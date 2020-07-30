/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html').then((dom) => {
      global.window = dom.window;
      global.document = dom.window.document;

      Solver = require('../public/sudoku-solver.js');
    });
  });

  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function InputValid()', () => {
    test('Valid "1-9" characters', (done) => {
      const inputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

      inputs.forEach((input) => {
        assert.isTrue(Solver.InputValid(input));
      });

      done();
    });

    // Invalid characters or numbers are not accepted
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const inputs = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];

      inputs.forEach((input) => {
        assert.isFalse(Solver.InputValid(input));
      });

      done();
    });
  });

  suite('Function GetGrid()', () => {
    test('Parses a valid puzzle string into an object', (done) => {
      const input =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const expected = {
        A3: 9,
        A6: 5,
        A8: 1,
        B1: 8,
        B2: 5,
        B4: 4,
        B9: 2,
        C1: 4,
        C2: 3,
        C3: 2,
        D1: 1,
        D5: 6,
        D6: 9,
        D8: 8,
        D9: 3,
        E2: 9,
        E8: 6,
        F1: 6,
        F2: 2,
        F4: 7,
        F5: 1,
        F9: 9,
        G7: 1,
        G8: 9,
        G9: 4,
        H1: 5,
        H6: 4,
        H8: 3,
        H9: 7,
        I2: 4,
        I4: 3,
        I7: 6,
      };

      const got = Solver.GetGrid(input);

      assert.isObject(got);
      assert.deepEqual(got, expected);

      done();
    });

    // Puzzles that are not 81 numbers/periods long show the message
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', (done) => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');

      [shortStr, longStr].forEach((puzzle) => {
        Solver.GetGrid(puzzle);
        assert.equal(errorDiv.innerHTML, errorMsg);
      });

      done();
    });
  });

  suite('Function SolutionValid()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', (done) => {
      const input =
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.isTrue(Solver.SolutionValid(input));
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', (done) => {
      const input =
        '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

      assert.isFalse(Solver.SolutionValid(input));
      done();
    });
  });

  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', (done) => {
      const input =
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

      // done();
    });
  });
});
