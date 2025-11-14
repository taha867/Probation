//function to Capitalize the Names (function that takes an array of names and returns an array with the first letter capitalized.)

const arr = ["samuel", "MABELLE", "letitia", "meridith"];

function capitalizeMe(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    let name = arr[i];

    let firstChr = name.charAt(0).toUpperCase();
    let rest = name.slice(1).toLowerCase();
    result.push(firstChr + rest);
  }
  return result;
}

console.log(capitalizeMe(arr));
