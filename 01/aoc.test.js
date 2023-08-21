import { jest } from '@jest/globals';
import { part1, part2 } from './aoc';
import { input, tinput } from './aoc.input';

describe('Day 1: Calorie Counting: Part 1', () => {
    it('Test 1', async () => {
        expect(part1(tinput)).toBe(24000);
    });
});

describe('Day 1: Calorie Counting: Part 2', () => {
    test('Test 1', () => {
        expect(part2(tinput)).toBe(45000);
    });
});
