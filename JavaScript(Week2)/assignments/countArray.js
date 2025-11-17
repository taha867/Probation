// Function to count number of arrays (including nested arrays)
function countSubarrays(arr) {
  return arr.reduce((count, item) => {
    if (Array.isArray(item)) {
      return count + 1 + countSubarrays(item);
    }
    return count;
  }, 0);
}

function runTests() {
  const tests = [
    {
      input: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ],
      expected: 3,
    },
    {
      input: [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [[1], [[2], [3]], [4]],
      ],
      expected: 9,
    },
    {
      input: [1, 2, 3],
      expected: 0,
    },
  ];

  tests.forEach((t, i) => {
    const result = countSubarrays(t.input);
    console.log("Result :",result);
    console.log(
      `Test ${i + 1}: ${result === t.expected ? "PASSED ✅" : "FAILED ❌"}`
    );
  });
}

// Run tests
runTests();
