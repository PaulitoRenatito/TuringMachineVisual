export interface StateJSONData {
    states: StateData[];
}

export interface StateData {
    state_name: string;
    is_end_state: boolean;
    transitions: TransitionData[];
}

export interface TransitionData {
    current_state: string;
    next_state: string;
    conditions: ConditionData[];
}

export interface ConditionData {
    read_symbol: string;
    write_symbol: string;
    move_direction_symbol: string;
}