import { State, Transition } from "../../interfaces/State";
import { useEffect, useState } from "react";
import { executeGetSteps } from "./StepService";

import './run-buttons.css'

interface RunButtonsProps {
    setHighlightState: (states: State | null) => any,
    setHighlightTransition: (transition: Transition | null) => any
}
export function RunButtons({ setHighlightState, setHighlightTransition }: RunButtonsProps) {

    const [steps, setSteps] = useState<any[] | null>(null);
    const [stepIndex, setStepIndex] = useState(-1);

    const handleRunClick = async () => {
        setStepIndex(0);
        try {
            const steps = await executeGetSteps();
            setSteps(steps);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleStepBackward = () => {
        if (steps === null || stepIndex <= 0) {
            return;
        }
        setStepIndex(prevStepIndex => prevStepIndex - 1);
    };

    const handleStepForward = () => {
        if (steps === null || stepIndex >= steps.length - 1) {
            return;
        }
        setStepIndex(prevStepIndex => prevStepIndex + 1);
    };

    useEffect(() => {
        if (steps === null || stepIndex < 0 || stepIndex >= steps.length) {
            return;
        }

        const currentStep = steps[stepIndex];

        if (Array.isArray(currentStep)) {
            const result = currentStep[0];

            clearHighlight();

            if ('state_name' in result) {
                setHighlightState(result as State);
            } else if ('current_state' in result) {
                setHighlightTransition(result as Transition);
            }
        }
    }, [stepIndex]);

    const clearHighlight = () => {
        setHighlightState(null);
        setHighlightTransition(null);
    };

    return (
        <div className="btn-control-container">
            <button className="btn-control" onClick={handleStepBackward} >
                &#129168;
                &#129168;
            </button>
            <button className="btn-control" >
                &#11035;
            </button>
            <button className="btn-control" onClick={handleRunClick} >
                &#11208;
            </button>
            <button className="btn-control" onClick={handleStepForward} >
                &#129170;
                &#129170;
            </button>
        </div>
    );
}
