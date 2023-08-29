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

enum Comparison {
    Less,
    Equal,
    Greater
}

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
            .slice(1) // remove first bracket
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

        // Push last partial
        partial = partial.slice(0, -1); // remove last bracket
        if (partial !== '') {
            this.children.push(new Item(partial));
        }
    }

    Compare(other: Item): Comparison {

        if (this.value && other.value) {
            if (this.value > other.value) {
                return Comparison.Greater;
            }
            else if (this.value < other.value) {
                return Comparison.Less;
            }
            else {
                return Comparison.Equal;
            }
        }

        let thisItem: Item = this;
        let otherItem: Item = other;

        if (this.value) {
            thisItem = new Item(`[${this.value}]`);
        }
        if (other.value) {
            otherItem = new Item(`[${other.value}]`);
        }

        // So I think this is kinda stupid... Remove outside brackets, split(','), repeat

        let index = 0;

        while (thisItem.children[index] && otherItem.children[index]) {
            const comparison = thisItem.children[index].Compare(otherItem.children[index]);
            if (comparison !== Comparison.Equal) {
                return comparison;
            }
            index++;
        }

        if (!thisItem.children[index]) { return Comparison.Less; }
        if (!otherItem.children[index]) { return Comparison.Greater; }

        return Comparison.Equal;

        throw new Error('should not get here');
    }
}

const solve = (input: string): Number => {

    const pairs = input
        .trim()
        .replaceAll('\r', '') // Sanitize input
        .split('\n\n') // Split into lists of calories
        .map(e => e.split('\n')) // Convert lists into arrays

    pairs.forEach((pair, index) => {
        const item0 = new Item(pair[0]);
        const item1 = new Item(pair[1]);

        const comparison = item0.Compare(item1);
        const isRightOrder = comparison === Comparison.Less;
        console.log(isRightOrder);
    });
    return 0;


}

const part1 = (input: string) => {


    const result = solve(input);

    //const test = splitter(input);
    //const test2 = new Item(input);
    //console.log('blah');
    return result;
} //solve(input)[0].calories;
const part2 = (input: string) => { }// solve(input).reduce((prev, cur) => prev + cur.calories, 0);

export { part1, part2 };
