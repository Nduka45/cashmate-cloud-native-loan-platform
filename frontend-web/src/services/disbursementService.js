import api from "./api";

export const createDisbursement = async (disbursementData) => {
  const response = await api.post("/api/disbursements", disbursementData);
  return response.data;
};