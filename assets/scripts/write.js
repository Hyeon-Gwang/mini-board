const $writeBtn = document.querySelector("#writeBtn");
const $editBtn = document.querySelector("#editBtn");
const $deleteBtn = document.querySelector("#deleteBtn");

// 포스트 작성하기
async function writePost() {
  const title = document.querySelector("#titleInput").value;
  const content = editor.getHTML();
  const writer = document.querySelector("#writerInput").value;
  const password = document.querySelector("#passwordInput").value;
  const date = getDate();

  if(title === "") { return alert("제목을 입력하세요."); };
  if(content === "") { return alert("내용을 작성하세요."); };
  if(writer === "") { return alert("이름을 입력하세요."); };
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const result = await axios.post("/api/post/new", {
    title, content, writer, password, date,
  });

  if(result.data.result === "success") { 
    window.location.href = "/";
  };
  if(result.data.result === "error") { return alert("포스트 작성에 실패하였습니다.", result.error); };
};

if($writeBtn) {
  $writeBtn.addEventListener("click", writePost);
}

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

  const passwordCheck = await axios.get(`/api/post/${jsPost.id}/password/${password}`);
  
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  if(passwordCheck.data.result === "success") {
    const result = await axios.patch(`/api/post/${jsPost.id}`, { title, content, writer });
    if(result.data.result === "success") {
      window.location.href = `/post?postId=${jsPost.id}`
    }
  }

}
if($editBtn) {
  $editBtn.addEventListener("click", editPost);
}

// 포스트 삭제하기
async function deletePost() {
  const password = document.querySelector("#passwordInput").value;
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const passwordCheck = await axios.get(`/api/post/${jsPost.id}/password/${password}`);
  
  if(passwordCheck.data.result === "fail") { return alert("비밀번호가 일치하지 않습니다."); }
  if(passwordCheck.data.result === "success") {
    const result = await axios.delete(`/api/post/${jsPost.id}`);
    if(result.data.result === "success") {
      window.location.href = "/";
    }
  }

};
if($deleteBtn) {
  $deleteBtn.addEventListener("click", deletePost);
};