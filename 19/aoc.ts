const parse = (input: string): number[] => {
    return input
        .split("\n")
        .map(s => parseInt(s));
}

class EncryptedFile extends Array {

    // private lastIndex;
    // constructor() {
    //     super();
    //     this.lastIndex = this.length - 1;
    // }
    Move(value: number) {
        // console.log(this.join(', '));

        if (value === 0) {
            return;
        }
        const direction = Math.sign(value);

        const lastIndexOriginal = this.length - 1;

        // Remove number
        const currentIndex = this.indexOf(value);
        this.splice(currentIndex, 1);

        const lastIndex = this.length - 1;

        let newIndex = currentIndex + value;

        // while (newIndex > lastIndex) {
        //     newIndex -= (this.length); // -1 because the value is "removed" from the array
        // }
        // while (newIndex < 0) {
        //     newIndex += (this.length); // -1 because the value is "removed" from the array            
        // }

        // let's just figure out mod

        newIndex = newIndex % (this.length);

        if (newIndex < 0) {
            newIndex += this.length;
        }

        if (newIndex === 0) {
            newIndex = lastIndexOriginal;
        } else if (newIndex === lastIndexOriginal) {
            newIndex = 0; // does this happen?
        }

        // if (newIndex === 0 && direction === -1) {
        //     newIndex = lastIndexOriginal;
        // }
        // if (newIndex === lastIndexOriginal && direction === 1) {
        //     newIndex = 0;
        // }


        //newIndex = ((newIndex+1) % this.length) -1;

        if (newIndex < 0) {
            console.error('should not happen!');
        }

        if (newIndex > lastIndexOriginal) {
            console.error('should not happen!');
            //  newIndex = ((newIndex+1) % this.length); //todo: restore this. It's probably faster.
        }

        // Splice in value
        // I'm not sure about performance here. We probably need to do a linked list instead.

        //this.splice(currentIndex, 1);
        this.splice(newIndex, 0, value);
    }
}

const part1old = (input: string): EncryptedNumber => {

    const test = [0, 1, 10, 3, 4, 5, 6];
    const t = new EncryptedFile(...test);

    t.Move(10);

    const initial = parse(input);
    let sorted = [...initial].sort();
    console.log(sorted.join('\n'));
    const work = new EncryptedFile(...initial);

    // Mix
    initial.forEach(value => {
        work.Move(value);
    });

    const zeroIndex = work.indexOf(0);
    const mod1000 = (zeroIndex + 1000) % work.length;
    const mod2000 = (zeroIndex + 2000) % work.length;
    const mod3000 = (zeroIndex + 3000) % work.length;

    // Sum of Grove Coordinates
    const cx = work[mod1000];
    const cy = work[mod2000];
    const cz = work[mod3000];
    //const sum = work[mod1000] + work[mod2000]+ work[mod3000];
    const sum = cx + cy + cz;

    // 1, 2, -3, 4, 0, 3, -2
    return sum; //1306 is too low! // 6006 is too low!
    // we also got -26305, lol
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

const part1 = (input: string): number => {

    let zeroIndex = 0;
    const encrypted = parse(input).map((number, i) => {
        if (number === 0) zeroIndex = i;
        return new EncryptedNumber(number)
    });

    const print = function (encrypted: EncryptedNumber[]) {
        let printed = 0;

        const printable = [];
        let n = encrypted[0];
        while (printed < encrypted.length) {
            printable.push(n.Value);
            n = n.Next;
            printed++;
        }
        // const printable = encrypted.map(n => n.Value).join(', ');
       // console.log(printable.join(', '));
    }
    encrypted.forEach((n: EncryptedNumber, i) => {
        let iNext = i + 1;
        if (iNext > encrypted.length - 1) iNext = 0;
        n.Next = encrypted[iNext];
        let iPrev = i - 1;
        if (iPrev < 0) iPrev = encrypted.length - 1;
        n.Prev = encrypted[iPrev];
    });

 //   print(encrypted);

    const length = encrypted.length;
    //const lm = length-1;

    encrypted.forEach(n => {
        if (n.Value === 0) return;
        const shift = n.Value % (length - 1); // Minus 1 because n gets removed
        let shiftAbs = Math.abs(shift);
        const sign = Math.sign(shift);
        if (sign < 0) shiftAbs++;
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

       // print(encrypted);

    });




    //    let sorted = [...initial].sort();
    //    console.log(sorted.join('\n'));
    //    const work = new EncryptedFile(...initial);

    //    // Mix
    //    initial.forEach(value => {
    //        work.Move(value);
    //    });

    //    const zeroIndex = work.indexOf(0);
    //    const mod1000 = (zeroIndex + 1000) % work.length;
    //    const mod2000 = (zeroIndex + 2000) % work.length;
    //    const mod3000 = (zeroIndex + 3000) % work.length;
    const mod1000 = 1000 % length;
    const mod2000 = 2000 % length;
    const mod3000 = 3000 % length;

    let cx = null;
    let cy = null;
    let cz = null;

    let nmod = encrypted[zeroIndex];
    let m = 0;
    while (!(cx && cy && cz)) {
        if (m === mod1000) {
cx=nmod.Value;
        } else if (m===mod2000){
            cy=nmod.Value;
        } else if (m===mod3000){
            cz = nmod.Value;
        }
        nmod = nmod.Next;
        m++;
        
    }
    //    // Sum of Grove Coordinates
    //    const cx = work[mod1000];
    //    const cy = work[mod2000];
    //    const cz = work[mod3000];
    //    //const sum = work[mod1000] + work[mod2000]+ work[mod3000];
       const sum = cx + cy + cz;

    //    // 1, 2, -3, 4, 0, 3, -2
        return sum; //1306 is too low! // 6006 is too low!
    //    // we also got -26305, lol
   // return 0;
}

const part2 = (input: string): number => {
    const encrypted = parse(input);
    return 0;
}

export { part1, part2 };
