class Elf {
    readonly calories: number;

    constructor(calorieArray: Array<string>) {
        this.calories = calorieArray.map(s => parseInt(s))
            .reduce((prev, cur) => cur + prev, 0);
    }
}

const solve = (input: string): Array<Elf> => {  
    const sanitized = input.replaceAll('\r', '');

    const groups = sanitized.split('\n\n');
    const elves: Array<Elf> = sanitized
        .split('\n\n')
        .map(e => e.split('\n'))
        .map(e => new Elf(e))
        .sort((elfA, elfB) => elfB.calories - elfA.calories)
        .slice(0, 3); // just return top 3

    return elves;
};

const part1 = input => solve(input)[0].calories;
const part2 = input => solve(input).reduce((prev, cur) => prev + cur.calories, 0);

export { part1, part2 };