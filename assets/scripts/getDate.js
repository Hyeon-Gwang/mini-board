// 현재 날짜, 시간 가져오기
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