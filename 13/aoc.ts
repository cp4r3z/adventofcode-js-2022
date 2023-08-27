// class Elf {
//     readonly calories: number;

//     constructor(calorieArray: Array<string>) {
//         this.calories = calorieArray
//             .map(s => parseInt(s))
//             .reduce((prev, cur) => cur + prev, 0);
//     }
// }

// const solve = (input: string): Array<Elf> => {
//     const sanitized = input.replaceAll('\r', '');

//     const elves: Array<Elf> = input
//         .replaceAll('\r', '') // Sanitize input
//         .split('\n\n') // Split into lists of calories
//         .map(e => e.split('\n')) // Convert lists into arrays
//         .map(e => new Elf(e)) // Convert into Elf objects
//         .sort((elfA, elfB) => elfB.calories - elfA.calories) // Descending
//         .slice(0, 3); // Return top 3

//     return elves;
// };

const splitter = (list: string): string[] => {
    if (list.charAt(0) !== '[') {
        throw new Error('Invalid list: does not start with [');
    }

    const outArray = [];
    let bracketDepth = 0;
    let partialList = '';
    list.split('')
        .slice(1, -1) // remove first and last bracket
        .forEach(element => {
            if (element === '[') {
                bracketDepth++;
            }
            else if (element === ']') {
                bracketDepth--;
            }
            else if (element === ',' && bracketDepth === 0) {
                outArray.push(partialList);
                partialList = '';
                return;
            }
            partialList += element;
        });
    outArray.push(partialList); // push last partial
    return outArray;
};

class Item {
    readonly value?: Number;
    readonly children?: Item[];

    constructor(input: string) {

        // Simple Value
        const parseToValue = Number.parseInt(input);
        if (!Number.isNaN(parseToValue)) {
            this.value = parseToValue;
            return;
        }

        // Array / List / Children
        this.children = [];

        if (input.charAt(0) !== '[') {
            throw new Error('Invalid list: does not start with [');
        }

        let bracketDepth = 0;
        let partial = '';

        input.split('')
        .slice(1) // remove first ?
        .forEach(element => {
            if (element === '[') {
                bracketDepth++;
            }
            else if (element === ']') {
                bracketDepth--;
            }
            else if (element === ',' && bracketDepth === 0) {
                this.children.push(new Item(partial));
                partial = '';
                return;
            }
            partial += element;
        });
        this.children.push(new Item(partial)); // push last partial
    }
}

const part1 = (input: string) => {
    const test = splitter(input);
    const test2 = new Item(input);
    console.log('blah');
} //solve(input)[0].calories;
const part2 = (input: string) => { }// solve(input).reduce((prev, cur) => prev + cur.calories, 0);

export { part1, part2, splitter };