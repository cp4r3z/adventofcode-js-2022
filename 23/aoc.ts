import { Grid2D, GridOptions } from '../common/grid';
import * as Point from '../common/base/points';
import { Line2D } from '../common/base/lines';

class Elf extends Point.XY {
    public NextMove: Point.XY | null;

    // moveSequence = ['N','S','W','E'];
    FindNextMove(grid: Grid2D, moveSequence: string[]): Point.XY {
        const n = new Point.XY(0, -1);
        const s = new Point.XY(0, +1);
        const w = new Point.XY(-1, 0);
        const e = new Point.XY(+1, 0);
        const nn = grid.getPoint(this.copy().move(n)) === '.';
        const ss = grid.getPoint(this.copy().move(s)) === '.';
        const ww = grid.getPoint(this.copy().move(w)) === '.';
        const ee = grid.getPoint(this.copy().move(e)) === '.';
        const ne = grid.getPoint(this.copy().move(n).move(e)) === '.';
        const nw = grid.getPoint(this.copy().move(n).move(w)) === '.';
        const se = grid.getPoint(this.copy().move(s).move(e)) === '.';
        const sw = grid.getPoint(this.copy().move(s).move(w)) === '.';

        this.NextMove = null;
        if (nn && ss && ww && ee && ne && nw && se && sw) {
            //return this.NextMove;
            return this.copy();
        }

        moveSequence.forEach(moveLetter => {
            if (this.NextMove) {
                return;
            }
            // If there is no Elf in the N, NE, or NW adjacent positions, the Elf proposes moving north one step.
            if (moveLetter === 'N' && nn && ne && nw) {
                this.NextMove = n;
            }
            // If there is no Elf in the S, SE, or SW adjacent positions, the Elf proposes moving south one step.
            else if (moveLetter === 'S' && ss && se && sw) {
                this.NextMove = s;
            }
            // If there is no Elf in the W, NW, or SW adjacent positions, the Elf proposes moving west one step.
            else if (moveLetter === 'W' && ww && nw && sw) {
                this.NextMove = w;
            }
            // If there is no Elf in the E, NE, or SE adjacent positions, the Elf proposes moving east one step. 
            else if (moveLetter === 'E' && ee && ne && se) {
                this.NextMove = e;
            }
        });

        return this.copy().move(this.NextMove);
    }

    Move(grid) {
        if (!this.NextMove) {
            return;
        }
        grid.setPoint(this, '.');
        this.move(this.NextMove);
        this.NextMove = null;
        grid.setPoint(this, '#');
    }

}

const parse = (input: String): { grid: Grid2D, elves: Elf[] } => {
    const gridOptions: GridOptions = {
        defaultValue: '.',
        setOnGet: true
    };
    const grid = new Grid2D(gridOptions);
    const elves = [];
    input
        .split("\n")
        .forEach((line: string, y) => {
            line.split('').forEach((s, x) => {
                if (s !== '#') {
                    return;
                }
                //const key = Grid2D.HashPointToKey
                const elf = new Elf(x, y);
                elves.push(elf);
                grid.setPoint(elf, s);
            });
        });
    return {
        grid, elves
    };
}

const part1 = async (input: string): Promise<number | string> => {
    const { grid, elves } = parse(input);
    // for / while...
    let move = 1;
    let moveSequence = ['N', 'S', 'W', 'E'];
    //console.log(`Initial`);
    //grid.print();
    do {
        const area = grid.getBounds().area(true); // < this is wrong.
        // grid.forEach()
        const moves = new Map<string, Elf>();
        elves.forEach(elf => {
            const nextPoint = elf.FindNextMove(grid, moveSequence);
            const moveKey = Grid2D.HashPointToKey(nextPoint);
            if (moves.has(moveKey)) {
                elf.NextMove = null;
                // But the other elf can't move either
                moves.get(moveKey).NextMove = null; // maybe there's a better way
                return;
            }
            moves.set(moveKey, elf);
        });

        // Now actually perform the moves!
        elves.forEach(elf => {
            elf.Move(grid);
        });

        const first = moveSequence.shift();
        moveSequence.push(first);
        //console.log(`Move ${move}`);
        //grid.print();
        // console.log(grid.hash());
    } while (++move <= 10);

    const bounds = grid.getBounds();
    const area = bounds.area(true);
    const emptyArea = area - elves.length;
    return emptyArea;
}

const part2 = async (input: string): Promise<number | string> => {
    const { grid, elves } = parse(input);
    // for / while...
    let move = 1;
    let moveSequence = ['N', 'S', 'W', 'E'];
    //   console.log(`Initial`);
    //   grid.print();
    let stillDiffusing = true;
    let hash = '';
    do {
        // grid.forEach()
        const moves = new Map<string, Elf>();
        elves.forEach(elf => {
            const nextPoint = elf.FindNextMove(grid, moveSequence);
            const moveKey = Grid2D.HashPointToKey(nextPoint);
            if (moves.has(moveKey)) {
                elf.NextMove = null;
                // But the other elf can't move either
                moves.get(moveKey).NextMove = null; // maybe there's a better way
                return;
            }
            moves.set(moveKey, elf);
        });

        // Now actually perform the moves!
        elves.forEach(elf => {
            elf.Move(grid);
        });

        const first = moveSequence.shift();
        moveSequence.push(first);
        //   console.log(`Move ${move}`);
        //  grid.print();
        // console.log(grid.hash());
        const afterhash = grid.hash();
        if (hash === afterhash) {
            stillDiffusing = false;
        }
        else {
            hash = afterhash;
        }
        ++move;
    } while (stillDiffusing);

    return move - 1;
}

export { part1, part2 };
