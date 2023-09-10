

interface ICoor2D { x: number, y: number };

class Coor2D implements ICoor2D {
    static Copy = (source: ICoor2D): ICoor2D => new Coor2D(source.x, source.y);

    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    //copy = () => new Coor2D(this.x, this.y); // Consider making this static?    

    
}

// type Rect = {

// }

class Rect {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    constructor() {
        this.maxX = this.maxY = this.minX = this.minY = null;
    }
}

//type GridState = Coor2D & Rect;

// class Grid2D {
//     grid: Object;

//     constructor() {
//     }
// }

//type Grid2D = Map<Coor2D, string>;

type GridValue = {
    value: string;
    x: number;
    y: number;
}

class Grid2D {
    grid: Object;
    bounds: Rect;
    readonly setOnGet: Boolean;
    defaultValue: string;

    constructor() {
        //this.grid = Object.assign({}, gridState.);
        this.grid = new Object();
        this.bounds = new Rect();
        this.setOnGet = true;
        this.defaultValue = "."
    }

    static IndexesToKey = (coor: ICoor2D): string => `X${coor.x}Y${coor.y}`;

    get = (key: ICoor2D): GridValue | null => {
        // Create a hash/key
        const hash = Grid2D.IndexesToKey(key);
        if (typeof (this.grid[hash]) === 'undefined') {

            if (this.setOnGet) {
                // Set it with the default value
                this.set(key, this.defaultValue);
            } else {
                return null;
            }
        }
        return this.grid[hash];
    }

    set = (key: ICoor2D, value: string): void => {
        // Keep record of the overall dimensions
        if (this.bounds.minX === null || key.x < this.bounds.minX) this.bounds.minX = key.x;
        if (this.bounds.maxX === null || key.x > this.bounds.maxX) this.bounds.maxX = key.x;
        if (this.bounds.minY === null || key.y < this.bounds.minY) this.bounds.minY = key.y;
        if (this.bounds.maxY === null || key.y > this.bounds.maxY) this.bounds.maxY = key.y;

        const hash = Grid2D.IndexesToKey(key);
        this.grid[hash] = {
            value,
            x: key.x,
            y: key.y
        };
    }

    print = (yDown = false) => {
        if (yDown) {
            for (let y = this.bounds.minY; y <= this.bounds.maxY; y++) {
                let line = '';
                for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                    //const test = get(x,y)
                    line += this.get({ x, y }).value;
                }
                console.log(line);
            }
        } else {
            for (let y = this.bounds.maxY; y >= this.bounds.minY; y--) {
                let line = '';
                for (let x = this.bounds.minX; x <= this.bounds.maxX; x++) {
                    //const test = get(x,y)
                    line += this.get({ x, y }).value;
                }
                console.log(line);
            }
        }
    }

}


export { Grid2D, Coor2D };