// Picks the best message out of an axios error
export const getErrorMessage = (err) => {
  const data = err.response?.data;

  return (
    data?.message ??
    data?.errors?.[0]?.msg ??
    "Something went wrong. Please try again."
  );
};