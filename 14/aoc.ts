import { Grid2D, Coor2D } from '../common/grid';

class Sand extends Coor2D {
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
    down() {
        this.y++;
    }
    downLeft() {
        this.down();
        this.x--;
    }
    downRight() {
        this.down();
        this.x++;
    }
}

const parse = (input: String): Grid2D => {
    const grid = new Grid2D();
    const splitToCoors = input
        .split("\n")
        .map(s => s.
            split(" -> ")
            .map(s => {
                const coorParts = s.split(",");
                const coor: Coor2D = {
                    x: parseInt(coorParts[0]),
                    y: parseInt(coorParts[1])
                };
                return coor;
            })
        );

    // Place rock paths
    splitToCoors.forEach(shape => {
        shape.forEach((coor, coorIndex, coorArray) => {
            if (coorIndex === coorArray.length - 1) return;
            const nextCoor = coorArray[coorIndex + 1];

            grid.set(coor, "#");
            grid.set(nextCoor, "#");

            const currentCoor: Coor2D = { x: coor.x, y: coor.y };

            let deltaX = 0;
            let deltaY = 0;

            if (coor.x !== nextCoor.x) {
                deltaX = coor.x < nextCoor.x ? 1 : -1;
            } else if (coor.y !== nextCoor.y) {
                deltaY = coor.y < nextCoor.y ? 1 : -1;
            }

            while (currentCoor.x !== nextCoor.x || currentCoor.y !== nextCoor.y) {
                grid.set(currentCoor, "#");
                currentCoor.x += deltaX;
                currentCoor.y += deltaY;
            }
        });
    });

    return grid;
}

const fall = (grid: Grid2D, sand: Sand): Sand | null => {
    let fallenSand = new Sand(sand.x, sand.y);
    fallenSand.down();
    if (grid.get(fallenSand).value === '.') return fallenSand;

    fallenSand = new Sand(sand.x, sand.y);
    fallenSand.downLeft();
    if (grid.get(fallenSand).value === '.') return fallenSand;

    fallenSand = new Sand(sand.x, sand.y);
    fallenSand.downRight();
    if (grid.get(fallenSand).value === '.') return fallenSand;

    return null;
};

const part1 = (input: string): Number => {
    const grid = parse(input);
    //grid.print(true);

    // "Stack" of sand
    // Records the path of sand as is falls
    // This way, we don't have to calculate the entire path every time.
    const sandStack = [new Sand(500, 0)];
    let sandCount = 0;
    const outOfBounds = grid.bounds.maxY;

    while (true) {
        const sand = sandStack[sandStack.length - 1];
        const nextSand = fall(grid, sand);
        if (!nextSand) {
            grid.set(sand, '#');
            //grid.print(true);
            sandStack.pop();
            sandCount++;
        } else {
            if (nextSand.y > outOfBounds) {
                break; // We're into the void! Solved.
            }
            sandStack.push(nextSand);
        }
    }

    return sandCount;
}

const part2 = (input: string): Number => {
    // Honestly, we could probably save some time by continuing from Part 1

    const grid = parse(input);
    //grid.print(true);

    // "Stack" of sand
    // Records the path of sand as is falls
    // This way, we don't have to calculate the entire path every time.
    const sandStack = [new Sand(500, 0)];
    let sandCount = 0;
    const outOfBounds = grid.bounds.maxY;

    while (sandStack.length) { // The stack length is 0 when we've retraced all the way to the top
        const sand = sandStack[sandStack.length - 1];

        const nextSand = fall(grid, sand);
        if (!nextSand) {
            grid.set(sand, 'o');
            //grid.print(true);
            sandStack.pop();
            sandCount++;
        }
        else if (nextSand.y === outOfBounds + 1) {
            grid.set(nextSand, 'o');
            //grid.print(true);
            sandStack.pop();
            sandCount++;
        }
        else {
            sandStack.push(nextSand);
        }
    }

    return sandCount;
}

export { part1, part2 };
