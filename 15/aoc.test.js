import { jest } from '@jest/globals';
import { part1, part2 } from '../out/15/aoc';
import { input, tinput } from './aoc.input';

describe('Day 15', () => {
    xit('Part 1', async () => {
        const solution = part1(tinput, 10);
        expect(solution).toBe(26);
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = part1(input, 2000000);
        console.log(solution);
    });

    it('Part 2', async () => {
        const solution = part2(tinput);        
        expect(solution).toBe(56000011);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = part2(input);
        console.log(solution);
    });
});
