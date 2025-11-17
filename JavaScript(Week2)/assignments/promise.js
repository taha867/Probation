function getPhonesThen() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(data => data.map(user => user.phone));
}

// Usage:
getPhonesThen().then(phones => {
  console.log("Then Phones:", phones);
}).catch(err => {
  console.log("Error:", err);
});
