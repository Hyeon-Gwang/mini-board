const $commentInput = document.querySelector("#commentInput");

async function addComment(e) {
  if(e.keyCode === 13) {
    const comment = $commentInput.value;
    const date = getDate();
    
    await axios.post(`/api/post/${postId}/comment`, { comment, userId: user._id, date });
  };
};
$commentInput.addEventListener("keyup", addComment);