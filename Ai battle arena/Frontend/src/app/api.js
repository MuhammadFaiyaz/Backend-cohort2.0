// Sample data for demonstration
export const SAMPLE_DATA = {
  problem: "write a factorial function in js",
  solution_1:
    "Here are a few ways to write a factorial function in JavaScript, depending on your preferred style.\n\n### 1. Iterative Approach (Most efficient & recommended for large numbers)\nThis uses a simple `for` loop. It's fast and won't cause a \"Maximum call stack size exceeded\" error.\n\n```javascript\nfunction factorial(n) {\n  if (n < 0) return \"Invalid input\";\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\n\nconsole.log(factorial(5)); // Output: 120 (5 * 4 * 3 * 2 * 1)\n```\n\n### 2. Recursive Approach (Clean & mathematical)\nThis function calls itself. It mimics the mathematical definition of a factorial ($n! = n \\times (n-1)!$).\n\n```javascript\nfunction factorialRecursive(n) {\n  if (n < 0) return \"Invalid input\";\n  if (n === 0 || n === 1) return 1;\n  return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### 3. One-Liner (Using ES6 Arrow Function & Recursion)\nA shorter, more concise version of the recursive approach using a ternary operator.\n\n```javascript\nconst factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));\n\nconsole.log(factorial(5)); // Output: 120\n```\n\n*Note: JavaScript handles numbers up to $170!$ accurately using standard numbers (`Infinity` after that due to floating-point limits). If you need extremely large numbers, you would need to use JavaScript's `BigInt` type.*",
  solution_2:
    "Certainly! Below is a simple implementation of a factorial function in JavaScript using both iterative and recursive approaches:\n\n### Iterative Approach:\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return undefined; // Factorial is not defined for negative numbers\n    let result = 1;\n    for (let i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Example usage:\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### Recursive Approach:\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return undefined; // Factorial is not defined for negative numbers\n    if (n === 0 || n === 1) return 1;\n    return n * factorialRecursive(n - 1);\n}\n\n// Example usage:\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### Explanation:\n- **Iterative Approach**: This method uses a loop to multiply numbers from 1 to `n`, storing the result in a variable.\n- **Recursive Approach**: This method calls itself with a smaller value of `n` until it reaches the base case (`n === 0` or `n === 1`), then multiplies the results as it unwinds the call stack.\n\nBoth functions handle the edge case where `n` is negative by returning `undefined`, as the factorial is not defined for negative numbers.\n\nChoose the approach that best fits your needs!",
  judge: {
    solution_1_score: 8.5,
    solution_2_score: 9.5,
    solution_1_reasoning:
      "Solution 1 provides three good implementations (iterative, recursive, one-liner) and includes a helpful note about BigInt for large factorials. However, returning a string 'Invalid input' for negative numbers is bad practice (returning undefined, NaN, or throwing an error is better), and the one-liner implementation incorrectly returns 1 for negative inputs.",
    solution_2_reasoning:
      "Solution 2 provides clean, readable, and idiomatic JavaScript code for both iterative and recursive approaches. It correctly handles edge cases like negative numbers by returning 'undefined' and provides clear explanations for both implementations.",
  },
};

/**
 * Simulates calling the AI models + judge with a delay.
 * Replace this with real API calls when backend is ready.
 */
export async function simulateBattleResponse(userMessage) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // For now always return the sample data (swap message for the actual prompt)
  return {
    ...SAMPLE_DATA,
    problem: userMessage,
  };
}
