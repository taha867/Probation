// 1) What is a callback function in javascript ?
//function inside it is a callback function

/*
setTimeout(function(){
console.log("timer");
},5000);

function x(y) {
    console.log("x");
    y();
}

x(function y(){
    console.log("y");
});
*/

//callback functions give us power of asynchronous

//2) Event Listners

document.getElementById("clickMe").addEventListener("click", function xyz() {
  console.log("Button Clicked");
});

//make a closure and see how many times button was cliked and make it secure

function attacheventlistner() {
  let count = 0;
  document.getElementById("clickMe").addEventListener("click", function xyz() {
    console.log("Button Clicked", ++count);
  });
}

attacheventlistner();



//why do we need to remove Event Listners

//Event listners are heavy, it takes memoery
// when u attach event listner it makes a closure
//good practice is generally to free up the event listner

