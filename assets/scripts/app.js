// axios.defaults.url = 'http://localhost:8080/api';

const $writeBtn = document.querySelector('#writeBtn');

async function writePost() {
  const title = document.querySelector('#titleInput').value;
  const content = document.querySelector('#contentInput').value;
  const password = document.querySelector('#passwordInput').value;

  if(title === '') { return alert('제목을 입력하세요.'); };
  if(content === '') { return alert('내용을 작성하세요.'); };
  if(password === '') { return alert('비밀번호를 입력하세요.'); }

  const result = await axios.post('http://localhost:8080/api/test', {
    title, content, password,
  });

  console.log('result: ', result);
};

$writeBtn.addEventListener('click', writePost);