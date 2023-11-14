import { part1, part2 } from '../out/18/aoc';
import { input, tinput } from './aoc.input';

describe('Day 18', () => {
    it('Part 1', async () => {
        const solution = part1(tinput);
        expect(solution).toBe(64);
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = part1(input);
        console.log(solution);
    });

    it('Part 2', async () => {
        const solution = part2(tinput);        
        expect(solution).toBe(58);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = part2(input);
        console.log(solution);
    });
});
