// function to Convert Key, Values in an Object to Array

const arr = {
  D: 1,
  B: 2,
  C: 3,
};

function objectToArray(arr) {
  let result = [];

  for (let i in arr) {
    result.push(i, arr[i]);
  }
  return result;
}
console.log(objectToArray(arr));
