// Reference: https://www.geeksforgeeks.org/quad-tree/

import * as Point from "./base/points";
import * as Shape from "./base/shapes";

export type RectangleOptions = {
    buffer?: number,
    isRoot?: boolean
}

/**     
 * @param buffer (as a percentage)
 * @returns 
 */
export class Rectangle extends Shape.Rectangle {
    public static Base2Points = (
        x0y0: Point.IPoint2D,
        x1y1: Point.IPoint2D,
        buffer: number = 0): {
            x0y0: Point.IPoint2D,
            x1y1: Point.IPoint2D
        } => {

        const rangeX = Math.abs(x1y1.x - x0y0.x);
        const rangeY = Math.abs(x1y1.y - x0y0.y);
        const maxRange = Math.max(rangeX, rangeY) + 1;

        const offset = Math.ceil(maxRange * buffer / 2); // This gets added to all dimensions.

        const x0y0_ = new Point.XY(x0y0.x - offset, x0y0.y - offset);

        // Find a power of 2 higher than the bounds?        
        // Figure out how big the quadtree needs to be (how many levels deep)

        const pow = Math.ceil(Math.log2(maxRange + (2 * offset)));
        const base2Dimension = Math.pow(2, pow);
        const x1y1_ = new Point.XY(x0y0_.x + base2Dimension - 1, x0y0_.y + base2Dimension - 1);

        //return new Shape.Rectangle(x0y0_, x1y1_);
        return { x0y0: x0y0_, x1y1: x1y1_ };
    }

    constructor(
        x0y0: Point.IPoint2D,
        x1y1: Point.IPoint2D,
        options?: RectangleOptions) {
        let isRoot = false;
        let buffer = 0;
        if (options) {
            isRoot = !!(options.isRoot);
            buffer = options.buffer || 0;
        }

        if (isRoot) {
            const base2Points = Rectangle.Base2Points(x0y0, x1y1, buffer);
            super(base2Points.x0y0, base2Points.x1y1);
        } else {
            // If we're not at the root rectangle, assume we already have a Base 2 Rectangle
            super(x0y0, x1y1);
        }
    }
}

// Rectangle
// class BoundsOld {

//     readonly x0y0: Point.XY;
//     readonly x1y1: Point.XY;

//     constructor(x0y0: Point.XY, x1y1: Point.XY) {
//         // TODO: Sanitize Bounds, maybe create a SquareBase2 subclass?

//         this.x0y0 = Point.XY.Copy(x0y0);
//         this.x1y1 = Point.XY.Copy(x1y1);
//     }

//     /**
//      * @param delta Shift while copying
//      */
//     copy = (delta?: Point.XY) => {
//         let x0y0 = Point.XY.Copy(this.x0y0);
//         let x1y1 = Point.XY.Copy(this.x1y1);
//         if (delta) {
//             x0y0.x += delta.x;
//             x1y1.x += delta.x;
//             x0y0.y += delta.y;
//             x1y1.y += delta.y;
//         }
//         return new Bounds(x0y0, x1y1);
//     }

//     //TODO: Unit test this guy
//     intersects = (other: Bounds): boolean => {
//         const rangeX = [[this.x0y0.x, this.x1y1.x], [other.x0y0.x, other.x1y1.x]];
//         const rangeY = [[this.x0y0.y, this.x1y1.y], [other.x0y0.y, other.x1y1.y]];

//         // TODO: Too confusing?
//         return [rangeX, rangeY].reduce((prev, cur) => {
//             if (!prev) return false;
//             // Sort each range pair based on the lowest value (x0y0)
//             const sorted = cur.sort((a, b) => a[0] - b[0]);
//             // If the lowest value of the "high" is less than the highest value of the "low", it intersects
//             // "On edge" counts
//             const result = sorted[1][0] <= sorted[0][1];
//             return result;
//         }, true);
//     }

//     //TODO: Unit test this guy
//     contains = (other: Bounds): boolean => {
//         const rangeX = [[this.x0y0.x, this.x1y1.x], [other.x0y0.x, other.x1y1.x]];
//         const rangeY = [[this.x0y0.y, this.x1y1.y], [other.x0y0.y, other.x1y1.y]];

//         // TODO: Too confusing
//         return [rangeX, rangeY].reduce((prev, cur) => {
//             if (!prev) return false;
//             // cur[0] this
//             // cur[1] other
//             // this's low is lower (or equal) than other's low and this's high is higher than (or equal) other's high
//             const result = cur[0][0] <= cur[1][0] && cur[0][1] >= cur[1][1];
//             return result;
//         }, true);
//     }

//     // Approximate center (rounded to next integer)
//     center = (): Point.XY => {
//         const dimX = this.x1y1.x - this.x0y0.x;
//         const dimY = this.x1y1.y - this.x0y0.y;
//         const center = new Point.XY(Math.ceil(dimX / 2), Math.ceil(dimY / 2));
//         return center;
//     }

//     hasPoint.XY = (coor: Point.XY): Boolean => {
//         return (
//             coor.x >= this.x0y0.x && coor.x <= this.x1y1.x &&
//             coor.y >= this.x0y0.y && coor.y <= this.x1y1.y
//         );
//     }

//     isPoint.XY = (coor: Point.XY): Boolean => {
//         return (
//             coor.x === this.x0y0.x && coor.x === this.x1y1.x &&
//             coor.y === this.x0y0.y && coor.y === this.x1y1.y
//         );
//     }

// };

// Consider also a data structure that holds a quadtree, but can resize the root!

export enum ActiveState {
    INACTIVE,
    ACTIVE,
    VARIOUS
}

export class QuadTree<T> {

    readonly bounds: Rectangle;

    active: ActiveState;
    data: T | null;

    /**
     * In general, qx1y1 is greater than qx0y0
     * 
     * * IF Y is "DOWN":
     * ```
     * +-------------+-------------+
     * | (0,0) qx0y0 | (1,0) qx1y0 |
     * +-------------+-------------+
     * | (0,1) qx0y1 | (1,1) qx1y1 |
     * +-------------+-------------+
     * ```
     * * IF Y is "UP":
     * ```
     * +-------------+-------------+
     * | (0,1) qx0y1 | (1,1) qx1y1 |
     * +-------------+-------------+ 
     * | (0,0) qx0y0 | (1,0) qx1y0 |
     * +-------------+-------------+ 
     * ```
     */
    quads: {
        x0y0: QuadTree<T>;
        x1y0: QuadTree<T>;
        x0y1: QuadTree<T>;
        x1y1: QuadTree<T>;
    } | null;

    constructor(bounds: Rectangle) {

        this.bounds = bounds.copy();


        //this.node = null;
        this.data = null;
        this.active = ActiveState.ACTIVE;
        this.quads = null;

        // {
        //     x0y0: null,
        //     x0y1: null,
        //     x1y0: null,
        //     x1y1: null
        // }
    }

    area = (): number => this.bounds.area(true);

    get hasChildren(): Boolean { return !!this.quads };

    split = (): Boolean => {
        // Note: This assumes a square quad!
        const currentBoundDimension = this.bounds.x1y1.x - this.bounds.x0y0.x;

        if (currentBoundDimension < 1) {
            // Cannot split!
            return false;
        }

        const splitDim = Math.floor(currentBoundDimension / 2);

        let shift = splitDim + 1;
        if (splitDim === 0) {
            shift = 1;
        }

        const shifts = {
            x0y0: new Point.XY(0, 0),
            x0y1: new Point.XY(0, shift),
            x1y0: new Point.XY(shift, 0),
            x1y1: new Point.XY(shift, shift)
        }

        const splitBounds = {
            x0y0: new Shape.Rectangle(
                this.bounds.x0y0,
                new Point.XY(
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

        this.quads = {
            x0y0: new QuadTree(splitBounds.x0y0),
            x0y1: new QuadTree(splitBounds.x0y1),
            x1y0: new QuadTree(splitBounds.x1y0),
            x1y1: new QuadTree(splitBounds.x1y1)
        };

        for (const [key, quad] of Object.entries(this.quads)) {
            quad.data = this.data;
            //TODO
            //quad.SetActive(this.bounds, this.active);
        }
        this.data = null;

        return true;
    }

    SetActive = (bounds: Rectangle, activeState: ActiveState): void => {
        if (bounds.contains(this.bounds)) {
            this.active = activeState;
            return;
        }
        if (bounds.intersects(this.bounds)) {
            this.active = ActiveState.VARIOUS;

            if (!this.hasChildren) {
                const wasSplit = this.split();
                if (!wasSplit) {
                    throw new Error("Unexpected split");
                }
            }

            for (const [key, quad] of Object.entries(this.quads)) {
                quad.SetActive(bounds, activeState);
            }
        }
    }

    /**
     * "Inserts" / "Fills" data into the bounded area
     */
    Set = (bounds: Rectangle, data: T) => {

        if (this.data === data) {
            return;
        }

        // Is this quadtree completely within the bounds

        if (bounds.contains(this.bounds)) {
            this.data = data;
            // this.active = ActiveState.ACTIVE;
            //console.log('set!')

            // No need to have children anymore
            this.quads = null;
            //  {
            //     x0y0: null,
            //     x0y1: null,
            //     x1y0: null,
            //     x1y1: null
            // };

            return;
        }

        // If the bounds intersects this, create quads if necessary and then set each quad

        if (bounds.intersects(this.bounds)) {

            // this.active = ActiveState.VARIOUS;

           
            

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

            //this.data = null;

            // If all children have the same value, set data and remove children

            let allSame = true;
            let quadData;

            if (this.quads.x0y0.data !== null){
                quadData = this.quads.x0y0.data;
                for (const [key, quad] of Object.entries(this.quads)) {
                    if (quad.data !== quadData){
                        allSame = false;
                        break;
                    }
                }
            }   
            
            if (quadData !== null && quadData !== undefined && allSame) {
                this.data = quadData;
                this.quads = null;
            }

            
        }
    }

    Get = (bounds: Shape.Rectangle): T => {
        // recurse through quads to find the data point.

        if (!this.hasChildren && this.bounds.contains(bounds)) {
            return this.data;
        }

        // Find quad
        let containingQuad: QuadTree<T> = null;
        for (const [key, quad] of Object.entries(this.quads)) {
            //console.log(`${key}: ${value}`);
            if (quad.bounds.contains(bounds)) {
                containingQuad = quad;
            }
        }

        if (!containingQuad) {
            return null;
        }

        return containingQuad.Get(bounds);
    }

}

// WIP!
class QuadTreeExpanding<T>{
    static BUFFER = .1; // TODO: This shouldn't be necessary once expansion works
    root: QuadTree<T>;

    constructor(bounds: Rectangle) {

        // Find max offset from 0,0?

        // Maybe make the center of the quadtree the center of the bounds?

        // Actually, just storing an offset at the root would probably be smarter, although harder to debug

        //const center: Point.XY = bounds.center();


        const dimX = bounds.x1y1.x - bounds.x0y0.x;
        const dimY = bounds.x1y1.y - bounds.x0y0.y;
        const maxDim = Math.max(dimX, dimY);

        const offset = Math.ceil(maxDim * QuadTreeExpanding.BUFFER);

        const quadDim = maxDim + 2 * offset;

        // Find a power of 2 higher than the bounds?        
        // Figure out how big the quadtree needs to be (how many levels deep)

        const pow = Math.ceil(Math.log2(quadDim));
        const base2Dimension = Math.pow(2, pow) - 1;
        //const halfBase = base2Dimension / 2;        

        // const x0y0 = new Point.XY(center.x - halfBase, center.y - halfBase);
        // const x1y1 = new Point.XY(center.x + halfBase, center.y + halfBase);       

        const x0y0 = new Point.XY(bounds.x0y0.x - offset, bounds.x0y0.y - offset);
        const x1y1 = new Point.XY(x0y0.x + base2Dimension, x0y0.y + base2Dimension);

        const base2Bounds = new Rectangle(x0y0, x1y1);

        this.root = new QuadTree<T>(base2Bounds);
    }

    // TODO: Make it expand!
    Set = (bounds: Rectangle, data: T) => {

        // while (!this.root.bounds.contains(bounds)) {

        // }


        this.root.Set(bounds, data);
    }
}

