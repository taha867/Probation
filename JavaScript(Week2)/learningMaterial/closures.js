//beginners level

/*
function x() {
  for (var i = 1; i <= 5; i++) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  }
  console.log("Hello JavaScript");
}
x();


*/
// so this code is printing 6 five times,
// we were expecting that it will print 1 to 5 with 1 second delay
// this is happening because of closures

// i is refrening to same spot in memoer for each copy of it
//while i will incremet and dont stop for anything because javascript dont wait for anything

//solution:

//1)
// use let instead of var because it is block scoped so it will make
// new copies everytime let is called

/*
function x1(){
    for (let i=1; i<=5; i++){
    setTimeout(function(){
        console.log(i);
    },i * 1000);
}
    console.log("Hello JavaScript");
}
x1();
*/

//2)

//closures will be the solution
// we will make a closure and each time pass a new copy i in it

/*
function x2() {
  for (let i = 1; i <= 5; i++) {
    function close(i) {
      setTimeout(function () {
        console.log(i);
      }, i * 1000);
    }
    close(i);
  }
  console.log("Hello JavaScript");
}
x2();*/

//****************************************************************** */

//lets understand it with basic examples


/*
function outer(b) {
  function inner() {
    console.log(a, b);
  }
  var a = 10;
  // even if we use let (as it is block scope) it will form a closure
  return inner;
}
//outer()(); //calling the inner function
//Or we can write it as below
var close = outer("Hellow World");
close();

*/

// if uoter function is nested in another finction
//it will again form an enviorment with that function also

/*function outest(b) {
  var c = 20;
  function outer() {
    function inner() {
      console.log(a, b,c);
    }
    var a = 10;
    return inner;
  }
  return outer;
}

var close = outest("Hellow World");
close()();
*/

//if we have a conflicting global variable with same name
// in this example both are pointing to diffrent enviorments 
//so no change 


/*
function outest(b) {
  var c = 20;
  function outer() {
    function inner() {
      console.log(a, b,c);
    }
    //let a = 10;
    //if we dont have this line it will go to the global scope to resolve that issue
    //if it is not global error then the error occurs and it will Refrence Error
    return inner;
  }
  return outer;
}
let a =100;
var close = outest("Hellow World");
close()();

*/


/*

//example of clourses by encapsulation and data hiding
function counter(){
var count = 0;
function incrementcounter(){
  count++;
  console.log(count);
}
return incrementcounter;
}

//console.log(count);// we cant't do it now because we have encapsulated it using closure and did data hiding

var cntr1 = counter();
cntr1();

// make a fresh counter 
var cntr2 = counter();
cntr2();
*/

//it is not a good way if we say it is scalable and want decrement too
// we can use constructor function  and then makle ince=rement and decrement function 
//solution is below


/*
function counter(){
var count = 0;
//constructor functions
this.incrementCounter = function (){
  count++;
  console.log(count);
}

this.decrementCounter = function (){
  count--;
  console.log(count);
}
}
// this is constructor function so we will use new ke word
var cntr1 = new counter();
cntr1.incrementCounter();
cntr1.incrementCounter();
cntr1.incrementCounter();
cntr1.incrementCounter();
cntr1.decrementCounter();

*/


//Disadvantages:
//There could be overconsumption of memory



//Relation between closure and garbage collector

function a(){
  var x =0;
  function b(){
    console.log(x);
  }
}