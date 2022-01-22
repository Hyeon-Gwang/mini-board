const $writeBtn = document.querySelector("#writeBtn");

function getDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);

  const hours = ('0' + today.getHours()).slice(-2); 
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2); 

  const fullDate = `${year}${month}${day}${hours}${minutes}${seconds}`
  return parseInt(fullDate);
};

function closeModal() {
  console.log("modal close");
};

async function writePost() {
  const title = document.querySelector("#titleInput").value;
  const content = document.querySelector("#contentInput").value;
  const writer = document.querySelector("#writerInput").value;
  const password = document.querySelector("#passwordInput").value;
  const date = getDate();

  if(title === "") { return alert("제목을 입력하세요."); };
  if(content === "") { return alert("내용을 작성하세요."); };
  if(writer === "") { return alert("이름을 입력하세요."); };
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  const result = await axios.post("http://localhost:8080/api/post/new", {
    title, content, writer, password, date,
  });

  if(result.data.result === "success") { 
    closeModal();
    window.location.href = "/";
  };
  if(result.data.result === "fail") { return alert("포스트 작성에 실패하였습니다.", result.data.error); };
};

$writeBtn.addEventListener("click", writePost);