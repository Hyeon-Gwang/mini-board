const $searchInput = document.querySelector('#searchInput');
const $postRows = document.querySelectorAll("tbody > tr");

// 포스트 검색하기
function editPost(e) {
  if(e.keyCode === 13) {
    const searchType = document.querySelector('#searchType').value;
    const searchValue = $searchInput.value;
    
    if(searchType === "none") { return alert('검색 타입을 선택하세요.'); };
    if(searchValue === "") { return alert("검색 내용을 입력하세요."); };

    window.location.href = `/search?type=${searchType}&value=${searchValue}`;
  }
}
$searchInput.addEventListener("keyup", editPost)

// 개별 포스트 페이지로 이동하기
function movePostPage(e) {
  const postId = e.target.dataset.id;
  
  window.location.href = `/post?id=${postId}`;
};
$postRows.forEach(postRow => {
  postRow.addEventListener("click", movePostPage);
});