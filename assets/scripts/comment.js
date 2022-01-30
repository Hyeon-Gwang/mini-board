const $commentInput = document.querySelector("#commentInput");
const $commentEditBtns = document.querySelectorAll("#commentEditBtn");
const $commentDeleteBtns = document.querySelectorAll("#commentDeleteBtn");

let COMMENT_ID = 9999;

async function addComment(e) {
  if(e.keyCode === 13) {
    try {
      const comment = $commentInput.value;
      const date = getDate();
  
      if(comment === "") { return alert("코멘트를 작성해 주세요."); };
      
      const result = await axios.post(`/api/post/${postId}/comment`, { comment, date });
      if(result.data.result === "success") {
        $commentInput.value = "";
        return window.location.reload();
      }
    } catch(error) {
      alert("로그인 후 이용 가능합니다.");
      window.location.href = "/login";
    };
  };
};
$commentInput.addEventListener("keyup", addComment);

async function editComment(e) {
  if(e.keyCode === 13) {
    const comment = e.target.value;
    const result = await axios.patch(`/api/post/${postId}/comment/${COMMENT_ID}`, { comment });
    if(result.data.result === "success") {
      window.location.reload();
    }
  };
};

function ceateEditInput(e) {
  COMMENT_ID = e.target.dataset.id;
  const $commentBox = document.querySelector(`#commentBox-${COMMENT_ID}`);
  const $commentDiv = document.querySelector(`#commentBox-${COMMENT_ID} > #comment`);
  
  const $commentEditInput = `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 4px;">
      <input type='text' value="${$commentDiv.innerText}" onkeyup="editComment(event)" style="width: 95%;" />
      <button onclick="window.location.reload();" class="btn btn-outline-danger btn-sm">취소</button>
    </div>
  `
  const position = "beforeend"
  
  $commentBox.removeChild($commentDiv);
  $commentBox.insertAdjacentHTML(position, $commentEditInput);
}
if($commentEditBtns) {
  $commentEditBtns.forEach(editBtn => {
    editBtn.addEventListener("click", ceateEditInput);
  });
};

async function deleteComment(e) {
  const id = e.target.dataset.id;
  
  const result = await axios.delete(`/api/post/${postId}/comment/${id}`);
  if(result.data.result === "success") {
    return window.location.reload();
  };
};
if($commentDeleteBtns) {
  $commentDeleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", deleteComment);
  });
};