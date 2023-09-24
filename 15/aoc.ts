import { Grid2D, Coor2D } from '../common/grid';
import * as Point from '../common/base/points';
import { Line2D } from '../common/base/lines';

class Beacon extends Point.XY {
    //readonly sensor // not really necessary, but we could create a back-link to the sensor
}

class Sensor extends Point.XY {
    readonly beacon: Beacon;
    readonly range: number;

    /**
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

const checkPoint = (point: Point.IPoint2D, sensors: Sensor[]) => {
    for (const sensor of sensors) {
        //const range = sensor.range;
        const distance = Math.abs(sensor.x - point.x) + Math.abs(sensor.y - point.y);
        if (distance <= sensor.range) {
            return false;
        }
    }

    return true;
}

const part2 = (input: string, row: number): Number => {
    const sensors = parse(input);

    const lines: Line2D[] = [];

    for (let i = 0; i < sensors.length - 1; i++) {
        const sensorI = sensors[i];
        for (let j = i + 1; j < sensors.length; j++) {
            const sensorJ = sensors[j];

            // Find sensors that have a gap 2 apart
            const ranges = sensorI.range + sensorJ.range;
            const distance = new Point.XY(Math.abs(sensorI.x - sensorJ.x), Math.abs(sensorI.y - sensorJ.y));

            const gap = distance.x + distance.y - ranges;

            if (gap === 2) {
                //console.log(`Comparing ${sensorI.x},${sensorI.y} to ${sensorJ.x},${sensorJ.y}: ${gap}`);

                // Find limiting dimension
                const limiting = distance.x < distance.y ? 'x' : 'y';
                const nonlimiting = distance.x > distance.y ? 'x' : 'y';

                // Get direction
                const dx = sensorI.x < sensorJ.x ? 1 : -1;
                const dy = sensorI.y < sensorJ.y ? 1 : -1;
                const v = new Point.XY(dx, dy);

                // So, the limiting dimension gets full range...

                let p0;
                let p1;
                if (limiting === 'x') {
                    p0 = new Point.XY(sensorI.x, sensorI.y + (sensorI.range + 1) * v.y);
                    p1 = new Point.XY(sensorJ.x, sensorJ.y - (sensorJ.range + 1) * v.y);
                } else {
                    p0 = new Point.XY(sensorI.x + (sensorI.range + 1) * v.x, sensorI.y);
                    p1 = new Point.XY(sensorJ.x - (sensorJ.range + 1) * v.x, sensorJ.y);
                }

                // console.log(`p0: ${p0.x},${p0.y}`);
                // console.log(`p1: ${p1.x},${p1.y}`);

                const line = new Line2D(p0, p1);
                lines.push(line);
            }
        }
    }

    for (let i = 0; i < lines.length - 1; i++) {
        const lineI = lines[i];
        for (let j = i + 1; j < lines.length; j++) {
            const lineJ = lines[j];
            const intersection: Point.IPoint2D = Line2D.Intersects(lineI, lineJ);
            //console.log(`${lineI.toString()}-->${lineJ.toString()} @ ${intersection.x},${intersection.y}`);
        }
    }

    let pointsChecked = 0;
    for (let i = 0; i < lines.length - 1; i++) {
        const lineI = lines[i];
        const dx = lineI._p0.x < lineI._p1.x ? 1 : -1;
        const dy = lineI._p0.y < lineI._p1.y ? 1 : -1;
        const v = new Point.XY(dx, dy);

        let jy = lineI._p0.y;
        for (let jx = lineI._p0.x; jx !== lineI._p1.x; jx += v.x) {

            const jPoint = new Point.XY(jx, jy);

            pointsChecked++;
            if (checkPoint(jPoint, sensors)) {
                return jPoint.x * 4e6 + jPoint.y;
            }

            jy += v.y;
        }
    }

    return 0; // We should not get here;
}

export { part1, part2 };
