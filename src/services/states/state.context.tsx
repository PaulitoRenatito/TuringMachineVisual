import { ReactNode, createContext, useState } from "react";
import { StateData, TransitionData } from "./state.types";
import { statesRequest, submitJSON } from "./state.service";

interface StateContextType {
    states: StateData[];
    transitions: TransitionData[];
    isLoading: boolean;
    error: string;
    submit: (text: string) => void;
}
export const StateContext = createContext<StateContextType | null>(null);

interface StateContextProviderProps {
    children: ReactNode,
}
export const StateContextProvider = ({ children }: StateContextProviderProps) => {

    const [states, setStates] = useState<StateData[]>([]);
    const [transitions, setTransitions] = useState<TransitionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const onSubmit = (text: string) => {
        setIsLoading(true);
        handleJSONSubmission(text);
    }

    const handleJSONSubmission = (text: string) => {
        submitJSON(text)
            .then(() => {
                fetchStates();
            })
            .catch(err => {
                handleError(err);
            });
    };

    const fetchStates = () => {
        statesRequest()
            .then(response => {
                setStates(response.data.states);
                setIsLoading(false);
                console.log(response);
                console.log(states);
            })
            .catch(err => {
                handleError(err);
            });
    };

    const handleError = (err: any) => {
        setError(err);
        setIsLoading(false);
        console.log(err);
    };

    return (
        <StateContext.Provider
            value={{
                states,
                transitions,
                isLoading,
                error,
                submit: onSubmit,
            }}
        >
            {children}
        </StateContext.Provider>
    )
}