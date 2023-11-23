class Valve {

    public Id: string;
    public Flow: number;
    public Tunnels: Valve[] = []; // ???

    constructor(id: string, flow: number) {
        this.Id = id;
        this.Flow = flow;
        //this.Tunnels = []; // Array of other valves? With a distance though... { valve, distance, potential?}
        // Thought, maybe after adding a tunnel, we re-sort by... value?
        // Although, the value really depends on how many minutes you have left

        //this.potentials = []; //?? I guess just the distance to the valve and the valve itself... ValveInfo?
    }

    // Do we need this?
    TraversePotential(valveMap, previousDistance, firstTunnel = null) {
        const distance = previousDistance + 1;
        if (valveMap.get(this).distance <= distance) { return; }

        valveMap.set(this, { distance, firstTunnel });
        for (const t of this.Tunnels) {
            const ft = firstTunnel || t;
            t.TraversePotential(valveMap, distance, ft);
        }
    }

    // wait why copy?
    // Copy():Valve{


    // }
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


// not needed????
class Actor {
    public Valve: Valve;

    constructor(valve: Valve) {
        this.Valve = valve;
    }
    // valve
    // current action? < - maybe an action is simply a pointer to a valve? if no valve, open if that makes sense
    // next action?

    // copy
    Copy(): Actor {
        const copy = new Actor(this.Valve);

        return copy;
    }

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

    // This will always calculate the next steps for the first Actor
    CalculateNextStates(data: ActionData): State[] {
        const nextStates: State[] = [];
        const valve0 = this.Actors[0]; // Just a rename

        // check if we're at an open valve with a flow >0
        const valve0IsOpen: boolean = this.ValveState.get(valve0);
        if (!valve0IsOpen && valve0.Flow > 0) {
            // Open
            const nextState = this.Copy();
            nextState.Open(valve0, data.MaxMinute);
            nextStates.push(nextState);
        }

        // Move
        valve0.Tunnels.forEach(tunneledValve => {
            const nextState = this.Copy();
            nextState.Actors[0] = tunneledValve;
            nextStates.push(nextState);
        });

        return nextStates;
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
            console.log(this.TotalFlow);
        }
    }
}



// data is mutated
const Act = (data: ActionData): void => {
    const state = data.StateStack[data.StateStack.length - 1];

    // Check Memo
    ///*
    const valveMemoKey = state.GetMemoKey();
    let valveMemoValue = data.ValveMemo.get(valveMemoKey);
    if (valveMemoValue && valveMemoValue >= state.FutureFlow) {
        return;
    }
    data.ValveMemo.set(valveMemoKey, state.FutureFlow);
    //*/

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

    // This is wrong for multiple actors
    // if they're at the same valve

    // if (actState.Actors.length === 1) {
    //   nextStates = state.CalculateNextStates(data);
    // } else {
        // const valve0 = actState.Actors[0]; // Just a rename
        // const valve1 = actState.Actors[1]; // Just a rename
        // const sameValve = valve0 === valve1;

        // const nextStatesActor0: State[] = state.CalculateNextStates(data);
        // const nextStatesActor1: State[] = state.CalculateNextStates(data);

        // // Permutate
        // nextStatesActor0.forEach(state0=>{
        //     nextStatesActor1.forEach(state1=>{
                
        //     });
        // });



        //let movers = [...actState.Actors];

        // //let nextStateOpen: State = null;
        // if (sameValve) {
        //     // just have actor0 open it
        //     const valveIsOpen: boolean = actState.ValveState.get(valve0);
        //     if (!valveIsOpen && valve0.Flow > 0) {
        //         // Open
        //         const nextStateOpen: State = actState.Copy();
        //         nextStateOpen.Open(valve0, data.MaxMinute);
        //         //nextStates.push(nextState);

        //         // Move (actor1 can still move)
        //         valve1.Tunnels.forEach(tunneledValve => {
        //             const nextState = nextStateOpen.Copy();
        //             nextState.Actors[1] = tunneledValve;
        //             nextStates.push(nextState);
        //         });
        //     }
        // } else {
        //     //
        // }

   // }

    actState.Actors.forEach((actor, actorIndex) => {
        const valve = actor; // Just a rename

        // check if we're at an open valve with a flow >0
        const valveIsOpen: boolean = actState.ValveState.get(actor);
        if (!valveIsOpen && valve.Flow > 0) {
            // Open
            const nextState = actState.Copy();
            nextState.Open(valve, data.MaxMinute);
            nextStates.push(nextState);
        }

        // Move
        valve.Tunnels.forEach(tunneledValve => {
            const nextState = actState.Copy();
            nextState.Actors[actorIndex] = tunneledValve;
            nextStates.push(nextState);
        });

    });

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

    //const stateStack: State[] = [];
    //stateStack.push(new State(valves, actors));

    // Then to act, we look at the state and for each actor, move(change the actor to a tunneled valve) or open (change the state's valvestate and update futureflow)

    return data.TotalFlow; // 1458 I assume is wrong.
}

export { part1, part2 };
