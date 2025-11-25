// Function to Remove Duplicates using filter()
function removeDuplicates(arr) {
  let result = arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
  return result;
}

function runTests() {
  const tests = [
    {
      input: [1, 0, 1, 0],
      expected: [1, 0],
    },
    {
      input: ["The", "big", "cat"],
      expected: ["The", "big", "cat"],
    },
    {
      input: ["John", "Taylor", "John"],
      expected: ["John", "Taylor"],
    },
    {
      input: [],
      expected: [],
    },
  ];

  tests.forEach((test, index) => {
    const result = removeDuplicates(test.input);
    console.log("Resulted array is:", result);

    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
    console.log(`Test ${index + 1}: ${passed ? "PASSED ✅" : "FAILED ❌"}`);
  });
}

// Run Tests
runTests();
