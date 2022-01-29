const $commentInput = document.querySelector("#commentInput");
const $commentEditBtns = document.querySelectorAll("#commentEditBtn");
const $commentDeleteBtns = document.querySelectorAll("#commentDeleteBtn");

async function addComment(e) {
  if(e.keyCode === 13) {
    const comment = $commentInput.value;
    const date = getDate();
    
    const result = await axios.post(`/api/post/${postId}/comment`, { comment, userId: user._id, date });
    if(result.data.result === "success") {
      $commentInput.value = "";
      return window.location.reload();
    }
  };
};
$commentInput.addEventListener("keyup", addComment);

function editComment(e) {
  if(e.keyCode === 13) {
    console.log('내용:', e.target.value);
  }
}

function ceateEditInput(e) {
  const commentId = e.target.dataset.id;
  const $commentBox = document.querySelector(`#commentBox-${commentId}`);
  const $commentDiv = document.querySelector(`#commentBox-${commentId} > #comment`);
  
  const $commentEditInput = `<input type='text' value="${$commentDiv.innerText}" onkeyup='editComment(event)' />`
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
  const commentId = e.target.dataset.id;
  
  const result = await axios.delete(`/api/post/${postId}/comment/${commentId}`, commentId);
  if(result.data.result === "success") {
    return window.location.reload();
  };
};
if($commentDeleteBtns) {
  $commentDeleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", deleteComment);
  });
};