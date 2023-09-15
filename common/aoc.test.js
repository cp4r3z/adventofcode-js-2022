import { jest } from '@jest/globals';
import * as Shape from '../out/common/base/shapes'
import * as Point from '../out/common/base/points';

describe('Common Tests: Shape.Rectangle', () => {
    const r_x0y0 = new Point.XY(-1, -1);
    const r_x1y1 = new Point.XY(1, 1);
    const rTest = new Shape.Rectangle(r_x0y0, r_x1y1);

    it('Construct Point', async () => {
        const r = new Shape.Rectangle(r_x0y0, r_x0y0);
        expect(r.isPoint(r_x0y0)).toBe(true);
        expect(r.area()).toBe(0);
        expect(r.area(true)).toBe(1);
    });

    it('Construct Line', async () => {
        const r = new Shape.Rectangle(r_x0y0, new Point.XY(r_x0y0.x, r_x0y0.y + 1));
        expect(r.area()).toBe(0);
        expect(r.area(true)).toBe(2);
    });

    it('Construct Using Various Vectors', async () => {
        const reversed = new Shape.Rectangle(r_x1y1, r_x0y0);
        expect(reversed.minX).toBe(r_x0y0.x);
        expect(reversed.maxX).toBe(r_x1y1.x);
        expect(reversed.minY).toBe(r_x0y0.y);
        expect(reversed.maxY).toBe(r_x1y1.y);
        expect(() => new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(1, -1))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(1, -1), new Point.XY(0, 0))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(-1, 1))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(-1, 1), new Point.XY(0, 0))).toThrow();
    });

    it('Area', async () => {
        expect(rTest.area()).toBe(4);
        expect(rTest.area(true)).toBe(9);
    });

    it('Intersects', async () => {

        const intersecting = [
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(1, 1)), // Same
            rTest.copy(), //Same
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(-1, -1)), // Point
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(0, 0)),
            new Shape.Rectangle(new Point.XY(-2, -2), new Point.XY(-1, -1)), // Touching corner
            new Shape.Rectangle(new Point.XY(1, 1), new Point.XY(2, 2)), // Touching corner
            new Shape.Rectangle(new Point.XY(1, -1), new Point.XY(2, 1)),
            new Shape.Rectangle(new Point.XY(-10, -10), new Point.XY(10, 10))
        ];

        intersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(true);
        });

        const notIntersecting = [
            new Shape.Rectangle(new Point.XY(-3, -3), new Point.XY(-2, -2)),
            new Shape.Rectangle(new Point.XY(1, 2), new Point.XY(1, 3)),
        ];

        notIntersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(false);
        });

    });

});
