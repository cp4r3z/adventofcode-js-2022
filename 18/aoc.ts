import * as Point from '../common/base/points';
import { Grid3D } from '../common/grid';

class Cube extends Point.XYZ {
    public Exposed: boolean = false;
    public IsLava: boolean = false;
    public Visited: boolean = false;

    GetAdjacents(): Point.IPoint3D[] {
        return [
            this.copy().move(new Point.XYZ(-1, 0, 0)),
            this.copy().move(new Point.XYZ(1, 0, 0)),
            this.copy().move(new Point.XYZ(0, -1, 0)),
            this.copy().move(new Point.XYZ(0, 1, 0)),
            this.copy().move(new Point.XYZ(0, 0, -1)),
            this.copy().move(new Point.XYZ(0, 0, 1))
        ];
    }
}

const stringToCube = (s: string): Cube => {
    const matches = s.match(/(\d+)/g);
    const x = parseInt(matches[0]);
    const y = parseInt(matches[1]);
    const z = parseInt(matches[2]);
    return new Cube(x, y, z);
}

const parse = (input: string): Grid3D => {
    const grid = new Grid3D({ setOnGet: false, defaultValue: null });
    input
        .split("\n")
        .forEach(line => {
            const cube = stringToCube(line);
            cube.IsLava = true;
            // add cube
            grid.setPoint(cube, cube);
        });
    return grid;
}

const part1 = (input: string): Number => {
    const grid = parse(input);
    let surfaceArea = 0;
    grid.forEach(cube => {
        //let exposed =0;
        const adjacents = cube.GetAdjacents();
        adjacents.forEach(adjacent => {
            if (!grid.getPoint(adjacent)) {
                //exposed++;
                surfaceArea++;
            }
        });
    });
    return surfaceArea;
}


const part2 = (input: string): Number => {
    const grid = parse(input);

    // Now "fill" with water

    function FillSO(point: Point.IPoint3D) {
        if (!grid.Bounds.ContainsPoint(point)) {
            return;
        }

        let current: Cube = grid.getPoint(point);

        if (current?.Visited) {
            return;
        }

        if (!current) {
            current = new Cube(point.x, point.y, point.z); // IsLava = false
            grid.setPoint(point, current);
        }

        current.Visited = true;

        if (current.IsLava) {
            current.Exposed = true;
        } else {
            // Not lava, so "water", so keep filling

            console.log(Grid3D.HashPointToKey(current));

            current.GetAdjacents().forEach(adjacent => Fill(adjacent));
        }

    }

    function Fill(startingPoint: Point.IPoint3D) {
        const startingHash = Grid3D.HashPointToKey(startingPoint);
        let pointHashes: Set<string> = new Set([startingHash]);

        while (pointHashes.size > 0) {
            const nextPointHashes: Set<string> = new Set();
            pointHashes.forEach(pointHash => {
                const point = Grid3D.HashToPoint(pointHash);
                let cube: Cube = grid.get(pointHash);
                if (cube?.Visited) {
                    return;
                }

                if (!cube) {
                    cube = new Cube(point.x, point.y, point.z); // IsLava = false
                    grid.setPoint(point, cube);
                }

                if (cube.IsLava) {
                    cube.Exposed = true;
                } else {
                    cube.GetAdjacents().forEach(adjacent => {
                        if (grid.Bounds.ContainsPoint(adjacent)) {
                            nextPointHashes.add(Grid3D.HashPointToKey(adjacent));
                        }
                    });
                }

                cube.Visited = true;
            });

            pointHashes = nextPointHashes;
        }
    }

    grid.Bounds.Expand(grid.Bounds.MinCorner.copy().move(new Point.XYZ(-1, -1, -1)));
    grid.Bounds.Expand(grid.Bounds.MaxCorner.copy().move(new Point.XYZ(+1, +1, +1)));

    //FillSO(grid.Bounds.MinCorner); // Works for test case but stack overflow for the real input
    Fill(grid.Bounds.MinCorner);

    let surfaceArea = 0;
    grid.forEach((cube: Cube) => {
        if (cube.IsLava && cube.Exposed) {
            const adjacents = cube.GetAdjacents();
            adjacents.forEach(adjacent => {
                const adjacentValue: Cube = grid.getPoint(adjacent);
                if (adjacentValue && !adjacentValue.IsLava) {
                    surfaceArea++;
                }
                if (!adjacentValue) {
                    //console.log('trapped air');
                }
            });
        }
    });
    return surfaceArea;
}

export { part1, part2 };
