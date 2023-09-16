import { jest } from '@jest/globals';
import * as Shape from '../out/common/base/shapes'
import * as Point from '../out/common/base/points';
import { QuadTree, RectangleToBase2 } from '../out/common/quadtree';

xdescribe('Common Tests: Shape.Rectangle', () => {
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

describe('Common Tests: QuadTree', () => {
    const r2x2 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(1, 1)
    };

    const r3x3 = {
        x0y0: new Point.XY(-1, -1),
        x1y1: new Point.XY(1, 1)
    };

    const r4x4 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(3, 3)
    };

    const r1x4 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(0, 3)
    };

    const r20x20 = {
        x0y0: new Point.XY(-10, -10),
        x1y1: new Point.XY(10, 10)
    };

    it('Construct: Base2 Rectangle', async () => {
        const b2x2 = RectangleToBase2(new Shape.Rectangle(r2x2.x0y0, r2x2.x1y1))
        expect(b2x2.x0y0.x).toBe(0);
        expect(b2x2.x0y0.y).toBe(0);
        expect(b2x2.x1y1.x).toBe(1);
        expect(b2x2.x1y1.y).toBe(1);

        const b4x4 = RectangleToBase2(new Shape.Rectangle(r4x4.x0y0, r4x4.x1y1));
        expect(b4x4.x0y0.x).toBe(0);
        expect(b4x4.x0y0.y).toBe(0);
        expect(b4x4.x1y1.x).toBe(3);
        expect(b4x4.x1y1.y).toBe(3);

        const b3x3 = RectangleToBase2(new Shape.Rectangle(r3x3.x0y0, r3x3.x1y1));
        expect(b3x3.deltaX()).toBe(3);
        expect(b3x3.deltaY()).toBe(3);
        expect(b3x3.deltaX(true)).toBe(4);
        expect(b3x3.deltaY(true)).toBe(4);
        expect(b3x3.area(true)).toBe(16);

        const b1x4 = RectangleToBase2(new Shape.Rectangle(r1x4.x0y0, r1x4.x1y1));
        expect(b1x4.x0y0.x).toBe(0);
        expect(b1x4.x0y0.y).toBe(0);
        expect(b1x4.x1y1.x).toBe(3);
        expect(b1x4.x1y1.y).toBe(3);
        expect(b1x4.area(true)).toBe(16);

        const b1x4Buffered = RectangleToBase2(new Shape.Rectangle(r1x4.x0y0, r1x4.x1y1), .25);
        expect(b1x4Buffered.x0y0.x).toBe(-1);
        expect(b1x4Buffered.x0y0.y).toBe(-1);
        expect(b1x4Buffered.x1y1.x).toBe(6);
        expect(b1x4Buffered.x1y1.y).toBe(6);
        expect(b1x4Buffered.deltaX(true)).toBe(8);
        expect(b1x4Buffered.deltaY(true)).toBe(8);
        expect(b1x4Buffered.area(true)).toBe(64);

        const b20x20 = RectangleToBase2(new Shape.Rectangle(r20x20.x0y0, r20x20.x1y1));
        expect(b20x20.x0y0.x).toBe(-10);
        expect(b20x20.x0y0.y).toBe(-10);
        expect(b20x20.x1y1.x).toBe(21);
        expect(b20x20.x1y1.y).toBe(21);
        expect(b20x20.deltaX(true)).toBe(32);
        expect(b20x20.deltaY(true)).toBe(32);
        expect(b20x20.area(true)).toBe(1024);

        const b20x20Buffered = RectangleToBase2(new Shape.Rectangle(r20x20.x0y0, r20x20.x1y1), .25);
        expect(b20x20Buffered.x0y0.x).toBe(-13);
        expect(b20x20Buffered.x0y0.y).toBe(-13);
        expect(b20x20Buffered.x1y1.x).toBe(18);
        expect(b20x20Buffered.x1y1.y).toBe(18);
        expect(b20x20Buffered.deltaX(true)).toBe(32);
        expect(b20x20Buffered.deltaY(true)).toBe(32);
        expect(b20x20Buffered.area(true)).toBe(1024);
    });

    it('Construct', async () => {

        //const qt = new QuadTree();

    });
});
