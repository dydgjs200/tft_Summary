// submitData 함수
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
          throw new Error("Failed to fetch player information.");
        }
      })
      .then((data) => {
        loadModal(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// 모달 HTML 로드 및 데이터 표시
function loadModal(data) {
  // 기존에 추가된 모달이 있으면 제거
  const existingModal = document.getElementById("modal");
  if (existingModal) {
    existingModal.remove();
  }

  fetch("userModal.html") // modal.html 파일을 가져옴
    .then((response) => response.text())
    .then((html) => {
      // HTML 내용을 삽입
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = html;

      // body에 모달 추가
      document.body.appendChild(modalContainer);

      // 동적으로 추가된 모달 컨텐츠를 채우기
      const modalContent = modalContainer.querySelector("#modal-content");
      modalContent.innerHTML = `
        <div class="user-info">
          <h3>Player Information</h3>
          <p><strong>Game Name:</strong> ${data.gameName}</p>
          <p><strong>Region:</strong> ${data.region}</p>
          <p><strong>Tagline:</strong> ${data.tagLine}</p>
          <p><strong>Tier:</strong> ${data.tier}</p>
          <p><strong>Rank:</strong> ${data.rank}</p>
          <p><strong>LP:</strong> ${data.leaguePoints}</p>
          <div class="modal" id="modal">
            <div class="modal-content" id="modal-content"></div>
            <button class="close-btn" onclick="closeModal()">Close</button>
          </div>
        </div>
      `;

      // 모달 열기
      openModal();
    })
    .catch((error) => {
      console.error("Error loading modal:", error);
    });
}

// 모달 열기
function openModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.remove(); // 모달을 제거
  }
}
