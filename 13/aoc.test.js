import { jest } from '@jest/globals';
import { part1, part2 } from '../out/13/aoc';
import { input, tinput } from './aoc.input';

describe('Day 13', () => {
    it('Part 1', async () => {
        expect(part1(tinput)).toBe(13);
        const solution = part1(input);
        console.log(solution);
    });

    it('Part 2', async () => {
        expect(part2(tinput)).toBe(140);
        const solution = part2(input);
        console.log(solution);
    });
});
