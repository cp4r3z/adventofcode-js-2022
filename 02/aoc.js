
const solve = input => {
    var lines = input.replaceAll("\r","").split("\n");

    /**
     * A=Rock
     * B=Papar
     * C=Scissors
     * X=Rock
     * Y=Paper
     * Z=Scissors
     */

    const values = {
        "A X": 1 + 3,
        "B X": 1 + 0,
        "C X": 1 + 6,
        "A Y": 2 + 6,
        "B Y": 2 + 3,
        "C Y": 2 + 0,
        "A Z": 3 + 0,
        "B Z": 3 + 6,
        "C Z": 3 + 3
    };

    const values2 = {
        //Lose
        "A X": 0 + 3, //C
        "B X": 0 + 1, //A
        "C X": 0 + 2, //B
        //Draw
        "A Y": 3 + 1, //A Rock
        "B Y": 3 + 2, //B Paper
        "C Y": 3 + 3, //C Scissor
        //Win
        "A Z": 6 + 2, //B
        "B Z": 6 + 3, //C
        "C Z": 6 + 1  //A
    };

    let total = 0;
    let total2 = 0;
    for (let index = 0; index < lines.length; index++) {
        var line = lines[index];
        if (line === '') { continue; }

        //var moves = lines[index].split(" ");
        //var player1 = moves[0];
        //var player2 = moves[1];
        var score = values[line];
        var score2 = values2[line];
        total += score;
        total2 += score2;
    }
    
    return {
        part1: total,
        part2: total2
    };
};


const part1 = input => solve(input).part1;
const part2 = input => solve(input).part2;

export { part1, part2 };