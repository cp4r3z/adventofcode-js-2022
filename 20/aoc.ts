enum Operation {
    Divide,
    Minus,
    Multiply,
    Plus
}

const symbolToOperation = (symbol: string): Operation => {
    if (symbol === '/') return Operation.Divide;
    if (symbol === '-') return Operation.Minus;
    if (symbol === '*') return Operation.Multiply
    if (symbol === '+') return Operation.Plus;
    throw new Error('Invalid symbol.')
}

const operate = (number1: number, operation: Operation, number2: number): number => {
    if (operation === Operation.Divide) return number1 / number2;
    if (operation === Operation.Minus) return number1 - number2;
    if (operation === Operation.Multiply) return number1 * number2;
    if (operation === Operation.Plus) return number1 + number2;
    throw new Error('Invalid operate');
}

class Monkey {
    public Name: string = 'nope';
    public Value: number = null;
    public Monkey1: Monkey = null;
    public Monkey2: Monkey = null;
    public Operation: Operation = null;
}

let rootIndex = 0;
let humnIndex = 0;

const parse = (input: string): Monkey[] => {
    const lines = input.split("\n");

    const re = /(\w+): (\w+).?([\+\-\/\*])?.?(\w+)?/;
    const names = []; // For reference
    const monkeys: Monkey[] = lines.map(s => {
        const matches = s.match(re);
        const name = matches[1];
        names.push(name);
        const monkey = new Monkey();
        monkey.Name = name;
        return monkey;
    });

    lines.forEach((s, i) => {
        const monkey = monkeys[i];
        if (monkey.Name === 'root') {
            rootIndex = i;
        }
        if (monkey.Name === 'humn') {
            humnIndex = i;
        }
        const matches = s.match(re);
        const value = parseInt(matches[2]);
        if (Number.isInteger(value)) {
            monkey.Value = value;
            return;
        }
        monkey.Monkey1 = monkeys[names.indexOf(matches[2])];
        monkey.Operation = symbolToOperation(matches[3]);
        monkey.Monkey2 = monkeys[names.indexOf(matches[4])];
    });

    return monkeys;
}

const yell = (monkey: Monkey): number => {
    if (monkey.Value) return monkey.Value;

    const value1 = yell(monkey.Monkey1);
    const value2 = yell(monkey.Monkey2);
    const value = operate(value1, monkey.Operation, value2);
    monkey.Value = value;
    return value;
};

const part1 = (input: string): number => {
    const monkeys = parse(input);
    const value = yell(monkeys[rootIndex]);
    return value;
}

const part2 = (input: string): number => {
    // This is pretty much brute force + Excel.
    // Maybe a binary search to converge from a min/max?
    //let humnValue = 3699945358551; // part 2 answer
    let humnValue = 0;
    let equal = false;

    while (!equal) {
        humnValue++;

        const monkeys = parse(input);
        monkeys[humnIndex].Value = humnValue;

        const monkey1 = monkeys[rootIndex].Monkey1;
        const monkey2 = monkeys[rootIndex].Monkey2;
        const value1 = yell(monkey1);
        const value2 = yell(monkey2);
        //console.log(`Try ${humnValue} | ${value1}===${value2}`);
        equal = value1 === value2;
    }

    return humnValue;
}

export { part1, part2 };
