import { Point2D } from "./points";

/**
 * Cannot Resize
 */
export class Rectangle {

    public static Equal = (A: Rectangle, B: Rectangle): boolean => {
        return (
            A.x0y0.x === B.x0y0.x &&
            A.x1y1.x === B.x1y1.x &&
            A.x0y0.y === B.x0y0.y &&
            A.x1y1.y === B.x1y1.y
        );
    }

    readonly x0y0: Point2D;
    readonly x1y1: Point2D;

    readonly minX: number;
    readonly maxX: number;
    readonly minY: number;
    readonly maxY: number;

    constructor(x0y0: Point2D, x1y1: Point2D) {
        // Sanitize
        if (x0y0.x > x1y1.x || x0y0.y > x1y1.y) {
            throw new Error("Invalid Rectangle");
        }

        this.x0y0 = x0y0.copy();
        this.x1y1 = x1y1.copy();
        this.minX = x0y0.x;
        this.maxX = x1y1.x;
        this.minY = x0y0.y;
        this.maxY = x1y1.y;
    }

    /**
     * @param delta Shift while copying
     */
    copy = (delta?: Point2D) => {
        let x0y0 = this.x0y0.copy();
        let x1y1 = this.x1y1.copy();
        if (delta) {
            x0y0.x += delta.x;
            x1y1.x += delta.x;
            x0y0.y += delta.y;
            x1y1.y += delta.y;
        }
        return new Rectangle(x0y0, x1y1);
    }

    //TODO: Unit test this guy
    intersects = (other: Rectangle): boolean => {
        const rangeX = [[this.x0y0.x, this.x1y1.x], [other.x0y0.x, other.x1y1.x]];
        const rangeY = [[this.x0y0.y, this.x1y1.y], [other.x0y0.y, other.x1y1.y]];

        // TODO: Too confusing?
        return [rangeX, rangeY].reduce((prev, cur) => {
            if (!prev) return false;
            // Sort each range pair based on the lowest value (x0y0)
            const sorted = cur.sort((a, b) => a[0] - b[0]);
            // If the lowest value of the "high" is less than the highest value of the "low", it intersects
            // "On edge" counts
            const result = sorted[1][0] <= sorted[0][1];
            return result;
        }, true);
    }

    //TODO: Unit test this guy
    contains = (other: Rectangle): boolean => {
        const rangeX = [[this.x0y0.x, this.x1y1.x], [other.x0y0.x, other.x1y1.x]];
        const rangeY = [[this.x0y0.y, this.x1y1.y], [other.x0y0.y, other.x1y1.y]];

        // TODO: Too confusing
        return [rangeX, rangeY].reduce((prev, cur) => {
            if (!prev) return false;
            // cur[0] this
            // cur[1] other
            // this's low is lower (or equal) than other's low and this's high is higher than (or equal) other's high
            const result = cur[0][0] <= cur[1][0] && cur[0][1] >= cur[1][1];
            return result;
        }, true);
    }

    // Approximate center (rounded to next integer)
    center = (): Point2D => {
        const dimX = this.x1y1.x - this.x0y0.x;
        const dimY = this.x1y1.y - this.x0y0.y;
        const center = new Point2D(Math.ceil(dimX / 2), Math.ceil(dimY / 2));
        return center;
    }

    hasPoint2D = (coor: Point2D): Boolean => {
        return (
            coor.x >= this.x0y0.x && coor.x <= this.x1y1.x &&
            coor.y >= this.x0y0.y && coor.y <= this.x1y1.y
        );
    }

};