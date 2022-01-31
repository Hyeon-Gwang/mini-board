const $logoutBtn = document.querySelector("#logoutBtn");
if($logoutBtn) {
  $logoutBtn.addEventListener("click", async () => {
    await axios.delete("/api/auth");
    window.location.href = "/";
  });
};

// 유저 정보 불러오기
let user = {}
async function getUserInfo() {
  const result = await axios.get("/api/auth");
  user = result.data.user;
}

getUserInfo();