import { jest } from '@jest/globals';
import { Rectangle } from '../out/common/base/shapes'
import { Point2D } from '../out/common/base/points';

describe('Common Tests: Rectangle', () => {
    const r_x0x0 = new Point2D(-1, -1);
    const r_x1x1 = new Point2D(1, 1);
    const rTest = new Rectangle(r_x0x0, r_x1x1);

    it('Intersects', async () => {

        const intersecting = [
            new Rectangle(new Point2D(-1, -1), new Point2D(1, 1)), // Same
            rTest.copy(), //Same
            new Rectangle(new Point2D(-1, -1), new Point2D(-1, -1)), // Point
            new Rectangle(new Point2D(-1, -1), new Point2D(0, 0)),
            new Rectangle(new Point2D(-2, -2), new Point2D(-1, -1)), // Touching corner
            new Rectangle(new Point2D(1, 1), new Point2D(2, 2)), // Touching corner
            new Rectangle(new Point2D(1, -1), new Point2D(2, 1)),
            new Rectangle(new Point2D(-10, -10), new Point2D(10, 10))
        ];

        intersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(true);
        });

        const notIntersecting = [
            new Rectangle(new Point2D(-3, -3), new Point2D(-2, -2)),
            new Rectangle(new Point2D(1, 2), new Point2D(1, 3)),
        ];

        notIntersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(false);
        });

        expect(() => new Rectangle(new Point2D(1, 1), new Point2D(-1, -1))).toThrow();
    });
   
});
