import { Grid2D, Coor2D } from '../common/grid';

// class Sand extends Coor2D {
//     constructor(x: number, y: number) {
//         super();
//         this.x = x;
//         this.y = y;
//     }
//     down() {
//         this.y++;
//     }
//     downLeft() {
//         this.down();
//         this.x--;
//     }
//     downRight() {
//         this.down();
//         this.x++;
//     }
// }
const createSensorRange = (n) => {
    const range = [];
    for (let x = -n; x <= n; x++) {
        for (let y = -n; y <= n; y++) {
            if (Math.abs(x) + Math.abs(y) <= n) {
                range.push({ x, y });
            }
        }
    }
    return range;
}

const parse = (input: String): Grid2D => {

    // Sensor at x=2, y=18: closest beacon is at x=-2, y=15    

    const grid = new Grid2D();

    const splitToCoors = input
        .split("\n")
        .forEach(s => {
            const matches = s.match(/([-\d]+)/g);
            const coorSensor = {
                x: parseInt(matches[0]),
                y: parseInt(matches[1])
            };

            const beaconSensor = {
                x: parseInt(matches[2]),
                y: parseInt(matches[3])
            };

            const distance = Math.abs(beaconSensor.x - coorSensor.x) + Math.abs(beaconSensor.y - coorSensor.y);
            const range = createSensorRange(distance);

            range.forEach(_xy => {
                const xy = {
                    x: _xy.x + coorSensor.x,
                    y: _xy.y + coorSensor.y
                }
                const gridXY = grid.get(xy);
                if (gridXY.value !== "B" && gridXY.value !== "S") {
                    grid.set(xy, "#");
                }
            });

            grid.set(beaconSensor, "B");
            grid.set(coorSensor, "S");
        });

    return grid;
}

// const fall = (grid: Grid2D, sand: Sand): Sand | null => {
//     let fallenSand = new Sand(sand.x, sand.y);
//     fallenSand.down();
//     if (grid.get(fallenSand).value === '.') return fallenSand;

//     fallenSand = new Sand(sand.x, sand.y);
//     fallenSand.downLeft();
//     if (grid.get(fallenSand).value === '.') return fallenSand;

//     fallenSand = new Sand(sand.x, sand.y);
//     fallenSand.downRight();
//     if (grid.get(fallenSand).value === '.') return fallenSand;

//     return null;
// };

const countUnscanned = (grid: Grid2D, y) => {
    let count = 0;
    for (let x = grid.bounds.minX; x <= grid.bounds.maxX; x++) {
        const value = grid.get({ x, y }).value;
        if (value === '#') count++;
    }
    return count;
}

const part1 = (input: string, row: number): Number => {
    const range = createSensorRange(1);
    const grid = parse(input);
    grid.print(true);
    const solution = countUnscanned(grid,row);
    return solution;
}

const part2 = (input: string): Number => {
    // Honestly, we could probably save some time by continuing from Part 1

    return 0;
}

export { part1, part2 };
