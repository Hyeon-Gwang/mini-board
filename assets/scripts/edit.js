const $editBtn = document.querySelector("#editBtn");

async function edit(e) {
  const password = document.querySelector('#editPasswordInput').value;  
  const postId = e.target.dataset.id;
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const passwordCheck = await axios.get(`/api/post/${postId}/password/${password}`);
  
  if(passwordCheck.data.result === "success") { return window.location.href = `/write?postId=${postId}`; }
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  return alert("알 수 없는 오류: ", passwordCheck.error);
}
$editBtn.addEventListener("click", edit);