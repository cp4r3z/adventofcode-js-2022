export interface IPoint { copy: Function, move: Function };
export interface IPoint1D extends IPoint { x: number };
export interface IPoint2D extends IPoint { x: number, y: number };
export interface IPoint3D extends IPoint { x: number, y: number, z: number };

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
    move = (delta: XY | null) => {
        if (delta) {
            this.x += delta.x;
            this.y += delta.y;
        }
        return this;
    }
}

export class XYZ implements IPoint3D {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    copy = () => new XYZ(this.x, this.y, this.z);

    /**
     * AKA "Add"
     */
    move = (delta: XYZ): XYZ => {
        this.x += delta.x;
        this.y += delta.y;
        this.z += delta.z;
        return this;
    }
}

// Interesting... what were we trying to do here?
class Point2DMap extends Map {
    constructor(x?: number, y?: number) {
        super();
        this.set('x', x ? x : 0);
        this.set('y', y ? y : 0);
    }
}
