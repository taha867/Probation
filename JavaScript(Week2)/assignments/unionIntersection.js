//function to Union and Intersection of Arrays

const arr1 = [1, 8, 2, 3, 4, 4];
const arr2 = [4, 5, 9, 8];

function intersectionUnion(arr1, arr2) {
  let union = [];
  let intersection = [];

  //intersection
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i]) && !intersection.includes(arr1[i])) {
      intersection.push(arr1[i]);
    }
  }
  //union of arr1
  for (let i = 0; i < arr1.length; i++) {
    if (!union.includes(arr1[i])) {
      union.push(arr1[i]);
    }
  }
  //union for arr2
  for (let i = 0; i < arr2.length; i++) {
    if (!union.includes(arr2[i])) {
      union.push(arr2[i]);
    }
  }

  return [intersection, union];
}

console.log(intersectionUnion(arr1, arr2));






