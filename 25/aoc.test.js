import { part1, part2 } from '../out/25/aoc';
import * as Input from '../out/common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const input = await Input.input(__dirname);

describe('Day 25', () => {
    it('Part 1', async () => {
        const solution = await part1(tinput);
        expect(solution).toBe('2=-1=0');
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = await part1(input);
        console.log(solution);
    });

    // No Part 2 for Day 25!

    // it('Part 2', async () => {
    //     const solution = await part2(tinput);
    //     expect(solution).toBe(20);
    // });

    // xit('Part 2 (Real Input)', async () => {
    //     const solution = await part2(input);
    //     console.log(solution);
    // });
});
