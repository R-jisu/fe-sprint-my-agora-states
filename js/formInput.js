import agoraStatesDiscussions from "./data.js";
import convertToDiscussion from "./fragment.js"; // 개별 돔 생성

const $form = document.querySelector("form");
const $inputName = document.querySelector("#name");
const $inputTitle = document.querySelector("#title");
const $inputTextbox = document.querySelector("#story");
const $BtnSubmit = document.querySelector(".Btn__submit");
const $ul = document.querySelector("ul.discussions__container");
const $cntQ = document.querySelector(".count-Q");

let data;
const dataFromLocalStorage = localStorage.getItem("allQ");
if (dataFromLocalStorage) data = JSON.parse(dataFromLocalStorage);
else data = agoraStatesDiscussions.slice();

let limit = 10;
let page = 1;

let cryFlag = 0;

const toDay = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const hours = ("0" + today.getHours()).slice(-2);
  const minutes = ("0" + today.getMinutes()).slice(-2);
  const seconds = ("0" + today.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
//폼 내용을 기반으로 객체 생성
const questionToObject = () => {
  const avata_random = [
    "avatar-blue.png",
    "avatar-pink.png",
    "avatar-purple.png",
    "avatar-yello.png",
  ];
  const newQ = {
    id: String(new Date().getTime() + Math.random()),
    createdAt: toDay(),
    title: $inputTitle.value,
    author: $inputName.value,
    url: $inputTextbox.value,
    answer: null,
    avatarUrl: "./src/" + avata_random[parseInt(Math.random() * 4)],
  };
  return newQ;
};
//로컬스토리지에 저장
const localStore = (obj) => {
  data.unshift(obj);
  localStorage.setItem("allQ", JSON.stringify(data));
};

const getPage = (limit, page) => {
  const len = data.length - 1;
  let pageStart = Number(page - 1) * Number(limit);
  let pageEnd = Number(pageStart) + Number(limit);
  if (page < 0) page = 0;
  if (pageEnd >= len) {
    pageEnd = len;
  }
  return { pageStart, pageEnd };
};

//re렌더링
const render = (el, from, to) => {
  if (!from && !to) {
    from = 0;
    to = 10;
  }

  if (cryFlag) {
    from = 0;
    to = data.length - 1;
  }
  console.log(to);
  el.replaceChildren();
  el.append(convertToDiscussion(data, from, to));
  countQ(data.length);
  return;
};
const countQ = (length) => {
  $cntQ.textContent = `${length}개의 `;
};

const $bounce = document.querySelectorAll(".bounce");
//submit 제출버튼 클릭
const formSubmit = (e) => {
  let isFormValid = $form.checkValidity();
  if (!isFormValid) {
    $form.reportValidity();
    return;
  }
  e.preventDefault();
  //local 저장
  localStore(questionToObject());
  render($ul);
  cryFlag = 0;
  document.querySelector(".all-list").click();
  //초기화
  $inputTitle.value = "";
  $inputName.value = "";
  $inputTextbox.value = "";
  $bounce.forEach((el) => {
    el.classList.remove("bounce");
    el.offsetWidth;
    el.classList.add("bounce");
  });
};

$BtnSubmit.addEventListener("click", formSubmit);

const $back = document.querySelector(".Btn-page-back");
const $next = document.querySelector(".Btn-page-next");

$back.addEventListener("click", () => {
  if (cryFlag) return;
  if (page > 1) page -= 1;
  const { pageStart, pageEnd } = getPage(limit, page);
  render($ul, pageStart, pageEnd);
});

$next.addEventListener("click", () => {
  if (cryFlag) return;
  if (limit * page < data.length - 1) page += 1;
  const { pageStart, pageEnd } = getPage(limit, page);
  render($ul, pageStart, pageEnd);
});

const $Btn_allList = document.querySelector(".all-list");
const $Btn_onlyCry = document.querySelector(".only-cry");

const viewOnlyNeedAnswer = () => {
  $Btn_onlyCry.classList.add("clicked");
  $Btn_allList.classList.remove("clicked");
  cryFlag = 1;
  render($ul);
  const $li = document.querySelectorAll("li");
  $li.forEach((el) => {
    if (el.textContent.includes("😍")) {
      el.classList.add("hide-list");
    }
  });
};

const viewAll = () => {
  $Btn_allList.classList.add("clicked");
  $Btn_onlyCry.classList.remove("clicked");
  cryFlag = 0;
  render($ul, 0, 10);
  const $li = document.querySelectorAll("li");
  $li.forEach((el) => {
    el.classList.remove("hide-list");
  });
};

$Btn_allList.addEventListener("click", viewAll);
$Btn_onlyCry.addEventListener("click", viewOnlyNeedAnswer);

export default countQ;
