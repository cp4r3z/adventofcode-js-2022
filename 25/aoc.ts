class Snafu {

    private _sArray: string[];

    constructor(s: string) {
        this._sArray = s.split('');
    }

    private pow5(place: number) {
        return Math.pow(5, place);
    }

    private sToD(s: string): number {
        if (s === '2') {
            return 2;
        } else if (s === '1') {
            return 1;
        } else if (s === '0') {
            return 0;
        } else if (s === '-') {
            return -1;
        } else if (s === '=') {
            return -2;
        }
    }

    ToDecimal(): Decimal {
        let d = 0;
        for (let i = 0; i < this._sArray.length; i++) {
            // const element = array[i];
            const s = this._sArray[i];
            //const sInt = parseInt(s);
            const sd = this.sToD(s);
            const pow5 = this.pow5(this._sArray.length - 1 - i);
            d += sd * pow5;
        }
        return new Decimal(d);        
    }

    Print():void{
        console.log(this._sArray.join(''));
    }
}

class Decimal {

    private _d: number;
    constructor(d: number) {
        this._d = d;
    }

    private pow5(place: number) {
        return Math.pow(5, place);
    }

    private dToS(d: number): string {
        if (d === 2) {
            return '2';
        } else if (d === 1) {
            return '1';
        } else if (d === 0) {
            return '0';
        } else if (d === -1) {
            return '-';
        } else if (d === -2) {
            return '=';
        }
    }

    private findHighPlace(): number {
        let found = false;
        let place = -1;
        while (!found) {
            place++;
            const highestPossible = this.highestPossible(place);
            if (highestPossible >= this._d) {
                found = true;
            }
        }
        return place;
    }

    private highestPossible(place: number): number {
        // TODO: In theory, we can memoize this.
        let highestPossible = 0;
        for (let i = 0; i <= place; i++) {
            const pow5 = this.pow5(place);
            highestPossible += 2 * pow5; // 2 is the highest value in the place                        
        }
        return highestPossible;
    }

    ToSnafu(): Snafu {
        const highPlace = this.findHighPlace();        
        const s: string[] = new Array(highPlace+1);
        let dRemainder = this._d;
        for (let i = 0; i < highPlace; i++) {
                        
            //const element = array[i];
            const pow5 = this.pow5(highPlace-i);
           
            for ( let j=-2; j <= 2; j++) {
                //const element = array[j];
                const pow5J = pow5 * j;
                const diff = dRemainder - pow5J;

                //const difftoHighestPossible = dRemainder - pow5J;
                if (diff<=this.highestPossible(highPlace-i-1)){
                    // we're good
                    dRemainder -= pow5J;
                   // s[] .push(this.dToS(j-1));
                   s[i]=this.dToS(j);
                    break;
                }                

                // if (diff < 0) { // NOPE!
                //     // It's the previous one
                //     const jPrev = j - 1;
                //     const sjPrev = this.dToS(jPrev);
                //     dRemainder -= pow5 * jPrev;
                //     s.push(sjPrev);
                //     break;
                // }
            }
            
        }
        s[highPlace]=this.dToS(dRemainder);
        return new Snafu(s.join(''));
    }

    Print():void{
        console.log(this._d);
    }
}

const parse = (input: String) => {
    return input
        .split("\n");
    // .map(line => line.split(''));
}

const part1 = async (input: string): Promise<number | string> => {
    const split = parse(input);

    const snafus = split.map(line => new Snafu(line));
    snafus.forEach(snafu=>{
        snafu.Print();
    })
    const decimals = snafus.map(s => s.ToDecimal());
    decimals.forEach(decimal=>{
        decimal.Print();
    })
    const snafusB = decimals.map(d => d.ToSnafu());
    snafusB.forEach(snafu=>{
        snafu.Print();
    })


    return 0;

}

const part2 = async (input: string): Promise<number | string> => {
    return 0
}

export { part1, part2 };
