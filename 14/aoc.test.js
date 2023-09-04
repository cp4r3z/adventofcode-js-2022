import { jest } from '@jest/globals';
import { part1, part2 } from '../out/14/aoc';
import { input, tinput } from './aoc.input';

describe('Day 14', () => {
    it('test', async () => {
        const solution = part1(tinput);
        // console.log(solution);
        // expect(solution).toBe(13);
    });

    xit('Part 1', async () => {
        const solution = part1(tinput);
        console.log(solution);
        expect(solution).toBe(13);
    });

    xit('Part 2', async () => {
        const solution = part2(tinput);
        console.log(solution);
        expect(solution).toBe(140);
    });
});
