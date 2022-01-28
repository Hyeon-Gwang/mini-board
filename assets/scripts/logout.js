const $logoutBtn = document.querySelector("#logoutBtn");

if($logoutBtn) {
  $logoutBtn.addEventListener("click", async () => {
    await axios.delete("/api/auth");
    window.location.href = "/";
  });
};