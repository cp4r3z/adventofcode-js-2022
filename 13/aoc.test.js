import { jest } from '@jest/globals';
import { part1, part2 } from '../out/13/aoc';
import { input, tinput,tinputLine } from './aoc.input';

describe('Day 13: Part 1', () => {
    it('Splitter', async () => {
        //part1('[[1],[2,3,4]]');
        part1('[1,[2,[3,[4,[5,6,7]]]],8,9]');
        //expect('[[1],[2,3,4]]').toBe(24000);
    });

    xit('Part 1', async () => {
        expect(part1(tinput)).toBe(24000);
    });
});

// xdescribe('Day 1: Calorie Counting: Part 2', () => {
//     test('Test 1', () => {
//         expect(part2(tinput)).toBe(45000);
//     });
// });
