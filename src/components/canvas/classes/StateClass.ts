import { IHighlightable } from "../interfaces/IHighlightable";
import { Vector2DClass } from "./Vector2DClass";

export class StateClass implements IHighlightable {
    name: string;
    isEndState: boolean;
    position: Vector2DClass;
    isHightlight: boolean = false;

    constructor(name: string, isEndState: boolean, position: Vector2DClass) {
        this.name = name;
        this.isEndState = isEndState;
        this.position = position;
    }

    isPointInside(point: Vector2DClass): boolean {
        const distancia = Math.sqrt(Math.pow(point.x - this.position.x, 2) + Math.pow(point.y - this.position.y, 2));
        return distancia <= 40;
    }

    toString(): string {
        return `name: {${this.name}} position: {${this.position}} isHightlight: {${this.isHightlight}}`;
    }
}