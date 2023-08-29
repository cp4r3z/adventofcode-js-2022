import './aoc.extensions';

enum Comparison {
    Less = -1,
    Equal = 0,
    Greater = 1
}

class Item {
    readonly value?: Number;
    readonly children?: Item[];
    readonly originalString: String;

    constructor(input: string) {
        // Store Original
        this.originalString = input

        // Simple Value
        const parseToValue = Number.parseInt(input);
        if (!Number.isNaN(parseToValue)) {
            this.value = parseToValue;
            return;
        }

        if (input === '') {
            this.value = -1;
            return;
        }

        // Array / List / Children
        this.children = [];
        const topLevels = input.splitTopLevel('[]', ',');
        this.children = topLevels.map(s => new Item(s));
    }

    HasValue(): Boolean {
        return !this.children;
    }

    Compare(other: Item): Comparison {

        if (this.HasValue() && other.HasValue()) {
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

        if (this.HasValue()) {
            thisItem = new Item(`[${this.value}]`);
        }
        if (other.HasValue()) {
            otherItem = new Item(`[${other.value}]`);
        }

        let index = 0;

        while (thisItem.children[index] && otherItem.children[index]) {
            const comparison = thisItem.children[index].Compare(otherItem.children[index]);
            if (comparison !== Comparison.Equal) {
                return comparison;
            }
            index++;
        }

        if (!thisItem.children[index] && otherItem.children[index]) {
            return Comparison.Less;
        }
        if (thisItem.children[index] && !otherItem.children[index]) {
            return Comparison.Greater;
        }

        return Comparison.Equal;
    }
}

const part1 = (input: string): Number => {
    const pairs = input
        .trim()
        .replaceAll('\r', '') // Sanitize input
        .split('\n\n')
        .map(e => e.split('\n')) // Convert lists into arrays

    let total = 0;

    pairs.forEach((pair, index) => {
        const item0 = new Item(pair[0]);
        const item1 = new Item(pair[1]);

        const comparison = item0.Compare(item1);
        const isRightOrder = comparison === Comparison.Less;
        if (isRightOrder) {
            total += (index + 1);
        }
    });

    return total;
}

const part2 = (input: string) => {
    const lines = input
        .trim()
        .replaceAll('\r', '') // Sanitize input
        .replaceAll('\n\n', '\n')
        .split('\n')
        .concat(['[[2]]', '[[6]]'])
        .map(s => new Item(s));

    const sorted = lines.sort((a, b) => {
        return a.Compare(b);
    });

    // TODO: There is a bug in the Compare code.
    // The following aren't sorted properly:
    // []
    // [[]]
    // [[[]]]
    // We still get a correct answer though.        

    const decode2 = sorted.findIndex(item => {
        return item.originalString === '[[2]]';
    });

    const decode6 = sorted.findIndex(item => {
        return item.originalString === '[[6]]';
    });

    return (decode2 + 1) * (decode6 + 1);
}

export { part1, part2 };
