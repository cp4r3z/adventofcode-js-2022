//const assert = require('node:assert');

//import {describe, expect, test} from '@jest/globals';

import {jest} from '@jest/globals';

//const part1 = require('./aoc');

import part1 from './aoc';
//const part2 = require('./part2'); // maybe part1 and part 2 call into a shared aoc?

describe('Day 1: Calorie Counting', () => {
  test('should find most calories carried by elf', () => {
    const input =
      `1000
       2000
       3000

       4000

       5000
       6000

       7000
       8000
       9000

       10000`;

    expect(part1(input)).toBe(24000);
  });

//   describe('Part Two', () => {
//     it('should find most calories carried by top three elves', () => {
//       const input =
//         `1000
//          2000
//          3000

//          4000

//          5000
//          6000

//          7000
//          8000
//          9000

//          10000`;

//       assert.strictEqual(part2(input), 45000);
//     });
//   });
});