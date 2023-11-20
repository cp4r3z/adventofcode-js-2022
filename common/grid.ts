import * as Points from "./base/points";
import * as Shapes from "./base/shapes";

export type GridOptions = {
    setOnGet: boolean,
    defaultValue: any
}

export class Grid2D extends Map<string, any>{
    static HashPointToKey = (p: Points.IPoint2D): string => `X${p.x}Y${p.y}`; // maybe do some validation?
    static HashXYToKey = (x: number, y: number): string => `X${x}Y${y}`;

    private bounds: Shapes.Rectangle = null;

    private readonly options: GridOptions = {
        setOnGet: true,
        defaultValue: ' ' // or null?
    }

    constructor(options?: GridOptions) {
        super();
        if (options) this.options = options;
    }

    // TODO: delete, has

    getPoint = (point: Points.IPoint2D): any => {
        const hash: string = Grid2D.HashPointToKey(point);

        let value: any = this.get(hash);

        if (typeof (value) === 'undefined') {
            value = null;
            if (this.options.setOnGet) {
                value = this.options.defaultValue;
                this.set(hash, this.options.defaultValue);
            }
        }
        return value;
    }

    setPoint = (point: Points.IPoint2D, value: any): void => {
        if (!this.bounds) {
            // Should only happen once
            this.bounds = new Shapes.Rectangle(point, point);
        }

        const hash: string = Grid2D.HashPointToKey(point);

        // Keep record of the overall dimensions
        // I wonder if this should be a special kind of shape!
        if (point.x < this.bounds.minX) {
            this.bounds = new Shapes.Rectangle(new Points.XY(point.x, this.bounds.x0y0.y), this.bounds.x1y1);
        }
        else if (point.x > this.bounds.maxX) {
            this.bounds = new Shapes.Rectangle(this.bounds.x0y0, new Points.XY(point.x, this.bounds.x1y1.y));
        }
        if (point.y < this.bounds.minY) {
            this.bounds = new Shapes.Rectangle(new Points.XY(this.bounds.x0y0.x, point.y), this.bounds.x1y1);
        }
        else if (point.y > this.bounds.maxY) {
            this.bounds = new Shapes.Rectangle(this.bounds.x0y0, new Points.XY(this.bounds.x1y1.x, point.y));
        }

        this.set(hash, value);
    }

    getBounds = ()=>this.bounds;

    print = (yDown = true) => {
        if (yDown) { // TODO: DRY this up
            for (let y = this.bounds.minY; y <= this.bounds.maxY; y++) {
                let line = '';
                for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                    const key = Grid2D.HashXYToKey(x,y);
                    let value = this.get(key);
                    if (typeof (value) === 'undefined') {
                        value = null;
                        if (this.options.setOnGet) {
                            value = this.options.defaultValue;
                            this.set(key, this.options.defaultValue);
                        }
                    }
                    line += value;
                }
                console.log(line);
            }
        } else {
            for (let y = this.bounds.maxY; y >= this.bounds.minY; y--) {
                let line = '';
                for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                    const key = Grid2D.HashXYToKey(x,y);
                    let value = this.get(key);
                    if (typeof (value) === 'undefined') {
                        value = null;
                        if (this.options.setOnGet) {
                            value = this.options.defaultValue;
                            this.set(key, this.options.defaultValue);
                        }
                    }
                    line += value;
                }
                console.log(line);
            }
        }
    }
}

export class Grid3D extends Map<string, any>{
    static HashPointToKey = (p: Points.IPoint3D): string => `X${p.x}Y${p.y}Z${p.z}`; // maybe do some validation?
    static HashXYToKey = (x: number, y: number, z: number): string => `X${x}Y${y}Z${z}`;
    static HashToPoint = (h: string): Points.IPoint3D => {
        const matches = h.match(/(-?\d+)/g);
        return new Points.XYZ(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]));
    }

    public Bounds: Shapes.RectangularPrismBounds = null;

    private readonly options: GridOptions = {
        setOnGet: true,
        defaultValue: ' ' // or null?
    }

    constructor(options?: GridOptions) {
        super();
        if (options) this.options = options;
    }

    // TODO: delete, has

    getPoint = (point: Points.IPoint3D): any => {
        const hash: string = Grid3D.HashPointToKey(point);

        let value: any = this.get(hash);

        if (typeof (value) === 'undefined') {
            value = null;
            if (this.options.setOnGet) {
                value = this.options.defaultValue;
                this.set(hash, this.options.defaultValue);
            }
        }
        return value;
    }

    setPoint = (point: Points.IPoint3D, value: any): void => {
        if (!this.Bounds) {
            // Should only happen once
            this.Bounds = new Shapes.RectangularPrismBounds(point, point);
        }

        const hash: string = Grid3D.HashPointToKey(point);
        this.set(hash, value);
        this.Bounds.Expand(point);
    }

    //TODO: Print!
}