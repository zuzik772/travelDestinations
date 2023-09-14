//Variables
const url = "http://127.0.0.1:3000/";

const countryInput = document.querySelector("#country");
const titleInput = document.querySelector("#title");
const linkInput = document.querySelector("#link");
const arrivalDateInput = document.querySelector("#arrival-date");
const departureDateInput = document.querySelector("#departure-date");
const imageInput = document.querySelector("#image-upload");
const descriptionInput = document.querySelector("#description");
const saveDestination = document.querySelector("#save-destination");

saveDestination.addEventListener("click", addDestination);
async function addDestination(event) {
  event.preventDefault();
  const country = countryInput.value;
  const title = titleInput.value;
  const link = linkInput.value;
  const arrivalDate = arrivalDateInput.value;
  const departureDate = departureDateInput.value;
  const image = imageInput.value;
  const description = descriptionInput.value;

  const obj = {
    country,
    title,
    link,
    arrivalDate,
    departureDate,
    image,
    description,
  };

  const response = await saveToDatabase(obj);

  if (response.ok) {
    const body = await response.json();
    console.log(body);
    //Append New Elemnts to the first page
    console.log("Successfully appended docs");
  }
  if (response.status > 499) {
    alert("Server not working");
  } else if (response.status > 399) {
    alert("User error");
  } else {
    console.log("all is good");
  }
}

async function saveToDatabase(obj) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(obj),
  });
  console.log(response);
  return response;
}
