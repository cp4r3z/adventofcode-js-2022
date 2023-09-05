import { jest } from '@jest/globals';
import { part1, part2 } from '../out/14/aoc';
import { input, tinput } from './aoc.input';

describe('Day 14', () => {
    it('Part 1', async () => {
        const solution = part1(tinput);
        expect(solution).toBe(24);
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = part1(input);
        console.log(solution);
    });

    it('Part 2', async () => {
        const solution = part2(tinput);
        console.log(solution);
        expect(solution).toBe(93);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = part2(input);
        console.log(solution);
    });
});
