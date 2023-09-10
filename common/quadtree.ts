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

    // shift = (delta: Coor2D):void => {

    //         new Coor2D( ),
    //         new Coor2D() );
    // }

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
            // Touching doesn't count
            const result = sorted[1][0] < sorted[0][1];
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

};

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
        const dx = Math.abs(this.bounds.x1y1.x - this.bounds.x0y0.x);
        const dy = Math.abs(this.bounds.x1y1.y - this.bounds.x0y0.y);
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
        const currentBoundDimension = this.bounds.x1y1.x - this.bounds.x0y0.x ;

        if (currentBoundDimension === 1) {
            // Cannot split!
            return false;
        }

        const splitDim = currentBoundDimension / 2 

        const shifts = {
            x0y0: new Coor2D(0, 0),
            x0y1: new Coor2D(0, splitDim),
            x1y0: new Coor2D(splitDim, 0),
            x1y1: new Coor2D(splitDim, splitDim)
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

    //public get area() { return this._area; }

    // Intersects = (bounds: Bounds): boolean => {
    //     // sort

    //     // does 



    //     const yCheck: boolean = bounds.x1y1.y <= this.bounds.x1y1.y && bounds.x0y0.y >= this.bounds.x0y0.y;
    //     if (!yCheck) return false;
    //     const xCheck: boolean = bounds.x1y1.x <= this.bounds.x1y1.x && bounds.x0y0.x >= this.bounds.x0y0.x;
    //     if (!xCheck) return false;
    //     return true;
    // }

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

}

export { QuadTree, Bounds };
