async function generateJoke() {
  const category = document.getElementById("category").value;
  const jokeElement = document.getElementById("joke");
  const loader = document.getElementById("loader");

  try {
    // Show loader
    loader.style.display = "block";
    jokeElement.textContent = "";
    jokeElement.classList.remove("error");

    const response = await fetch("http://localhost:3000/generate-joke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) throw new Error("Failed to fetch joke");

    const data = await response.json();
    jokeElement.textContent = data.joke;
  } catch (error) {
    jokeElement.textContent = "😢 Failed to load joke. Please try again!";
    jokeElement.classList.add("error");
  } finally {
    loader.style.display = "none";
  }
}
