//import './aoc.extensions';
import { Grid2D, Coor2D } from '../common/grid';


// enum Comparison {
//     Less = -1,
//     Equal = 0,
//     Greater = 1
// }

// class Item {
//     readonly value?: Number;
//     readonly children?: Item[];
//     readonly originalString: String;

//     constructor(input: string) {
//         // Store Original
//         this.originalString = input

//         // Simple Value
//         const parseToValue = Number.parseInt(input);
//         if (!Number.isNaN(parseToValue)) {
//             this.value = parseToValue;
//             return;
//         }

//         if (input === '') {
//             this.value = -1;
//             return;
//         }

//         // Array / List / Children
//         this.children = [];
//         const topLevels = input.splitTopLevel('[]', ',');
//         this.children = topLevels.map(s => new Item(s));
//     }

//     HasValue(): Boolean {
//         return !this.children;
//     }

//     Compare(other: Item): Comparison {

//         if (this.HasValue() && other.HasValue()) {
//             if (this.value > other.value) {
//                 return Comparison.Greater;
//             }
//             else if (this.value < other.value) {
//                 return Comparison.Less;
//             }
//             else {
//                 return Comparison.Equal;
//             }
//         }

//         let thisItem: Item = this;
//         let otherItem: Item = other;

//         if (this.HasValue()) {
//             thisItem = new Item(`[${this.value}]`);
//         }
//         if (other.HasValue()) {
//             otherItem = new Item(`[${other.value}]`);
//         }

//         let index = 0;

//         while (thisItem.children[index] && otherItem.children[index]) {
//             const comparison = thisItem.children[index].Compare(otherItem.children[index]);
//             if (comparison !== Comparison.Equal) {
//                 return comparison;
//             }
//             index++;
//         }

//         if (!thisItem.children[index] && otherItem.children[index]) {
//             return Comparison.Less;
//         }
//         if (thisItem.children[index] && !otherItem.children[index]) {
//             return Comparison.Greater;
//         }

//         return Comparison.Equal;
//     }
// }

function parse(input: String): Grid2D {
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

function placeRockPaths(grid: Grid2D): void {

}

const part1 = (input: string): Number => {
    const grid = parse(input);

    //const testGrid = new Grid({});
    // const testGrid2d = new Grid2D();
    // const c: Coor2D = [1, 2];

    // testGrid2d.set(c, "#");
    //testGrid2d.set([0, 1], ".");

    // const pairs = input
    //     .trim()
    //     .replaceAll('\r', '') // Sanitize input
    //     .split('\n\n')
    //     .map(e => e.split('\n')) // Convert lists into arrays

    // let total = 0;

    // pairs.forEach((pair, index) => {
    //     const item0 = new Item(pair[0]);
    //     const item1 = new Item(pair[1]);

    //     const comparison = item0.Compare(item1);
    //     const isRightOrder = comparison === Comparison.Less;
    //     if (isRightOrder) {
    //         total += (index + 1);
    //     }
    // });

    return 0;
}

const part2 = (input: string): Number => {
    return 0;
}

export { part1, part2 };
