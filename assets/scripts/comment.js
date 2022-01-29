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

}
if($commentEditBtns) {
  $commentEditBtns.forEach(editBtn => {
    editBtn.addEventListener("click", editComment);
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