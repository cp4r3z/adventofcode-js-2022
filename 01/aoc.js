const solve = input => {
    var lines = input.split("\n");
    var most = [0, 0, 0]; // 0 = 1st, 1 = 2nd, 2 = 3rd
    var total = 0;

    for (let index = 0; index <= lines.length; index++) { // TODO: We depend on this to go out of index... not good

        const number = parseInt(lines[index]);

        if (Number.isNaN(number)) {
            if (total > most[0]) {
                most.splice(0, 0, total);
                most.pop();
            }
            else if (total > most[1]) {
                most.splice(1, 0, total);
                most.pop();
            }
            else if (total > most[2]) {
                most.splice(2, 0, total);
                most.pop();
            }

            total = 0;
            continue;
        }

        total += number;
    }

    return most;
};

const part1 = input => solve(input)[0];
const part2 = input => solve(input).reduce((prev, cur) => prev + cur, 0);

export { part1, part2 };