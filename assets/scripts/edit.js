const $editBtn = document.querySelector("#editBtn");
const $deleteBtn = document.querySelector("#deleteBtn");
const $postPasswordCheckBtn = document.querySelector("#editBtn");

// 포스트 수정하기
async function editPost() {
  const title = document.querySelector("#titleInput").value;
  const content = editor.getHTML();
  const writer = document.querySelector("#writerInput").value;
  const password = document.querySelector("#passwordInput").value;

  if(title === "") { return alert("제목을 입력하세요."); };
  if(content === "") { return alert("내용을 작성하세요."); };
  if(writer === "") { return alert("이름을 입력하세요."); };
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const passwordCheck = await axios.get(`/api/post/${postId}/password/${password}`);
  
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  if(passwordCheck.data.result === "success") {
    const result = await axios.patch(`/api/post/${postId}`, { title, content, writer });
    if(result.data.result === "success") {
      window.location.href = `/post?postId=${postId}`
    };
  };
};
if($editBtn) {
  $editBtn.addEventListener("click", editPost);
};

// 포스트 삭제하기
async function deletePost() {
  const password = document.querySelector("#passwordInput").value;
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const passwordCheck = await axios.get(`/api/post/${postId}/password/${password}`);
  
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  if(passwordCheck.data.result === "success") {
    const result = await axios.delete(`/api/post/${postId}`);
    if(result.data.result === "success") {
      window.location.href = "/";
    };
  };
};
if($deleteBtn) {
  $deleteBtn.addEventListener("click", deletePost);
};

// 포스트 비밀번호 확인하기
async function checkPostPassword(e) {
  const password = document.querySelector('#editPasswordInput').value;  
  const postId = e.target.dataset.id;
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const passwordCheck = await axios.get(`/api/post/${postId}/password/${password}`);
  
  if(passwordCheck.data.result === "success") { return window.location.href = `/edit?id=${postId}`; }
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  return alert("알 수 없는 오류: ", passwordCheck.error);
};
if($postPasswordCheckBtn) {
  $postPasswordCheckBtn.addEventListener("click", checkPostPassword);
};