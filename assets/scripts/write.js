const $writeBtn = document.querySelector("#writeBtn");

// 포스트 작성하기
async function writePost() {
  try {
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
      window.location.href = `/post?id=${result.data.postId}`;
    };
  } catch(error) {
    alert("포스트 작성에 실패하였습니다.", error);
  };
};

if($writeBtn) {
  $writeBtn.addEventListener("click", writePost);
};