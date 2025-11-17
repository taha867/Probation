async function getPhonesAsync() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();

  return data.map(user => user.phone);
}


async function init() {
  const phones = await getPhonesAsync();
  console.log("Async/Await Phones:", phones);
}

init();


