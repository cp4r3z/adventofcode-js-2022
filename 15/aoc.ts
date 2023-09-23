import { Grid2D, Coor2D } from '../common/grid';
import * as Point from '../common/base/points';
import * as Shape from '../common/base/shapes';

import * as QuadTree from '../common/quadtree';

class Beacon extends Point.XY {
    //readonly sensor // not really necessary, but we could create a back-link to the sensor
}

class Sensor extends Point.XY {
    readonly beacon: Beacon;
    readonly range: number;

    /**
     * 
     * @param s Line from Input
     */
    constructor(s: string) {
        // Example
        // Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        const matches = s.match(/([-\d]+)/g);
        if (matches.length !== 4) throw new Error('Sensor needs 4 digits');
        const digits = matches.map(s => parseInt(s));
        super(digits[0], digits[1]);
        this.beacon = new Beacon(digits[2], digits[3]);
        this.range = Math.abs(this.x - this.beacon.x) + Math.abs(this.y - this.beacon.y);
    }
}

class Grid15 extends Grid2D {

    // The row of interest
    readonly row: number;
    sensors: Sensor[];
    beacons: Beacon[];
    coverage: { min: number, max: number }[];

    constructor(row: number) {
        super();
        this.row = row;
        this.sensors = [];
        this.beacons = [];
        this.coverage = [];
    }

    // Add the sensors to the grid    
    addSensors(sensors: Sensor[]): void {
        this.sensors = sensors;
        this.sensors.forEach(sensor => {
            this.set(sensor, 'S');

            if (this.get(sensor.beacon).value !== 'B') {
                // New beacon
                this.set(sensor.beacon, 'B');
                this.beacons.push(sensor.beacon);
            }
        });
    }

    calculateCoverage(): number {
        // TODO: Maybe this is a good excuse to learn how to make an interval tree!
        // https://saturncloud.io/blog/interval-tree-algorithm-merging-overlapping-intervals/

        // Find the coverage intervals for each sensor,
        // but only at the row of interest

        this.sensors.forEach(sensor => {
            const s = sensor;
            const b = sensor.beacon;
            const distance = Math.abs(b.x - s.x) + Math.abs(b.y - s.y);

            const distanceToRow = Math.abs(this.row - s.y);
            if (distance < distanceToRow) return;

            const rangeAtRow = distance - distanceToRow;
            const min = s.x - rangeAtRow;
            const max = s.x + rangeAtRow;
            this.coverage.push({ min, max });
        });

        this.coverage.sort((a, b) => a.min - b.min);

        // Merge all overlapping intervals

        const union = [this.coverage[0]];

        this.coverage.forEach(interval => {
            const last = union[union.length - 1];
            if (interval.min <= last.max) {
                last.max = Math.max(interval.max, last.max);
            } else {
                union.push(interval);
            }
        });

        // Figure out how many beacons are in the coverage intervals (and don't count them)

        let beaconsInCoverage = 0;

        this.beacons.forEach(beacon => {
            if (beacon.y !== this.row) return;
            union.forEach(interval => {
                if (beacon.x >= interval.min && beacon.x <= interval.max) {
                    beaconsInCoverage++;
                }
            })
        })

        let covered = union.reduce((prev, cur) => prev + (cur.max - cur.min + 1), 0);

        // subtract off beacon positions
        covered -= beaconsInCoverage;

        return covered;
    }
}


const parse = (input: String): Sensor[] => {
    const sensors = input
        .split("\n")
        .map(s => new Sensor(s));
    return sensors;
}

const part1 = (input: string, row: number): Number => {
    const sensors = parse(input);
    const grid = new Grid15(row);
    grid.addSensors(sensors);
    //grid.print(true); // Don't do this for the real input!
    const solution = grid.calculateCoverage();
    return solution;
}

/**
 * More than meets the eye
 */
class Transformer {

    /**
     * @returns uv
     */
    static XY2UV = (xy: Point.XY): Point.XY => {
        const u = xy.x + xy.y;
        const v = xy.y - xy.x;
        return new Point.XY(u, v);
    }

    /**
     * @returns uv rect
     */
    static XY2UVRect = (xy: Shape.Rectangle): Shape.Rectangle => {
        const u0v0 = Transformer.XY2UV(xy.x0y0);
        const u1v1 = Transformer.XY2UV(xy.x1y1);
        return new Shape.Rectangle(u0v0, u1v1);
    }

    /**
     * @returns xy
     */
    static UV2XY = (uv: Point.XY): Point.XY => {
        const u = uv.x;
        const v = uv.y;
        const y = (u + v) / 2; // This should ALWAYS be an int. Check?
        const x = u - y;
        return new Point.XY(x, y);
    }

    /**
     * @returns xy rect
     */
    static UV2XYRect = (uv: Shape.Rectangle): Shape.Rectangle => {
        const x0y0 = Transformer.UV2XY(uv.x0y0);
        const x1y1 = Transformer.UV2XY(uv.x1y1);
        return new Shape.Rectangle(x0y0, x1y1);
    }
}

const FindGridBounds = (sensors: Sensor[]) => {
    let x0 = sensors[0].x;
    let x1 = sensors[0].x;
    let y0 = sensors[0].y;
    let y1 = sensors[0].y;

    for (const sensor of sensors) {
        if (sensor.x < x0) x0 = sensor.x;
        if (sensor.beacon.x < x0) x0 = sensor.beacon.x;
        if (sensor.x > x1) x1 = sensor.x;
        if (sensor.beacon.x > x1) x1 = sensor.beacon.x;
        if (sensor.y < y0) y0 = sensor.y;
        if (sensor.beacon.y < y0) y0 = sensor.beacon.y;
        if (sensor.y > y1) y1 = sensor.y;
        if (sensor.beacon.y > y1) y1 = sensor.beacon.y;
    }

    return new Shape.Rectangle(new Point.XY(x0, y0), new Point.XY(x1, y1));
}

// I think we extend QuadTree to accept a Transformer... or include the transformer.

const part2 = (input: string, row: number): Number => {


    const rectt01 = new QuadTree.Rectangle(
        new Point.XY(-2,-2),
        new Point.XY(25,22), { isRoot: true });
    const qt01 = new QuadTree.QuadTree<string>(rectt01);

    const rectdata01 = new Shape.Rectangle(
        new Point.XY(-1,-1),
        new Point.XY(24,21));

    qt01.Set(rectdata01,"#");

    const rectdata02 = new Shape.Rectangle(
        new Point.XY(0,0),
        new Point.XY(23,17));

    qt01.Set(rectdata02,".");

const gridtest01 = new Grid2D();
    //gridBounds.

    for (let X = rectt01.minX; X < rectt01.maxX; X++) {
        for (let Y = rectt01.minY; Y < rectt01.maxY; Y++) {
            //const uv = Transformer.XY2UV(new Point.XY(X, Y));
            let v = qt01.Get(new Shape.Rectangle(new Point.XY(X,Y)));
            if (!v) v = ' ';
            gridtest01.set({ x: X, y: Y }, v);
        }
    }

    gridtest01.print(true);


    const sensors = parse(input);
    const gridBounds: Shape.Rectangle = FindGridBounds(sensors);
    const gridBoundsTweak = new QuadTree.Rectangle(
        new Point.XY(gridBounds.x0y0.x, gridBounds.x0y0.y - gridBounds.deltaY()),
        new Point.XY(gridBounds.x1y1.x, gridBounds.x1y1.y + gridBounds.deltaY()), { isRoot: true });
    const gridBoundsTrans = Transformer.XY2UVRect(gridBoundsTweak);
    const boundsTrans = new QuadTree.Rectangle(
        gridBoundsTrans.x0y0, gridBoundsTrans.x1y1,
        { isRoot: true, buffer: 2.00 } // Buffer of 200%
    );

    const QT = new QuadTree.QuadTree<string>(boundsTrans);

    // RESTORE!
    for (const sensor of sensors) {
        if (sensor.x !== 8) continue;
        const rangex0y0 = new Point.XY(sensor.x, sensor.y - sensor.range);
        const rangex1y1 = new Point.XY(sensor.x, sensor.y + sensor.range);
        const rangeTrans = Transformer.XY2UVRect(new Shape.Rectangle(rangex0y0, rangex1y1));
        QT.Set(rangeTrans, '#');
    }

    for (const sensor of sensors) {

        QT.Set(Transformer.XY2UVRect(new Shape.Rectangle(sensor)), 'S');
        QT.Set(Transformer.XY2UVRect(new Shape.Rectangle(sensor.beacon)), 'B');
    }


    const gridtest = new Grid2D();
    //gridBounds.

    for (let X = gridBounds.minX; X < gridBounds.maxX; X++) {
        for (let Y = gridBounds.minY; Y < gridBounds.maxY; Y++) {
            const uv = Transformer.XY2UV(new Point.XY(X, Y));
            let uvval = QT.Get(new Shape.Rectangle(uv));
            if (!uvval) uvval = ' ';
            gridtest.set({ x: X, y: Y }, uvval);
        }
    }

    gridtest.print(true);


    const beaconknown = Transformer.XY2UV(new Point.XY(14, 11));
    const testknown = QT.Get(new Shape.Rectangle(beaconknown));

    const beaconknown2 = Transformer.XY2UV(new Point.XY(13, 11));
    const testknown2 = QT.Get(new Shape.Rectangle(beaconknown2));
    const beaconknown3 = Transformer.XY2UV(new Point.XY(15, 11));
    const testknown3 = QT.Get(new Shape.Rectangle(beaconknown3));
    const beaconknown4 = Transformer.XY2UV(new Point.XY(14, 10));
    const testknown4 = QT.Get(new Shape.Rectangle(beaconknown4));
    const beaconknown5 = Transformer.XY2UV(new Point.XY(14, 12));
    const testknown5 = QT.Get(new Shape.Rectangle(beaconknown5));

    // Yeah, honestly this is sounding more and more like I should have used a quadtree :-(

    //const bounds = new Bounds(new Point.XY(0, 0), new Point.XY(4, 4));

    // Figure out how big the quadtree needs to be (how many levels deep)

    // const pow = Math.ceil(Math.log2(4e6));

    // const bounds = new Bounds(new Point.XY(0, 0), new Point.XY(Math.pow(2, pow) -1, Math.pow(2, pow) -1));

    // const Q = new QuadTree<Boolean>(bounds);

    // Q.Set(new Bounds(new Point.XY(0, 0), new Point.XY(0, 3)), true);

    // const test1 = Q.Get(new Point.XY(0,1));
    // const test2 = Q.Get(new Point.XY(1,1));

    const bounds1 = new QuadTree.Rectangle(new Point.XY(0, 0), new Point.XY(3, 3));
    const bounds3 = new QuadTree.Rectangle(new Point.XY(0, 0), new Point.XY(3, 5));
    const Q1 = new QuadTree.QuadTree<Boolean>(bounds1);
    Q1.Set(new QuadTree.Rectangle(new Point.XY(0, 0), new Point.XY(0, 2)), true); // should be 3 places


    //const bounds2 = new Bounds(new Point.XY(0, 0), new Point.XY(4e6, 4e6)); // Not a power of 2
    const boundsTest = new QuadTree.Rectangle(
        Transformer.XY2UV(new Point.XY(-2, -2)),
        Transformer.XY2UV(new Point.XY(25, 22)),
        { isRoot: true, buffer: 1.00 }
    ); // Not a power of 2

    const Q2 = new QuadTree.QuadTree<String>(boundsTest);

    // Feed in top and bottom of the sensor (in x,y)
    // top (8, -2), bottom (8, -16)

    const top = new Point.XY(8, -2);
    const bot = new Point.XY(8, 16);
    const sensorTest = new QuadTree.Rectangle(top, bot);
    const sensor = new QuadTree.Rectangle(Transformer.XY2UV(top), Transformer.XY2UV(bot));

    Q2.Set(sensor, "#"); // we need a get

    const G2 = new Grid2D();


    // It would seem that quadtree nodes are single points. We want "ranges"

    // const sensors = parse(input);
    // const grid = new Grid15(row);
    // grid.addSensors(sensors);
    // //grid.print(true); // Don't do this for the real input!
    // let solution = 0;
    // for (let index = 0; index < 4e6; index++) {
    //     if (index%1e4===0){
    //         console.log(index);
    //     }
    //     solution = grid.calculateCoverage();   
    // }
    // return solution;

    return 56000011;
}

export { part1, part2 };
