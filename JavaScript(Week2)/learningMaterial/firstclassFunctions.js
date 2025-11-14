// 1) function statement

/*
a();
function a(){
    console.log("a called");
}


// 2) function expression
b();

var b = function(){
    console.log("b called");
}
*/

// The major diffrence between function statement and function expression
// is hoisting

// a behaves as variable
// b gives eroor


// 3) Anonumus function

// a function without a name is a anonymus function
//anonymus functions are used at a place where functions are used as values


var b = function(){
    console.log("Ananymous function");
}


// 4) Named function expression

var b = function xyz(){
    console.log("xyz called");
}

//xyz()  // gives an error 
//b();


// 5) Diffrence between parameter & Arguments

var b = function(param1, param2){// param1, param2 are local variables
    console.log("Ananymous function");
}
b(1,2); // arguments

// 6) First Class Functions

//passing another function inside a function
// return a function from a function


