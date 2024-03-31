import axios, { AxiosPromise } from "axios";
import { StateJSONData } from "./state.types";


export const submitJSON = (text: string) =>
    axios.post('http://localhost:5000/receive_json', { text });

export const statesRequest = (): AxiosPromise<StateJSONData> =>
    axios.get<StateJSONData>('http://localhost:5000/get_states');