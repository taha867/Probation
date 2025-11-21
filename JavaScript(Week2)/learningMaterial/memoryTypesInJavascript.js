/* Stack (primitive data type) */

//deep copy
console.log("\n\n\n1.1) Stack \n Deep Copy\n\n");
let Name = "Muhammad Taha"
let anothername = Name
Name = "ali"

console.log(Name);
console.log(anothername);

// (these values are stored in stack, so the make a copy of variable)


/* Heap (Non-primitive data type) */
//shallow copy (using assignment operator)
console.log("\n\n\n2.1) Heap \n Shallow Copy\n\n");
const address = {
    houseNo : 505,
    block: 1,
    sector: "A-2",
    Area: "Town Ship",
    city: "Lahore",
    citizenship:{
        province: "punjab",
        Countary: "USA"
    }
}

// const address1 = address;
// address1.city = "Karachi";

// console.log(address);
// console.log(address1);


// console.log("\n\n\n2.2) Heap \n Deep Copy\n\n");

// //object.assign() dont work for nested objects, it doesn't do deep copy in this case 
// const address3 = Object.assign({},address);
// address3.city = "Multan";
// address3.citizenship.Countary = "India";

// console.log(address);
// console.log(address3);


// do deep copy using sepread operator
console.log("\n\n\n2.2.1) using spread operator\n\n");

//object.assign() dont work for nested objects, it doesn't do deep copy in this case 
let address4 = {...address}
address4 = {
    ...address4,
    city : "Multan",
    citizenship:{
        ...address4.citizenship,
        province:"KPK"
    }

}

console.log(address);
console.log(address4);

// bothe are pointing to same memory space in heap so change in value will affect the change in another value