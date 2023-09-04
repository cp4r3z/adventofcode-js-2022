interface IGrid {

}

//type Coor2D = [x: number, y: number];
type Coor2D = {
    x: number,
    y: number
}

class Grid2D extends Map<Coor2D, string>{
    constructor(){
        super();
    }
}

//type Grid2D = Map<Coor2D, string>;

class Grid {
    readonly grid: Object;

    constructor(objInitialState) {
        
        this.grid = Object.assign({}, objInitialState);
    }
}


export { Grid2D, Coor2D };