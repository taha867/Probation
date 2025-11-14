//Map, filter and reduce are Higher Order Function

// 1) MAP:   it is used to trasnform an array into a new array
/*
const arr = [5, 1, 3, 2, 6];
//double a number
function double(x){
    return x*2;
}
//triple a number
function triple(x){
    return x*3;

}
// convert number into binary
function binary(x){
    return x.toString(2);
}
const output = arr.map(binary);




//ORVYou can aslo write it as

const output1 = arr.map(function binary(x){
    return x.toString(2);
});
console.log(output1);

//AND Like this too


const output2 = arr.map((x)=>{
    return x.toString(2);
});

*/

//2) Filter:  Filter function is basically used to filter values inside an array

/*
const arr = [5,1,3,2,6];

//filter odd values
function isodd(x){
    if(x%2 == 0)
        return false;
    else
        return true;
}

var output = arr.filter(isodd);
console.log(output);

//filter even values
function iseven(x){
    if(x%2 != 0)
        return false;
    else
        return true;
}

var output1 = arr.filter(function iseven(x){
    if(x%2 != 0)
        return false;
    else
        return true;
});
console.log(output1);

*/

// 3) Reduce: used at a place where u use all values of array and came up with a single solution
/*
const arr = [5, 1, 3, 2, 6];

//Sum

//reduce function takes first argument as a function as parameter and that function has two 
//parameters in it one is accumulator and one is current and the second argument of reduce function
//is the initial value of the accumulator acc

//reduces itrates over each and every value of array
//->curr => represents the value of array
//->acc => accumulate result out of these values (basically function that is performing on values)
const output = arr.reduce(function(acc, curr){
    acc = acc + curr;
    return acc;
},0);
console.log(output);

// find max in array

const output1 = arr.reduce(function(acc,crr){
    if(crr>acc){
        acc = crr;
    }
    return acc;
},0)
console.log(output1);

*/

//********************************************************* */
//Advanced and complicated examples

const users = [
  { firstName: "akshay", lastName: "saini", age: "26" },
  { firstName: "Muhammad", lastName: "Taha", age: "22" },
  { firstName: "Ali", lastName: "Haider", age: "50" },
  { firstName: "deepika", lastName: "padukon", age: "26" },
];
//1) map
// fetch full name of users
function fullname(x) {
  return x.firstName + " " + x.lastName;
}
const output = users.map(fullname);
console.log(output);

//2) reduce
//how many people have that age
//{26: 2}

const output1 = users.reduce(function (acc, crr) {
  if (acc[crr.age]) {
    acc[crr.age] = ++acc[crr.age];
  } else {
    acc[crr.age] = 1;
  }
  return acc;
}, {});

console.log(output1);

//3) Filter And Map (Chaining)
//First name of all the people whose age is less than 30

const output2 = users
  .filter((x) => x.age < 30)
  .map((x) => 
    x.firstName
  );

 console.log(output2);