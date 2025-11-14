//countSubarrays

const arr = [
  [1, 2, 3],
  [1, 2, 3],
  [1, 2, 3],
  [[1], [[2], [3]], [4]],
];
console.log(arr.length);
function countSubarrays(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      count++;

      count += countSubarrays(arr[i]);
    }
  }
  return count;
}

console.log(countSubarrays(arr));
