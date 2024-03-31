import { ConditionData, StateData, TransitionData } from "../../services/states/state.types";
import { StateClass } from "./classes/StateClass";
import { TransitionClass } from "./classes/TransitionClass";
import { Vector2DClass } from "./classes/Vector2DClass";

function calculateAngle(start: Vector2DClass, end: Vector2DClass): number {
    return Math.atan2(end.y - start.y, end.x - start.x);
}

function pointOnCircle(position: Vector2DClass, radius: number, angle: number): Vector2DClass {
    const x = position.x + radius * Math.cos(angle);
    const y = position.y + radius * Math.sin(angle);

    return new Vector2DClass(x, y);
}

function generateStateClassArray(states: StateData[], canvasCenter: Vector2DClass): StateClass[] {

    const angleIncrement = (2 * Math.PI) / states.length;

    const radius = 200;

    const stateClassArray = states.map((state, index) => {
        const angle = index * angleIncrement;
        const randX = canvasCenter.x + radius * Math.cos(angle);
        const randY = canvasCenter.y + radius * Math.sin(angle);
        return new StateClass(state.state_name, state.is_end_state, new Vector2DClass(randX, randY));
    });

    return stateClassArray;
}

function generateTransitionClassArray(states: StateData[], newStates: StateClass[]): TransitionClass[] {
    return states.flatMap((state) => state.transitions.map((transition) => createTransition(transition, state, newStates)))
        .filter((transition) => transition !== null) as TransitionClass[];
}

function createTransition(transition: TransitionData, state: StateData, newStates: StateClass[]): TransitionClass | null {
    const transitionName = getTransitionName(transition.conditions);
    const current_state = findStateByName(transition.current_state, newStates);
    const next_state = findStateByName(transition.next_state, newStates);

    if (current_state && next_state) {
        return new TransitionClass(transitionName, current_state, next_state);
    } else {
        handleInvalidTransition(state.state_name);
        return null;
    }
}

function getTransitionName(conditions: ConditionData[]): string {
    return conditions.map(
        (condition) =>
            `${condition.read_symbol} --> ${condition.write_symbol}, ${condition.move_direction_symbol}\n`)
        .join('');
}

function findStateByName(name: string, states: StateClass[]): StateClass | undefined {
    return states.find((state) => state.name === name);
}

function handleInvalidTransition(stateName: string): void {
    console.error(`Transição inválida no estado ${stateName}`);
    // Handle invalid transition logic here, if needed
}

function generateTransitionMap(transitions: TransitionClass[]): Map<string, TransitionClass[]> {
    const transitionMap = new Map<string, TransitionClass[]>();

    transitions.forEach((transition) => {
        const key = `${transition.startState}-${transition.endState}`;

        if(!transitionMap.has(key)) {
            transitionMap.set(key, []);
        }

        transitionMap.get(key)?.push(transition);
    });

    return transitionMap;
}

export {
    calculateAngle,
    pointOnCircle,
    generateStateClassArray,
    getTransitionName,
    generateTransitionClassArray,
    generateTransitionMap
}