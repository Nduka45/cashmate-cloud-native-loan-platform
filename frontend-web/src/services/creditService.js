import api from "./api";

export const evaluateCredit = async (creditData) => {
  const response = await api.post("/api/credit/evaluate", creditData);
  return response.data;
};