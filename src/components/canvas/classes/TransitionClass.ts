import { IHighlightable } from "../interfaces/IHighlightable";
import { StateClass } from "./StateClass";

export class TransitionClass implements IHighlightable {
    name: string;
    startState: StateClass;
    endState: StateClass;
    isHightlight: boolean = false;

    constructor(name: string, startState: StateClass, endState: StateClass) {
        this.name = name;
        this.startState = startState;
        this.endState = endState;
    }

    toString(): string {
        return `name: {${this.name}}\nstartState: {${this.startState}}\nendState: {${this.endState}}\n`;
    }
}