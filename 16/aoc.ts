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

    // guaranteedflow / knownFlow
    public FutureFlow: number = 0;

    // total flow released so far? do we care?

    public Actors: Valve[] = []; // can we JUST store valve[]?

    constructor(valves?: Valve[], actors?: Valve[]) {
        // Only do this for the first state? The rest of the states are copied?
        if (valves) {
            valves.forEach(valve => {
                this.ValveState.set(valve, false);
            });
        }

        if (actors) {
            this.Actors = actors;
        }
    }

    // Actors

    //public Actors

    // copy function?
    //var newMap = new Map(existingMap)

    Open(valve: Valve, maxMinute: number) {
        this.ValveState.set(valve, true);
        this.FutureFlow += valve.Flow * (maxMinute - this.Minute); // We should probably check this
    }

    // memo
    // key must include locations(valves) of all actors, minute. Value is futureflow
    GetMemoKey(): string {
        let key = `m${this.Minute}`
        this.Actors
            .sort((actorA, actorB) => actorB.Id > actorA.Id ? 1 : -1)
            .forEach(actor => {
                key += `a${actor.Id}`;
            });
        return key;
    }

    Copy(): State {
        const copy = new State();
        copy.Minute = this.Minute;
        copy.FutureFlow = this.FutureFlow;
        copy.ValveState = new Map<Valve, boolean>(this.ValveState);
        copy.Actors = [...this.Actors];

        return copy;
    }
}

// data is mutated
const Act = (data: ActionData): void => {
    const state = data.StateStack[data.StateStack.length - 1];
    //const state = data.StateStack.pop();

    // Check Memo
    const valveMemoKey = state.GetMemoKey();
    let valveMemoValue = data.ValveMemo.get(valveMemoKey);
    if (valveMemoValue && valveMemoValue >= state.FutureFlow) {
        return;
    }
    data.ValveMemo.set(valveMemoKey, state.FutureFlow);

    const actState = state.Copy();
    actState.Minute++;

    
    // if (actState.Minute > data.MaxMinute) {
    //     return;
    // }

    if (actState.Minute === data.MaxMinute) {
        // Opening additional valves will not help at this point.
        if (actState.FutureFlow > data.TotalFlow) {
            data.TotalFlow = actState.FutureFlow;
            console.log(data.TotalFlow);
        }
        return;
    }

    const nextStates = [];

    actState.Actors.forEach((actor, actorIndex) => {
        const valve = actor; // Just a rename
        //- maybe an action is simply a pointer to a valve? if no valve, open if that makes sense
        //if(actor)
        // check if we're at an open valve with a flow >0
        const valveIsOpen: boolean = actState.ValveState.get(actor);
        if (!valveIsOpen && valve.Flow > 0) {
            // Open
            const nextState = actState.Copy();
            nextState.Open(valve, data.MaxMinute);
            nextStates.push(nextState);
        } else {
            // Move
            valve.Tunnels.forEach(tunneledValve => {
                const nextState = actState.Copy();
                nextState.Actors[actorIndex] = tunneledValve;
                nextStates.push(nextState);
            });
        }

    });

    nextStates.forEach(state => {
        data.StateStack.push(state);
        Act(data);
        const lastState = data.StateStack.pop();
        //console.log('pop');
    });

    // returns state? or void?
}

class ActionData {
    // should these all be static?

    // memo
    // key must include locations(valves) of all actors, minute. Value is futureflow
    public ValveMemo: Map<string, number> = new Map<string, number>();

    // statestack?
    public StateStack: State[] = [];

    public MaxMinute: number = 0;

    // backtrack info?
    public TotalFlow: number = 0;


}

const part1 = async (input: string): Promise<number | string> => {

    // Notes
    // DO NOT OPEN IF FLOW = 0
    // create a "knownFlow" or "flowSoFar"
    // create a key / hash for the "actors" array. In part1 there will be one, in part2 there will be two.
    // At the valve, remember a ... no nothing else is stored in the valves. maybe a map instead!

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

    //const stateStack: State[] = [];
    //stateStack.push(new State(valves, actors));

    // Then to act, we look at the state and for each actor, move(change the actor to a tunneled valve) or open (change the state's valvestate and update futureflow)

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
