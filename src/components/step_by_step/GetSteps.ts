import axios from "axios";

export const getSteps = async () => {
    try {
        const response = await axios.get('http://localhost:5000/run_steps');
        return response.data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
};