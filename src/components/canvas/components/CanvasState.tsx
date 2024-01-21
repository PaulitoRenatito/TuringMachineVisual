import { Circle, Group, Text } from 'react-konva';
import { StateClass } from '../classes/StateClass';
import Konva from 'konva';
import { useState } from 'react';

interface CanvasStateProps {
    state: StateClass;
    draggable?: boolean;
    radius: number;
    onClick?(e: any): void;
    onDragMove?(e: any): void;
    dragBoundFunc?(this: Konva.Node, pos: Konva.Vector2d): Konva.Vector2d;
}

function CanvasState({ state, draggable = false, radius, onClick, onDragMove, dragBoundFunc }: CanvasStateProps) {

    const [hoverColor, setHoverColor] = useState<string>('black');
    
    return (
        <Group
            draggable={draggable}
            x={state.position.x}
            y={state.position.y}
            onClick={onClick}
            onDragMove={onDragMove}
            dragBoundFunc={dragBoundFunc}
            onMouseEnter={(_e) => setHoverColor('blue')}
            onMouseLeave={(_e) => setHoverColor('black')}>
            <Circle
                radius={radius}
                fill="transparent"
                stroke={state.isHightlight ? 'red' : hoverColor} />
            {state.isEndState &&
                <Circle
                    radius={(radius * 0.9)}
                    fill="transparent"
                    stroke={state.isHightlight ? 'red' : hoverColor}
                />
            }
            <Text
                text={state.name}
                x={-radius}
                y={-radius / 10}
                width={radius * 2}
                align='center'
                verticalAlign='middle'
                fill={state.isHightlight ? 'red' : hoverColor} />
        </Group>
    );
};

export default CanvasState;