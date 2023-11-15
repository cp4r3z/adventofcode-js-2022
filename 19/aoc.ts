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
        const lastIndex = this.length - 1;
        const currentIndex = this.indexOf(value);
        let newIndex = currentIndex + value;
        while (newIndex < 0) {
            newIndex += lastIndex;
        }
        newIndex = newIndex % lastIndex;

        if (newIndex === 0) {
            // This seems to be the way the rules behave...
            newIndex = lastIndex;
        }

        // Splice in value
        // I'm not sure about performance here. We probably need to do a linked list instead.

        this.splice(currentIndex, 1);
        this.splice(newIndex, 0, value);
    }
}

const part1 = (input: string): Number => {
    const initial = parse(input);
    const work = new EncryptedFile(...initial);
    
    // Mix
    initial.forEach(value => {
        work.Move(value);
    });

    const zeroIndex = work.indexOf(0);
    const mod1000 = (zeroIndex+ 1000) % work.length;
    const mod2000 =(zeroIndex+ 2000) % work.length;
    const mod3000 = (zeroIndex+3000) % work.length;

    // Sum of Grove Coordinates
    const sum = work[mod1000] + work[mod2000]+ work[mod3000];

    return sum; //1306 is too low!
}


const part2 = (input: string): Number => {
    const encrypted = parse(input);
    return 0;
}

export { part1, part2 };
