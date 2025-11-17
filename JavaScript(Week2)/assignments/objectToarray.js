// Function to Convert Object Keys & Values into Array
//Object.entries() is a built-in JavaScript method that converts an object into an array of key–value pairs.
function objectToArray(obj) {
  return Object.entries(obj);
}

function runTests() {
  const tests = [
    {
      input: { D: 1, B: 2, C: 3 },
      expected: [
        ["D", 1],
        ["B", 2],
        ["C", 3],
      ],
    },
    {
      input: { likes: 2, dislikes: 3, followers: 10 },
      expected: [
        ["likes", 2],
        ["dislikes", 3],
        ["followers", 10],
      ],
    },
    {
      input: {},
      expected: [],
    },
  ];

  tests.forEach((test, index) => {
    const result = objectToArray(test.input);
    console.log("Result ",result); 
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);

    console.log(`Test ${index + 1}: ${passed ? "PASSED ✅" : "FAILED ❌"}`);
  });
}

// Run Tests
runTests();
