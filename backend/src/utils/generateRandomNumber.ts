export const generateRandomNumber = (length: number): number => {
  try {
    if (length <= 0) {
      throw new Error("Length must be a positive integer");
    }

    const min = Math.pow(10, length - 1); // Smallest number with the specified length
    const max = Math.pow(10, length) - 1; // Largest number with the specified length

    return Math.floor(Math.random() * (max - min + 1)) + min;
  } catch (error) {
    console.error("Error generating random number:", error);
    throw new Error("Error generating random number");
  }
};
