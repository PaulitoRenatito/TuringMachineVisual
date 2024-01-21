interface State {
    state_name: string;
    is_end_state: boolean;
    transitions: Transition[];
}

interface Transition {
    current_state: string;
    next_state: string;
    conditions: Condition[];
}

interface Condition {
    read_symbol: string;
    write_symbol: string;
    move_direction_symbol: string;
}

export type { State, Transition, Condition };