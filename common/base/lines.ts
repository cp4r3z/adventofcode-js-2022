import * as Point from "./points"

export class Line2D {

    // TODO: Maybe take an optional parameter to specify infinite lines?
    public static Intersects = (L0: Line2D, L1: Line2D): Point.IPoint2D | null => {

        // Line L0 represented as a1x + b1y = c1
        const a1 = L0._p1.y - L0._p0.y;
        const b1 = L0._p0.x - L0._p1.x;
        const c1 = a1 * (L0._p0.x) + b1 * (L0._p0.y);

        // Line L1 represented as a2x + b2y = c2
        const a2 = L1._p1.y - L1._p0.y;
        const b2 = L0._p0.x - L1._p1.x;
        const c2 = a2 * (L1._p0.x) + b2 * (L1._p0.y);

        const determinant = a1 * b2 - a2 * b1;

        if (determinant == 0) {
            return null;
        }

        const x = (b2 * c1 - b1 * c2) / determinant;
        const y = (a1 * c2 - a2 * c1) / determinant;
        return new Point.XY(x, y);
    }


     _p0: Point.XY;
     _p1: Point.XY;

    // Order doesn't matter
    constructor(p0: Point.IPoint2D, p1?: Point.IPoint2D) {
        if (p0 && !p1) {
            // Point
            this._p0 = p0.copy();
            this._p1 = p0.copy();
            return;
        }
        this._p0 = p0.copy();
        this._p1 = p1.copy();
    }

    toString = () => `(${this._p0.x},${this._p0.y})->(${this._p1.x},${this._p1.y})`;
}


/**
 * ```
 * x0y0: Top Left
 * x1y1: Bottom Right
 * ```
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

    private _x0y0: Point.XY;
    private _x1y1: Point.XY;

    constructor(x0y0: Point.IPoint2D, x1y1?: Point.IPoint2D) {
        if (x0y0 && !x1y1) {
            // Point
            this._x0y0 = x0y0.copy();
            this._x1y1 = x0y0.copy();
            return;
        }

        if (x0y0.x > x1y1.x || x0y0.y > x1y1.y) {
            // Try to reverse it
            if (x0y0.x >= x1y1.x && x0y0.y >= x1y1.y) {
                console.warn('Rectangle received reversed inputs');
                this._x0y0 = x1y1.copy();
                this._x1y1 = x0y0.copy();
            } else {
                throw new Error("Invalid Rectangle");
            }
        } else {
            this._x0y0 = x0y0.copy();
            this._x1y1 = x1y1.copy();
        }
    }

    public get x0y0() { return this._x0y0; }
    public get x0y1() { return new Point.XY(this._x0y0.x, this._x1y1.y); }
    public get x1y0() { return new Point.XY(this._x1y1.x, this._x0y0.y); }
    public get x1y1() { return this._x1y1; }

    public upperLeft(yUp?: boolean) { return yUp ? this.x0y1 : this.x0y0; }
    public lowerLeft(yUp?: boolean) { return yUp ? this.x0y0 : this.x1y0; }
    public upperRight(yUp?: boolean) { return yUp ? this.x1y1 : this.x0y1; }
    public lowerRight(yUp?: boolean) { return yUp ? this.x1y0 : this.x1y1; }

    public get minX(): number { return this._x0y0.x; }
    public get maxX(): number { return this._x1y1.x; }
    public get minY(): number { return this._x0y0.y; }
    public get maxY(): number { return this._x1y1.y; }

    deltaX = (asGrid?: boolean): number => this.maxX - this.minX + (asGrid ? 1 : 0);
    deltaY = (asGrid?: boolean): number => this.maxY - this.minY + (asGrid ? 1 : 0);

    /**
     * TODO: This is the area of the rectangle, NOT the active area
     * @param asGrid Counts vertices as units
     * @returns 
     */
    area = (asGrid?: boolean): number => this.deltaX(asGrid) * this.deltaY(asGrid);

    /**
     * @param delta move while copying
     */
    copy = (delta?: Point.XY) => {
        const copy = new Rectangle(this._x0y0, this._x1y1);
        if (delta) {
            copy.move(delta);
        }
        return copy;
    }

    /**
     * AKA "Add"
     */
    move = (delta: Point.XY) => {
        this._x0y0.move(delta);
        this._x1y1.move(delta);
    }

    //TODO: Unit test this guy
    intersects = (other: Rectangle): boolean => {
        const rangeX = [[this._x0y0.x, this._x1y1.x], [other.x0y0.x, other.x1y1.x]];
        const rangeY = [[this._x0y0.y, this._x1y1.y], [other.x0y0.y, other.x1y1.y]];

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
        const rangeX = [[this._x0y0.x, this._x1y1.x], [other.x0y0.x, other.x1y1.x]];
        const rangeY = [[this._x0y0.y, this._x1y1.y], [other.x0y0.y, other.x1y1.y]];

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
    center = (): Point.XY => {
        const dimX = this._x1y1.x - this._x0y0.x;
        const dimY = this._x1y1.y - this._x0y0.y;
        const center = new Point.XY(Math.ceil(dimX / 2), Math.ceil(dimY / 2));
        return center;
    }

    // How is this different from contains?
    hasPoint = (coor: Point.XY): Boolean => {
        return (
            coor.x >= this._x0y0.x && coor.x <= this._x1y1.x &&
            coor.y >= this._x0y0.y && coor.y <= this._x1y1.y
        );
    }

    isPoint = (coor: Point.XY): Boolean => {
        return (
            coor.x === this._x0y0.x && coor.x === this._x1y1.x &&
            coor.y === this._x0y0.y && coor.y === this._x1y1.y
        );
    }

};