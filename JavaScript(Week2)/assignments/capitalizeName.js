function capitalizeMe(arr) {
  return arr.map(
    (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  );
}

function runTests() {
  const tests = [
    {
      input: ["mavis", "senaida", "letty"],
      expected: ["Mavis", "Senaida", "Letty"],
    },
    {
      input: ["samuel", "MABELLE", "letitia", "meridith"],
      expected: ["Samuel", "Mabelle", "Letitia", "Meridith"],
    },
    {
      input: ["Slyvia", "Kristal", "Sharilyn", "Calista"],
      expected: ["Slyvia", "Kristal", "Sharilyn", "Calista"],
    },
  ];

  tests.forEach((test, index) => {
    const result = capitalizeMe(test.input);
    console.log("Result", result);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);

    console.log(`Test ${index + 1}: ${passed ? "PASSED ✅" : "FAILED ❌"}`);
  });
}

// Run tests
runTests();
