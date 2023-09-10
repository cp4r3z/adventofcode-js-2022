// Reference: https://www.geeksforgeeks.org/quad-tree/

import { Coor2D } from "./grid";

// class Node<T> {
//     active: boolean;
//     data: T;
//     coor: Coor2D; // Can this also be generic?

//     constructor(_coor: Coor2D, _data: T) {
//         this.data = _data;
//         this.coor = _coor;
//     }

// }

// Rectangle
class Bounds {

    readonly x0y0: Coor2D;
    readonly x1y1: Coor2D;

    constructor(x0y0: Coor2D, x1y1: Coor2D) {
        // TODO: Sanitize Bounds, maybe create a SquareBase2 subclass?

        this.x0y0 = Coor2D.Copy(x0y0);
        this.x1y1 = Coor2D.Copy(x1y1);
    }

    /**
     * @param delta Shift while copying
     */
    copy = (delta?: Coor2D) => {
        let x0y0 = Coor2D.Copy(this.x0y0);
        let x1y1 = Coor2D.Copy(this.x1y1);
        if (delta) {
            x0y0.x += delta.x;
            x1y1.x += delta.x;
            x0y0.y += delta.y;
            x1y1.y += delta.y;
        }
        return new Bounds(x0y0, x1y1);
    }

    //TODO: Unit test this guy
    intersects = (other: Bounds): boolean => {
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
    contains = (other: Bounds): boolean => {
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
    center = (): Coor2D => {
        const dimX = this.x1y1.x - this.x0y0.x;
        const dimY = this.x1y1.y - this.x0y0.y;
        const center = new Coor2D(Math.ceil(dimX / 2), Math.ceil(dimY / 2));
        return center;
    }

    hasCoor2D = (coor: Coor2D): Boolean => {
        return (
            coor.x >= this.x0y0.x && coor.x <= this.x1y1.x &&
            coor.y >= this.x0y0.y && coor.y <= this.x1y1.y
        );
    }

    isCoor2D = (coor: Coor2D): Boolean => {
        return (
            coor.x === this.x0y0.x && coor.x === this.x1y1.x &&
            coor.y === this.x0y0.y && coor.y === this.x1y1.y
        );
    }

};

// Consider also a data structure that holds a quadtree, but can resize the root!

class QuadTree<T> {

    //node: Node<T>; // This is where data is stored
    //coor: Coor2D; // Can this also be generic?

    active: boolean;
    data: T | null;

    /**
     * ```
     * x0y0: Top Left
     * x1y1: Bottom Right
     * ```
     */
    readonly bounds: Bounds;

    readonly area: number;

    // origin (0,0) is located in the top-left corner
    // Y "DOWN", X "RIGHT"

    /**
     * ```
     * +-------------+-------------+
     * | (0,0) qx0y0 | (1,0) qx1y0 |
     * +-------------+-------------+
     * | (0,1) qx0y1 | (1,1) qx1y1 |
     * +-------------+-------------+
     * ```     
     */
    quads: {
        x0y0: QuadTree<T>;
        x1y0: QuadTree<T>;
        x0y1: QuadTree<T>;
        x1y1: QuadTree<T>;
    } | null;

    constructor(bounds: Bounds) {

        // Find a power of 2 higher than the bounds?
        const dim = bounds.x1y1.x - bounds.x0y0.x;


        this.bounds = bounds.copy();
        const dx = Math.abs(this.bounds.x1y1.x - this.bounds.x0y0.x) + 1;
        const dy = Math.abs(this.bounds.x1y1.y - this.bounds.x0y0.y) + 1;
        this.area = dx * dy;

        //this.node = null;
        this.data = null;
        this.active = true;
        this.quads = {
            x0y0: null,
            x0y1: null,
            x1y0: null,
            x1y1: null
        }
    }

    get hasChildren(): Boolean { return !!(this.quads.x0y0) }; // Assumes if there's one quad, all four exist

    split = (): Boolean => {
        // Note: This assumes a square quad!
        const currentBoundDimension = this.bounds.x1y1.x - this.bounds.x0y0.x;

        if (currentBoundDimension < 1) {
            // Cannot split!
            return false;
        }

        // if (currentBoundDimension === 1) {

        //     return true;
        // }

        const splitDim = Math.floor(currentBoundDimension / 2);

        let shift = splitDim;
        if (splitDim === 0) {
            shift = 1;
            console.log('chek it')
        }

        const shifts = {
            x0y0: new Coor2D(0, 0),
            x0y1: new Coor2D(0, shift),
            x1y0: new Coor2D(shift, 0),
            x1y1: new Coor2D(shift, shift)
        }

        const splitBounds = {
            x0y0: new Bounds(
                this.bounds.x0y0,
                new Coor2D(
                    this.bounds.x0y0.x + splitDim,
                    this.bounds.x0y0.y + splitDim
                )
            ),
            x0y1: null,
            x1y0: null,
            x1y1: null
        }

        splitBounds.x0y1 = splitBounds.x0y0.copy(shifts.x0y1);
        splitBounds.x1y0 = splitBounds.x0y0.copy(shifts.x1y0);
        splitBounds.x1y1 = splitBounds.x0y0.copy(shifts.x1y1);

        this.quads.x0y0 = new QuadTree(splitBounds.x0y0);
        this.quads.x0y1 = new QuadTree(splitBounds.x0y1);
        this.quads.x1y0 = new QuadTree(splitBounds.x1y0);
        this.quads.x1y1 = new QuadTree(splitBounds.x1y1);

        return true;
    }

    // "Inserts" data into the bounded area
    Set = (bounds: Bounds, data: T) => {

        // Is this quadtree completely within the bounds

        if (bounds.contains(this.bounds)) {
            this.data = data;

            // No need to have children anymore
            this.quads = {
                x0y0: null,
                x0y1: null,
                x1y0: null,
                x1y1: null
            };

            return;
        }

        // If the bounds intersects this, create quads if necessary and then set each quad

        if (bounds.intersects(this.bounds)) {
            this.data = null;

            if (!this.hasChildren) {
                const wasSplit = this.split();
                if (!wasSplit) {
                    throw new Error("Unexpected split");
                }
            }

            for (const [key, quad] of Object.entries(this.quads)) {
                //console.log(`${key}: ${value}`);
                quad.Set(bounds, data);
            }

            // TODO! If all children have the same value, set data and remove children
        }
    }

    Get = (coor: Coor2D): T => {
        // recurse through quads to find the data point.

        // If we're here, return the data
        if (this.bounds.isCoor2D(coor)) {
            return this.data;
        }

        // Find quad
        let containingQuad: QuadTree<T> = null;
        for (const [key, quad] of Object.entries(this.quads)) {
            //console.log(`${key}: ${value}`);
            if (quad.bounds.hasCoor2D(coor)) {
                containingQuad = quad;
            }
        }

        if (!containingQuad) {
            console.error('Unable to find coor');
        }

        return containingQuad.Get(coor);
    }

}

class QuadTreeExpanding<T>{
    static BUFFER = 1.0; // TODO: This shouldn't be necessary once expansion works
    root: QuadTree<T>;

    constructor(bounds: Bounds) {
        // Find a power of 2 higher than the bounds?        

        const dimX = bounds.x1y1.x - bounds.x0y0.x;
        const dimY = bounds.x1y1.y - bounds.x0y0.y;
        let maxDim = Math.max(dimX, dimY);
        maxDim *= QuadTreeExpanding.BUFFER;

        // Figure out how big the quadtree needs to be (how many levels deep)
        const pow = Math.ceil(Math.log2(maxDim));
        const base2Dimension = Math.pow(2, pow);
        const halfBase = base2Dimension / 2;

        // Find max offset from 0,0?

        // Maybe make the center of the quadtree the center of the bounds?

        const center: Coor2D = bounds.center();

        const x0y0 = new Coor2D(center.x - halfBase, center.y - halfBase);
        const x1y1 = new Coor2D(center.x + halfBase, center.y + halfBase);

        const base2Bounds = new Bounds(x0y0, x1y1);

        this.root = new QuadTree<T>(base2Bounds);
    }

    // TODO: Make it expand!
    Set = (bounds: Bounds, data: T) => this.root.Set(bounds, data);
}

export { QuadTree, Bounds, QuadTreeExpanding };

