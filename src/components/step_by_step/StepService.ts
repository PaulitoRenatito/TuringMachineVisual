import { getSteps } from "./GetSteps"

export const executeGetSteps = async () => {
    const steps = await getSteps();
    return steps || []
}