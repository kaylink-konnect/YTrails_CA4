// CA3: Banff weather
const weather = document.querySelector("#weather");

async function getWeather() {
  try {
    const url = "https://api.open-meteo.com/v1/forecast"
      + "?latitude=51.18&longitude=-115.57"
      + "&current=temperature_2m";
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    const temp = data.current?.temperature_2m;
    if (typeof temp !== "number") throw new Error("No data");
    weather.textContent = `Temperature: ${temp}°C`;
  } catch (error) {
    weather.textContent = "Weather unavailable. Please try again later.";
  }
}

// CA2: Enquiry form validation
const form = document.getElementById("enquiryForm");
const fields = ["name", "email", "trailLength", "message"];

function validate(id) {
  const input = document.getElementById(id);
  const value = input.value.trim();
  let error = "";
  if (!value) error = "This field is required";
  else if (id === "email" && !input.checkValidity())
    error = "Enter a valid email address";
  else if (id === "message" && value.length > 500)
    error = "Message must be 500 characters or less";

  const errorId = id === "trailLength" ? "trailError" : id + "Error";
  document.getElementById(errorId).textContent = error;
  input.setAttribute("aria-invalid", error ? "true" : "false");
  return !error;
}

fields.forEach(id => {
  const input = document.getElementById(id);
  let timer;
  input.addEventListener("blur", () => validate(id));
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => validate(id), 300);
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const valid = fields.map(id => validate(id)).every(Boolean);
  if (!valid) return;
  const data = Object.fromEntries(new FormData(form).entries());
  console.log(JSON.stringify(data, null, 2));
  document.getElementById("feedback").textContent =
    "Enquiry validated (demo only; not sent).";
  form.reset();
});

getWeather();
