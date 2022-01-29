const $commentInput = document.querySelector("#commentInput");

async function addComment(e) {
  if(e.keyCode === 13) {
    const comment = $commentInput.value;
    const date = getDate();
    
    const result = await axios.post(`/api/post/${postId}/comment`, { comment, userId: user._id, date });
    if(result.data.result === "success") {
      return window.location.reload();
    }
  };
};
$commentInput.addEventListener("keyup", addComment);