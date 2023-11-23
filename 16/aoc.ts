class Valve {

    public Id: string;
    public Flow: number;
    public Tunnels: Valve[] = [];

    constructor(id: string, flow: number) {
        this.Id = id;
        this.Flow = flow;        
    }
}

// Parse to Valve Array, Do Not Modify the Array after Creation
const parse = (input: String): Valve[] => {
    const scan: Valve[] = [];

    //Valve NV has flow rate=5; tunnels lead to valves ZV, CG, YB, HX, OY

    for (const line of input.split('\n')) {
        const reValves = /([A-Z]{2})/g;
        const valves = line.match(reValves);
        const id: string = valves[0];
        const reFlow = /(\d+)/;
        const flow: number = parseInt(line.match(reFlow)[1]);

        scan.push(new Valve(id, flow));
    }

    for (const line of input.split('\n')) {

        const reValves = /([A-Z]{2})/g;
        const valves = line.match(reValves);
        const id: string = valves[0];
        const valve = scan.find(v => v.Id === id);

        for (let i = 1; i < valves.length; i++) {
            const tunnelValve = scan.find(v => v.Id === valves[i]);
            valve.Tunnels.push(tunnelValve);
        }

        // Quick optimization?
        valve.Tunnels = valve.Tunnels.sort((va, vb) => vb.Flow - va.Flow);
    }

    return scan;
}

class State {

    // minute
    public Minute: number = 0;
    // map of valves to open/close state
    public ValveState = new Map<Valve, boolean>();

    public AllValvesOpen: boolean = false;

    // guaranteedflow / knownFlow
    public FutureFlow: number = 0;

    // total flow released so far? do we care?

    public Actors: Valve[] = []; // can we JUST store valve[]?

    public Valves: Valve[];

    constructor(valves?: Valve[], actors?: Valve[]) {
        // Only do this for the first state? The rest of the states are copied?
        if (valves) {
            this.Valves = valves;
            valves.forEach(valve => {
                this.ValveState.set(valve, false);
            });
        }

        if (actors) {
            this.Actors = actors;
        }
    }

    Open(valve: Valve, maxMinute: number) {
        if (this.ValveState.get(valve)) {
            throw new Error('We should only open once');
        }

        this.ValveState.set(valve, true);
        this.FutureFlow += valve.Flow * (maxMinute - this.Minute); // We should probably check this

        this.AllValvesOpen = true;
        this.ValveState.forEach((isOpened, valve) => {
            if (!this.AllValvesOpen) {
                return;
            }
            if (!isOpened && valve.Flow > 0) {
                this.AllValvesOpen = false;
            }
        });
    }

    // key must include locations(valves) of all actors, minute. Value is futureflow
    GetMemoKey(): string {
        let key = `m${this.Minute}`
        this.Actors
            .sort((actorA, actorB) => actorA.Id > actorB.Id ? 1 : -1)
            .forEach(actor => {
                key += `a${actor.Id}`;
            });

        // Have to add the open valves too...
        this.ValveState.forEach((isOpened, valve) => {
            if (isOpened) {
                key += `v${valve.Id}`;
            }
        });
        return key;
    }

    Copy(): State {
        const copy = new State();
        copy.Minute = this.Minute;
        copy.FutureFlow = this.FutureFlow;
        copy.ValveState = new Map<Valve, boolean>(this.ValveState);
        copy.Actors = [...this.Actors];
        copy.Valves = this.Valves; // They can all point to the same array.

        return copy;
    }

    //TODO: This is expensive and should probably be memoized
    FindIdealFuture(data: ActionData) {
        // find remaining closed valves
        let remainingClosedValves = [...this.Valves]
            .filter(valve => {
                return !this.ValveState.get(valve);
            })
            .sort((valveA, valveB) => valveA.Flow - valveB.Flow); // The largest should be at the end to pop them off.

        let ideal = 0;
        // so... each actor can open a valve every two minutes
        let remainingMinutes = data.MaxMinute - this.Minute;
        while (remainingMinutes > 0) {
            for (let i = 0; i < this.Actors.length; i++) {
                if (remainingClosedValves.length > 0) {
                    const valveToOpen: Valve = remainingClosedValves.pop();
                    ideal += valveToOpen.Flow * remainingMinutes;
                }

            }
            remainingMinutes -= 2;
        }

        return ideal;
    }
}

class ActionData {
    // should these all be static?

    // memo
    // key must include locations(valves) of all actors, minute. Value is futureflow
    public ValveMemo: Map<string, number> = new Map<string, number>();
    public StateStack: State[] = [];
    public MaxMinute: number = 0;
    public TotalFlow: number = 0;

    // backtrack info?
    public SavedStateStack: State[] = [];

    SaveStateStack() {
        this.SavedStateStack = this.StateStack.map(state => state.Copy());
    }

    CheckStateForSolution(state: State) {
        if (state.FutureFlow > this.TotalFlow) {
            this.TotalFlow = state.FutureFlow;
            this.SaveStateStack();
            //console.log(this.TotalFlow);
        }
    }
}

// data is mutated
const Act = (data: ActionData): void => {
    const state = data.StateStack[data.StateStack.length - 1];

    // Check Memo
    
    const valveMemoKey = state.GetMemoKey();
    let valveMemoValue = data.ValveMemo.get(valveMemoKey);
    if (valveMemoValue && valveMemoValue >= state.FutureFlow) {
        return;
    }
    data.ValveMemo.set(valveMemoKey, state.FutureFlow);
    
    const idealFuture = state.FindIdealFuture(data);
    if (state.FutureFlow + idealFuture <= data.TotalFlow) {
        return;
    }

    const actState = state.Copy();
    actState.Minute++;

    if (actState.Minute === data.MaxMinute || actState.AllValvesOpen) {
        // Opening additional valves will not help at this point.
        data.CheckStateForSolution(actState);
        return;
    }

    let nextStates = [];

    const actor0 = actState.Actors[0];
    const actor0ShouldOpen: boolean = !actState.ValveState.get(actor0) && actor0.Flow > 0;

    if (actState.Actors.length === 1) {
        // Part 1

        if (actor0ShouldOpen) {
            // Open
            const nextState = actState.Copy();
            nextState.Open(actor0, data.MaxMinute);
            nextStates.push(nextState);
        }

        // Move
        actor0.Tunnels.forEach(tunneledValve => {
            const nextState = actState.Copy();
            nextState.Actors[0] = tunneledValve;
            nextStates.push(nextState);
        });
    } else {
        // Part 2

        const actor1 = actState.Actors[1];
        const actor1ShouldOpen: boolean = (actor0 !== actor1) && !actState.ValveState.get(actor1) && actor1.Flow > 0;

        if (actor0ShouldOpen && actor1ShouldOpen) {
            const nextState = actState.Copy();
            // Open
            nextState.Open(actor0, data.MaxMinute);
            nextState.Open(actor1, data.MaxMinute);
            nextStates.push(nextState);
        }

        else if (actor0ShouldOpen && !actor1ShouldOpen) {
            // Open Actor 0
            const nextStateTemp = actState.Copy();
            nextStateTemp.Open(actor0, data.MaxMinute);
            // Move Actor 1
            actor1.Tunnels.forEach(tunneledValve => {
                const nextState = nextStateTemp.Copy();
                nextState.Actors[1] = tunneledValve;
                nextStates.push(nextState);
            });
        }

        else if (!actor0ShouldOpen && actor1ShouldOpen) {
            // Open Actor 1
            const nextStateTemp = actState.Copy();
            nextStateTemp.Open(actor1, data.MaxMinute);
            // Move Actor 0
            actor0.Tunnels.forEach(tunneledValve => {
                const nextState = nextStateTemp.Copy();
                nextState.Actors[0] = tunneledValve;
                nextStates.push(nextState);
            });
        }

        else if (!actor0ShouldOpen && !actor1ShouldOpen) {
            // Move
            actor0.Tunnels.forEach(tunneledValve0 => {
                actor1.Tunnels.forEach(tunneledValve1 => {
                    const nextState = actState.Copy();
                    nextState.Actors[0] = tunneledValve0;
                    nextState.Actors[1] = tunneledValve1;
                    nextStates.push(nextState);
                });
            });
        }
    }

    nextStates.forEach(state => {
        data.StateStack.push(state);
        Act(data);
        const lastState = data.StateStack.pop();
    });
}

const part1 = async (input: string): Promise<number | string> => {

    // Define initial valves and actors
    const valves = parse(input);
    const actors: Valve[] = [];
    // Part 1 there is 1 actor (you)
    // You start at valve AA
    actors.push(valves.find(v => v.Id === 'AA'));

    const data = new ActionData();
    const state = new State(valves, actors);
    data.StateStack.push(state);
    data.MaxMinute = 30;
    Act(data);

    return data.TotalFlow;
}

const part2 = async (input: string): Promise<number | string> => {
    // Define initial valves and actors
    const valves = parse(input);
    const actors: Valve[] = [];
    // Part 2 there are 2 actors (you and elephant)
    // You start at valve AA
    actors.push(valves.find(v => v.Id === 'AA'));
    actors.push(valves.find(v => v.Id === 'AA'));

    const data = new ActionData();
    const state = new State(valves, actors);
    data.StateStack.push(state);
    data.MaxMinute = 26;
    Act(data);
    return data.TotalFlow; // 2594
}

export { part1, part2 };
