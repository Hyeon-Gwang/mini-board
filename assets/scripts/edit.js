const $editBtn = document.querySelector("#editBtn")

function edit() {
  const password = document.querySelector('#editPasswordInput').value;  
  if(password === "") { return alert("비밀번호를 입력하세요."); };

  ajax.post
}
$editBtn.addEventListener("click", () => {
  console.log('clicked');
});