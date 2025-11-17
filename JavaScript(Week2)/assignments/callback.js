function getPhonesCallback(callback) {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => {
      const phones = data.map((user) => user.phone);
      callback(null, phones);
    })
    .catch((error) => callback(error));
}

getPhonesCallback(function (err, result) {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Callback Phones:", result);
  }
});
