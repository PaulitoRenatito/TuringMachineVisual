import { useEffect, useState } from "react";
import { StateClass } from "../classes/StateClass";
import { TransitionClass } from "../classes/TransitionClass";
import { Vector2DClass } from "../classes/Vector2DClass";
import { Layer, Stage } from "react-konva";
import Konva from 'konva';

import './canvas.css'
import { State, Transition } from "../../../interfaces/State";
import CanvasState from "./CanvasState";
import CanvasTransition from "./CanvasTransition";
import { generateStateClassArray, generateTransitionClassArray, getTransitionName } from "../Utils";

interface CanvasProps {
  states: State[] | null;
  highlightState?: State | null;
  highlightTransition?: Transition | null;
}
export function Canvas({ states, highlightState = null, highlightTransition = null }: CanvasProps) {

  const circleRadius = 40;

  const [statesCanvas, setStatesCanvas] = useState<StateClass[]>([]);
  const [transitionsCanvas, setTransitionsCanvas] = useState<TransitionClass[]>([]);

  const [lastHighlightState, setLastHighlightState] = useState<StateClass | null>(null);
  const [lastHighlightTransition, setLastHighlightTransition] = useState<TransitionClass | null>(null);

  useEffect(() => {
    if (!states || states.length === 0) {
      console.error('O array de estados está vazio.');
      return;
    }
  
    const canvasCenter = new Vector2DClass(1146 / 2, 600 / 2);
    const newStates = generateStateClassArray(states, canvasCenter);
    const newTransitions = generateTransitionClassArray(states, newStates);
  
    setStatesCanvas(newStates);
    setTransitionsCanvas(newTransitions);
  }, [states]);

  const getHighlightState = (canvas: StateClass[], state: State) => {

    const stateInCanvas = canvas.find((t) => (t.name === state?.state_name));

    if (stateInCanvas === undefined) return null;

    stateInCanvas.isHightlight = true;

    return stateInCanvas;
  };

  const getHighlightTransition = (canvas: TransitionClass[], transition: Transition) => {

    const transitionName = getTransitionName(transition.conditions);

    const transitionInCanvas = canvas.find((t) => (
      t.name === transitionName &&
      t.startState.name === transition?.current_state &&
      t.endState.name === transition?.next_state
    ));

    if (transitionInCanvas === undefined) return null;

    transitionInCanvas.isHightlight = true;

    return transitionInCanvas;
  };

  const clearHighlight = () => {
    if (lastHighlightState !== null) {
      lastHighlightState.isHightlight = false;
    }

    if (lastHighlightTransition !== null) {
      lastHighlightTransition.isHightlight = false;
    }
  }

  useEffect(() => {
    if (states === null || highlightState === null) return;

    clearHighlight();

    const newStateHighlight = getHighlightState(statesCanvas, highlightState);

    if (newStateHighlight !== null) {
      setLastHighlightState(newStateHighlight);
      setStatesCanvas([...statesCanvas]);
      setTransitionsCanvas([...transitionsCanvas]);
    }

    console.log("state: " + newStateHighlight + "\n" + newStateHighlight?.isHightlight);

  }, [highlightState]);

  useEffect(() => {
    if (states === null|| highlightTransition === null) return;

    clearHighlight();

    const newTransitionHighlight = getHighlightTransition(transitionsCanvas, highlightTransition);

    if (newTransitionHighlight !== null) {
      setLastHighlightTransition(newTransitionHighlight);
      setStatesCanvas([...statesCanvas]);
      setTransitionsCanvas([...transitionsCanvas]);
    }

    console.log("state: " + newTransitionHighlight + "\n" + newTransitionHighlight?.isHightlight);

  }, [highlightTransition]);

  const handleStateClick = (_state: StateClass, _e: any) => {

  };

  const handleStageClick = (_e: any) => {

  }

  const handleStateDragMove = (e: any, index: number) => {

    const updatedStates = [...statesCanvas];
    const draggedState = updatedStates[index];
    const { x, y } = e.target.position();

    updatedStates[index] = new StateClass(
      draggedState.name,
      draggedState.isEndState,
      new Vector2DClass(x, y)
    );

    setStatesCanvas(updatedStates);

    // Recalcular transições
    const updatedTransitions = transitionsCanvas.map((transition) => {
      const isStart = transition.startState === statesCanvas[index];
      const isEnd = transition.endState === statesCanvas[index];

      return new TransitionClass(
        transition.name,
        isStart ? updatedStates[index] : transition.startState,
        isEnd ? updatedStates[index] : transition.endState
      );
    });

    setTransitionsCanvas(updatedTransitions);
  };

  const createDragBoundFunc = (index: number) => {
    return function (this: Konva.Node, pos: Konva.Vector2d): Konva.Vector2d {
      const updatedStates = [...statesCanvas];
      let { x, y } = pos;

      let alignedStateX = null;
      let alignedStateY = null;

      updatedStates.forEach((state, i) => {
        if (i !== index) {
          if (Math.abs(x - state.position.x) <= (circleRadius * 0.25)) alignedStateX = state.position.x;
          if (Math.abs(y - state.position.y) <= (circleRadius * 0.25)) alignedStateY = state.position.y;
        }
      });

      x = alignedStateX ?? x;
      y = alignedStateY ?? y;

      return { x, y };
    };
  };

  return (
    <Stage
      className="canvas"
      width={1146}
      height={600}
      onClick={handleStageClick}>
      <Layer>
        {statesCanvas.map((state, index) => (
          <CanvasState
            key={`state-${index}`}
            state={state}
            draggable={true}
            radius={circleRadius}
            onClick={(e) => handleStateClick(state, e)}
            onDragMove={(e) => handleStateDragMove(e, index)}
            dragBoundFunc={createDragBoundFunc(index)} />
        ))}
        {transitionsCanvas.map((transition, index) => (
          <CanvasTransition
            key={`state-${index}`}
            transition={transition}
            radius={circleRadius}
          />
        ))}
      </Layer>
    </Stage>
  )
}