import api from "./api";

export const askAssistant = async (question, history = []) => {
  try {
    const res = await api.post("/ai/assistant", { question, history });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Assistant is unavailable right now" };
  }
};
