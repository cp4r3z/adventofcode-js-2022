interface IPointFunctions { copy: Function, move: Function };
export interface IPoint1D extends IPointFunctions { x: number };
export interface IPoint2D extends IPointFunctions { x: number, y: number };
export interface IPoint3D extends IPointFunctions { x: number, y: number, z: number };

export class X implements IPoint1D {
    x: number;

    constructor(x?: number) {
        this.x = x ? x : 0;
    }

    copy = () => new X(this.x);
    move = (delta: X) => { this.x += delta.x; }

}

export class XY implements IPoint2D {
    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    copy = () => new XY(this.x, this.y);

    /**
     * AKA "Add"
     */
    move = (delta: XY) => {
        this.x += delta.x;
        this.y += delta.y;
    }
}

class Point2DMap extends Map {
    constructor(x?: number, y?: number) {
        super();
        this.set('x', x ? x : 0);
        this.set('y', y ? y : 0);
    }
}
