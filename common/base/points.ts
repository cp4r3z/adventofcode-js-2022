interface IPointFunctions { copy:Function};
interface IPoint1D { x: number };
interface IPoint2D { x: number, y: number };
interface IPoint3D { x: number, y: number, z: number };

export class Point1D implements IPoint1D, IPointFunctions {
    x: number;
    
    constructor(x?: number) {
        this.x = x ? x : 0;        
    }

    public copy = () => new Point1D(this.x);
}

export class Point2D implements IPoint2D, IPointFunctions {
    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    copy = () => new Point2D(this.x, this.y);
}

class Point2DMap extends Map {
    constructor(x?: number, y?: number) {
        super();
        this.set('x', x ? x : 0);
        this.set('y', y ? y : 0);
    }
}
