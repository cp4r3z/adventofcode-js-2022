import { Grid2D, Coor2D } from '../common/grid';
import * as Point from '../common/base/points';
import * as Shape from '../common/base/shapes';

import { QuadTree, Base2Rect, QuadTreeExpanding } from '../common/quadtree';

class Beacon extends Point.XY {
    //readonly sensor // not really necessary, but we could create a back-link to the sensor
}

class Sensor extends Point.XY {
    readonly beacon: Beacon;

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
     * @returns xy
     */
    static UV2XY = (uv: Point.XY): Point.XY => {
        const u = uv.x;
        const v = uv.y;
        const y = (u + v) / 2; // This should ALWAYS be an int. Check?
        const x = u - y;
        return new Point.XY(x, y);
    }
}


const part2 = (input: string, row: number): Number => {

    // Yeah, honestly this is sounding more and more like I should have used a quadtree :-(

    //const bounds = new Bounds(new Point.XY(0, 0), new Point.XY(4, 4));

    // Figure out how big the quadtree needs to be (how many levels deep)
    
    // const pow = Math.ceil(Math.log2(4e6));

    // const bounds = new Bounds(new Point.XY(0, 0), new Point.XY(Math.pow(2, pow) -1, Math.pow(2, pow) -1));

    // const Q = new QuadTree<Boolean>(bounds);

    // Q.Set(new Bounds(new Point.XY(0, 0), new Point.XY(0, 3)), true);

    // const test1 = Q.Get(new Point.XY(0,1));
    // const test2 = Q.Get(new Point.XY(1,1));

    const bounds1 = new Base2Rect(new Point.XY(0, 0), new Point.XY(3, 3));
    const Q1 = new QuadTreeExpanding<Boolean>(bounds1);
    Q1.Set(new Base2Rect(new Point.XY(0, 0), new Point.XY(0, 2)), true); // should be 3 places


    //const bounds2 = new Bounds(new Point.XY(0, 0), new Point.XY(4e6, 4e6)); // Not a power of 2
    const bounds2 = new Base2Rect(
        Transformer.XY2UV(new Point.XY(-2, -2)),
        Transformer.XY2UV(new Point.XY(25, 22))
    ); // Not a power of 2

    const Q2 = new QuadTreeExpanding<Boolean>(bounds2);

    // Feed in top and bottom of the sensor (in x,y)
    // top (8, -2), bottom (8, -16)

    const top = new Point.XY(8, -2);
    const bot = new Point.XY(8, 16);
    const sensor = new Base2Rect(Transformer.XY2UV(top), Transformer.XY2UV(bot));

    Q2.Set(sensor, true); // we need a get

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

    return 0;
}

export { part1, part2 };
