import axios from "axios";

const API_BASE_URL = "https://virusguru.onrender.com/api";

export const scanUrl = async (url) => {
    const response = await axios.post(`${API_BASE_URL}/urls/scan`, { url });
    return response.data;
};

export const getAnalysis = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/analyses/${id}`);
    return response.data;
};
