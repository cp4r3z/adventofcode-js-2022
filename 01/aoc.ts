class Elf {
    readonly calories: number;

    constructor(calorieArray: Array<string>) {
        this.calories = calorieArray
            .map(s => parseInt(s))
            .reduce((prev, cur) => cur + prev, 0);
    }
}

const solve = (input: string): Array<Elf> => {
    const sanitized = input.replaceAll('\r', '');

    const elves: Array<Elf> = input
        .replaceAll('\r', '') // Sanitize input
        .split('\n\n') // Split into lists of calories
        .map(e => e.split('\n')) // Convert lists into arrays
        .map(e => new Elf(e)) // Convert into Elf objects
        .sort((elfA, elfB) => elfB.calories - elfA.calories) // Descending
        .slice(0, 3); // Return top 3

    return elves;
};

const part1 = (input: string) => solve(input)[0].calories;
const part2 = (input: string) => solve(input).reduce((prev, cur) => prev + cur.calories, 0);

export { part1, part2 };