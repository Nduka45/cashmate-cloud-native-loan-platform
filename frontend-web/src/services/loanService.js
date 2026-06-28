import api from "./api";

export const createLoan = async (loanData) => {
  const response = await api.post("/api/loans", loanData, {
    headers: {
      "x-user-id": "e147afb2-5482-4600-8b6a-efef7fb12b26",
      "x-user-role": "customer",
    },
  });

  return response.data;
};

export const getMyLoans = async () => {
  const response = await api.get("/api/loans", {
    headers: {
      "x-user-id": "e147afb2-5482-4600-8b6a-efef7fb12b26",
      "x-user-role": "customer",
    },
  });

  return response.data;
};