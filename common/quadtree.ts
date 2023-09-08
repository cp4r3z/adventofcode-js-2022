// Reference: https://www.geeksforgeeks.org/quad-tree/

import { Coor2D } from "./grid";

class Node<T> {
    data: T;
    coor: Coor2D; // Can this also be generic?

    constructor(_coor: Coor2D, _data: T) {
        this.data = _data;
        this.coor = _coor;
    }

}

type Bounds = { x0y0: Coor2D, x1y1: Coor2D };

class QuadTree<T> {

    node: Node<T> | null; // This is where data is stored
    //coor: Coor2D; // Can this also be generic?

    /**
     * ```
     * x0y0: Top Left
     * x1y1: Bottom Right
     * ```
     */
    bounds: Bounds;

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

    constructor(_bounds: Bounds) {
        this.bounds.x0y0 = _bounds.x0y0;
        this.bounds.x1y1 = _bounds.x1y1;
        this.node = null;
        this.quads = null;
        // this.quads.x0y0 = null;
        // this.quads.x0y1 = null;
        // this.quads.x1y0 = null;
        // this.quads.x1y1 = null;
    }
}

export { QuadTree };