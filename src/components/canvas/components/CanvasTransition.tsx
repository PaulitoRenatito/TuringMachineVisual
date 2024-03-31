import { Arrow, Text, Group } from 'react-konva';
import { TransitionClass } from '../classes/TransitionClass';
import { calculateAngle, pointOnCircle } from '../Utils';
import { useEffect, useState } from 'react';
import { Vector2DClass } from '../classes/Vector2DClass';
import Konva from 'konva';

interface CanvasTransitionProps {
    transition: TransitionClass;
    radius: number;
    offset?: number;
}
function CanvasTransition({ transition, radius, offset = 0 }: CanvasTransitionProps) {

    const [color, setColor] =
        useState<string>(transition.isHightlight ? 'red' : 'black');

    useEffect(() => {
        setColor(transition.isHightlight ? 'red' : 'black');
    }, [
        transition.isHightlight
    ]);

    const isLoop = transition.startState === transition.endState;

    const angle = calculateAngle(transition.startState.position, transition.endState.position);

    const startStateOffset = -radius;

    const startStatePoint = isLoop ?
        pointOnCircle(transition.startState.position, radius, (angle - 0.8) * ((-1) ** offset)) :
        pointOnCircle(transition.startState.position, radius, angle - (offset * radius/2));
    const endStatePoint = isLoop ?
        pointOnCircle(transition.endState.position, startStateOffset, (angle + 0.8) * ((-1) ** offset)) :
        pointOnCircle(transition.endState.position, startStateOffset, angle + (offset * radius/2));

    const [startPosition, setStartPosition] = useState<Vector2DClass>(startStatePoint);

    const [endPosition, setEndPosition] = useState<Vector2DClass>(endStatePoint);

    const loopRadius = 100;

    const midpoint = isLoop ?
        new Vector2DClass(
            ((startPosition.x + endPosition.x) / 2),
            startPosition.y - (loopRadius * ((-1) ** offset))
        ) :
        new Vector2DClass(
            ((startPosition.x + endPosition.x) / 2) + (radius * offset),
            ((startPosition.y + endPosition.y) / 2) + (radius * offset)
        );

    const [arrowMiddle, setArrowMiddle] = useState<Vector2DClass>(midpoint);

    const updatePositions = (newStartPos: Vector2DClass, newEndPos: Vector2DClass, newArrowMiddle: Vector2DClass) => {
        setStartPosition(newStartPos);
        setEndPosition(newEndPos);
        setArrowMiddle(newArrowMiddle);
    };

    useEffect(() => {
        updatePositions(startStatePoint, endStatePoint, midpoint);
    }, [transition]);

    const points = isLoop
        ?
        [
            startPosition.x,
            startPosition.y,
            arrowMiddle.x,
            arrowMiddle.y,
            endPosition.x,
            endPosition.y,
        ]
        :
        [
            startPosition.x, startPosition.y, arrowMiddle.x, arrowMiddle.y, endPosition.x, endPosition.y
        ];

    function createDragBoundFunc(this: Konva.Node, _pos: Konva.Vector2d): Konva.Vector2d {

        const { x, y } = this.getPosition();

        const stage = this.getStage()!;
        const pointerPosition = stage.getPointerPosition()!;

        if (isLoop) {

            if (Math.abs(midpoint.x - pointerPosition.x) <= 30 && Math.abs(midpoint.y - pointerPosition.y) <= 30) {
                updatePositions(startStatePoint, endStatePoint, midpoint);
            }
            else {

                const newAngle = calculateAngle(transition.startState.position, pointerPosition);

                updatePositions(
                    pointOnCircle(transition.startState.position, radius, newAngle + 0.8),
                    pointOnCircle(transition.endState.position, startStateOffset, newAngle + 2.4),
                    pointerPosition
                );
            }
        }
        else {
            if (Math.abs(midpoint.x - pointerPosition.x) <= 30 && Math.abs(midpoint.y - pointerPosition.y) <= 30) {
                updatePositions(startStatePoint, endStatePoint, midpoint);
            }
            else {
                updatePositions(
                    pointOnCircle(transition.startState.position, radius, calculateAngle(transition.startState.position, pointerPosition) * 1.2),
                    pointOnCircle(transition.endState.position, radius, calculateAngle(transition.endState.position, pointerPosition) * 1.2),
                    new Vector2DClass(pointerPosition.x, pointerPosition.y)
                );
            }
        }

        return { x, y };
    };

    const width = transition.name.length * 6;

    const calculateTextPosition = (arrowMiddle: Vector2DClass, rotationAngle: number) => {

        const textDistanceAboveArrow = -20;

        let radians = (rotationAngle * Math.PI) / 180;
        let textAdjustedX;
        let textAdjustedY;

        if (isLoop) {
            textAdjustedX = arrowMiddle.x - Math.cos(radians) * (width / 2);
            textAdjustedY = arrowMiddle.y + Math.sin(radians) * (width / 4) - textDistanceAboveArrow;
        }
        else {
            textAdjustedX = arrowMiddle.x - Math.cos(radians) * (width / 2);
            textAdjustedY = arrowMiddle.y + Math.sin(radians) * (width / 4) + textDistanceAboveArrow;
        }

        return { textAdjustedX, textAdjustedY };
    };

    const { textAdjustedX, textAdjustedY } = calculateTextPosition(arrowMiddle, angle);

    return (
        <Group
            draggable
            dragBoundFunc={createDragBoundFunc}
            onMouseEnter={(_e) => setColor(transition.isHightlight ? 'darkred' : 'blue')}
            onMouseLeave={(_e) => setColor(transition.isHightlight ? 'red' : 'black')}
        >
            <Arrow
                points={points}
                tension={1}
                stroke={color}
                strokeWidth={2}
            />
            <Text
                text={transition.name}
                x={textAdjustedX}
                y={textAdjustedY}
                width={width}
                align='center'
                verticalAlign='middle'
                fill={color}
            />
        </Group>
    );
};

export default CanvasTransition;