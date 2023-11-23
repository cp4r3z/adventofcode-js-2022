import { part1, part2 } from '../out/16/aoc';
import * as Input from '../out/common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const input = await Input.input(__dirname);

describe('Day 16', () => {
    it('Part 1', async () => {
        const solution = await part1(tinput);
        expect(solution).toBe(1651);
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = await part1(input);
        console.log(solution);
    });

    xit('Part 2', async () => {
        const solution = await part2(tinput);
        expect(solution).toBe(1707);
    });

    xit('Part 2 (Real Input)', async () => {
        // This gives the right answer but takes 10 minutes!
        const solution = await part2(input);
        console.log(solution);
    });
});
