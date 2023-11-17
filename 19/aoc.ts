const parse = (input: string): number[] => {
    return input
        .split("\n")
        .map(s => parseInt(s));
}

class EncryptedNumber {
    public Next: EncryptedNumber;
    public Prev: EncryptedNumber;
    public Value: number;

    constructor(number: number) {
        this.Value = number;
        this.Next = null;
        this.Prev = null;
    }
}

class EncryptedFile {
    private _encrypted: EncryptedNumber[];
    private _zeroIndex: number;
    private _length: number;

    constructor(input: string, multiplier: number = 1) {
        this._zeroIndex = 0;
        this._encrypted = parse(input).map((number, i) => {
            if (number === 0) this._zeroIndex = i;
            return new EncryptedNumber(number * multiplier);
        });
        this._length = this._encrypted.length;

        this._encrypted.forEach((n: EncryptedNumber, i) => {
            let iNext = i + 1;
            if (iNext > this._length - 1) iNext = 0;
            n.Next = this._encrypted[iNext];
            let iPrev = i - 1;
            if (iPrev < 0) iPrev = this._length - 1;
            n.Prev = this._encrypted[iPrev];
        });
    }

    Mix(): void {
        this._encrypted.forEach(n => {
            if (n.Value === 0) return;
            const shift = n.Value % (this._length - 1); // Minus 1 because n gets removed
            let shiftAbs = Math.abs(shift);
            const sign = Math.sign(shift);
            if (sign < 0) shiftAbs++; // In the minus direction, we have to go one extra

            // Remove n by joining Prev and Next
            n.Prev.Next = n.Next;
            n.Next.Prev = n.Prev;

            let nextPos = n;
            // Find next position
            let shifted = 0
            while (shifted < shiftAbs) {
                nextPos = sign > 0 ? nextPos.Next : nextPos.Prev;
                shifted++;
            }
            // ok, now splice in nextPos
            const savedNext = nextPos.Next;
            nextPos.Next = n;
            savedNext.Prev = n;
            n.Prev = nextPos;
            n.Next = savedNext;

            //this.Print();
        });
    }

    Sum(): number {
        const mod1000 = 1000 % this._length;
        const mod2000 = 2000 % this._length;
        const mod3000 = 3000 % this._length;

        let cx = null;
        let cy = null;
        let cz = null;

        let nmod = this._encrypted[this._zeroIndex];
        let m = 0;
        while (!(cx && cy && cz)) {
            if (m === mod1000) {
                cx = nmod.Value;
            } else if (m === mod2000) {
                cy = nmod.Value;
            } else if (m === mod3000) {
                cz = nmod.Value;
            }
            nmod = nmod.Next;
            m++;
        }

        const sum = cx + cy + cz;
        return sum;
    }

    Print() {
        let printed = 0;

        const printable = [];
        let n = this._encrypted[0];
        while (printed < this._encrypted.length) {
            if (n == null) {
                console.error('why?')
            }
            printable.push(n.Value);
            n = n.Next;
            printed++;
        }
        console.log(printable.join(', '));
    }
}


const part1 = (input: string): number => {
    const encrypted = new EncryptedFile(input);
    encrypted.Mix();
    return encrypted.Sum();
}

const part2 = (input: string): number => {
    const encrypted = new EncryptedFile(input, 811589153);
    for (let i = 0; i < 10; i++) {
        //encrypted.Print();
        encrypted.Mix();
    }

    return encrypted.Sum();
}

export { part1, part2 };
