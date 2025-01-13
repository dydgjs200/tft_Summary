function submitData(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const region = document.getElementById("region").value;
    const tagLine = document.getElementById("tagLine").value;
    const gameName = document.getElementById("gameName").value;

    if (!gameName) {
      alert("Game Name is required!");
      return;
    }

    const payload = {
      region: region,
      tagLine: tagLine,
    };

    // 서버로 데이터 전송
    fetch(`http://localhost:3000/user/${gameName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert(
            "플레이어 정보를 찾을 수 없습니다. region과 TagLine을 확인해주세요!",
          );
          throw new Error("Failed to fetch player information.");
        }
      })
      .then((data) => {
        // /:gameName 경로로 리다이렉트
        window.location.href = `/${gameName}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
