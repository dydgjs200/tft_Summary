function submitData(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const region = document.getElementById("region").value;
    const tagline = document.getElementById("tagline").value;
    const gameName = document.getElementById("gameName").value;

    if (!gameName) {
      alert("Game Name is required!");
      return;
    }

    const payload = {
      region: region,
      tagLine: tagline,
    };

    fetch(`http://localhost:3000/user/${gameName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          alert("Data sent successfully!");
        } else {
          alert("Failed to send data.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
