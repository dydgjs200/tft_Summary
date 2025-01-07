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
        }
      })
      .then((data) => {
        DisplayUserInfo(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function DisplayUserInfo(data) {
  const resultContainer = document.getElementById("userInfo");
  resultContainer.innerHTML = ""; // 이전 결과를 초기화

  // 데이터를 HTML 요소로 변환하여 화면에 표시
  const userInfo = `
    <div class="user-info">
      <h3>Player Information</h3>
      <p><strong>Game Name:</strong> ${data.gameName}</p>
      <p><strong>Region:</strong> ${data.region}</p>
      <p><strong>Tagline:</strong> ${data.tagLine}</p>
      <p><strong>Tier:</strong> ${data.tier}</p>
      <p><strong>Rank:</strong> ${data.rank}</p>
      <p><strong>LP:</strong> ${data.leaguePoints}</p>
    </div>
  `;
  resultContainer.innerHTML = userInfo;
}
