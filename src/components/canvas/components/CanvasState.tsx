import { Circle, Group, Text } from 'react-konva';
import { StateClass } from '../classes/StateClass';
import Konva from 'konva';
import { useEffect, useState } from 'react';

interface CanvasStateProps {
    state: StateClass;
    draggable?: boolean;
    radius: number;
    onClick?(e: any): void;
    onDragMove?(e: any): void;
    dragBoundFunc?(this: Konva.Node, pos: Konva.Vector2d): Konva.Vector2d;
}

function CanvasState({ state, draggable = false, radius, onClick, onDragMove, dragBoundFunc }: CanvasStateProps) {

    const [color, setColor] =
        useState<string>(state.isHightlight ? 'red' : 'black');

    useEffect(() => {
        setColor(state.isHightlight ? 'red' : 'black');
    }, [
        state.isHightlight
    ]);

    return (
        <Group
            draggable={draggable}
            x={state.position.x}
            y={state.position.y}
            onClick={onClick}
            onDragMove={onDragMove}
            dragBoundFunc={dragBoundFunc}
            onMouseEnter={(_e) => setColor(state.isHightlight ? 'darkred' : 'blue')}
            onMouseLeave={(_e) => setColor(state.isHightlight ? 'red' : 'black')}>
            <Circle
                radius={radius}
                fill="transparent"
                stroke={color} />
            {state.isEndState &&
                <Circle
                    radius={(radius * 0.9)}
                    fill="transparent"
                    stroke={color}
                />
            }
            <Text
                text={state.name}
                x={-radius}
                y={-radius / 10}
                width={radius * 2}
                align='center'
                verticalAlign='middle'
                fill={color} />
        </Group>
    );
};

export default CanvasState;