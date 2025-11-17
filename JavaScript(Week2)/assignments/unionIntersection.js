// Function to get Intersection and Union using Higher Order Functions
function intersectionUnion(firstArr, secondArr) {
  // Intersection
  const intersection = firstArr
    .filter((item) => secondArr.includes(item)) // keep only common values
    .filter((item, index, self) => self.indexOf(item) === index); // remove duplicates

  // Union
  const union = [...firstArr, ...secondArr] //spread operator        // merge both arrays
    .filter((item, index, self) => self.indexOf(item) === index); // remove duplicates

  return [intersection, union];
}

function runTests() {
  const tests = [
    {
      input: [
        [1, 2, 3, 4, 4],
        [4, 5, 9],
      ],
      expected: [[4], [1, 2, 3, 4, 5, 9]],
    },
    {
      input: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      expected: [[], [1, 2, 3, 4, 5, 6]],
    },
    {
      input: [
        [1, 1],
        [1, 1, 1, 1],
      ],
      expected: [[1], [1]],
    },
    {
      input: [[], [1, 2]],
      expected: [[], [1, 2]],
    },
    {
      input: [[7, 7, 7], []],
      expected: [[], [7]],
    },
  ];

  tests.forEach((test, index) => {
    const result = intersectionUnion(test.input[0], test.input[1]);
    console.log("Intersection & UNION : ", result);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);

    console.log(`Test ${index + 1}: ${passed ? "PASSED ✅" : "FAILED ❌"}`);
  });
}

// Run Tests
runTests();
