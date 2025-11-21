// Function to get Intersection and Union using Higher Order Functions
// function intersectionUnion(firstArr, secondArr) {
//   // Intersection
//   const intersection = firstArr
//     .filter((item) => secondArr.includes(item)) // keep only common values
//     .filter((item, index, self) => self.indexOf(item) === index); // remove duplicates

//   // Union
//   const union = [...firstArr, ...secondArr] //spread operator        // merge both arrays
//     .filter((item, index, self) => self.indexOf(item) === index); // remove duplicates

//   return [intersection, union];
// }

// function runTests() {
//   const tests = [
//     {
//       input: [
//         [1, 2, 3, 4, 4],
//         [4, 5, 9],
//       ],
//       expected: [[4], [1, 2, 3, 4, 5, 9]],
//     },
//     {
//       input: [
//         [1, 2, 3],
//         [4, 5, 6],
//       ],
//       expected: [[], [1, 2, 3, 4, 5, 6]],
//     },
//     {
//       input: [
//         [1, 1],
//         [1, 1, 1, 1],
//       ],
//       expected: [[1], [1]],
//     },
//     {
//       input: [[], [1, 2]],
//       expected: [[], [1, 2]],
//     },
//     {
//       input: [[7, 7, 7], []],
//       expected: [[], [7]],
//     },
//   ];

//   tests.forEach((test, index) => {
//     const result = intersectionUnion(test.input[0], test.input[1]);
//     console.log("Intersection & UNION : ", result);
//     const passed = JSON.stringify(result) === JSON.stringify(test.expected);

//     console.log(`Test ${index + 1}: ${passed ? "PASSED ✅" : "FAILED ❌"}`);
//   });
// }

// Run Tests
// runTests();

const address = {
  street: "house no 1",
  city: "Lahore",
  postalCode: 5400,
}

const address1 = {
  street: {
    houseNo: "123123",
    postalCode: 5400,
    nearby: {
      street: "Near Al kareem high school",
      lat: 19.1211,
      long: 27.2323
    }
  },
  city: "Lahore"
}

// const {street, city, postalCode } = address;

// const {street: {nearby: {long}}} = address1

// console.log(long)

// what is object

const employee = {
  name: "mohsin",
  age: 29,
  designation: {
    title: "TL",
    expeirence: "6+"
  }
}

// const myAddress = address;

// myAddress.city = "Karachi"

// console.log(address)

// // Shallow Copy

// // {
// //   street: "house no 1",
// //   city: "Lahore",
// //   postalCode: 5400,
// // }

// console.log(myAddress)

// {
//   street: "house no 1",
//   city: "Karachi",
//   postalCode: 5400,
// }


// Deep Copy


const myAddress = {}

const myAddress2 = Object.assign(address1);

console.log(address1)

myAddress2.city = "Karachi"
console.log(myAddress2)

// const numbers = [1, 2, 3, 4, 5];

// const numArray = numbers.map(num => console.log(num))

// console.log(numbers);
// console.log(numArray);