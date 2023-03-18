// Dummy Data를 받아 요소 생성 후 초기값 할당
// 이를 fragment에 자식 노드로 만든 후 fragment를 반환
import modal from "./modal.js";

const convertToDiscussion = (data, from, to) => {
  const $fragment = document.createDocumentFragment();
  for (let i = from; i < to; i += 1) {
    const $li = document.createElement("li"); // li 요소 생성
    $li.className = "discussion__container"; // 클래스 이름 지정
    //li 자식요소
    const avatarWrapper = document.createElement("div");
    avatarWrapper.className = "discussion__avatar--wrapper";
    const discussionContent = document.createElement("div");
    discussionContent.className = "discussion__content";
    const discussionAnswered = document.createElement("div");
    discussionAnswered.className = "discussion__answered";
    //avatar--wrapper 자식요소
    const avatarImg = document.createElement("img");
    avatarImg.classList.add("discussion__avatar--image");
    avatarImg.src = data[i].avatarUrl;
    avatarImg.alt = "avatar of " + data[i].author;
    avatarWrapper.append(avatarImg);
    //content 자식요소
    const discussionTitle = document.createElement("h2");
    discussionTitle.textContent = data[i].title;
    discussionTitle.setAttribute("id", data[i].id);
    discussionTitle.classList.add("discussion__title");
    const discussionInfo = document.createElement("div");
    discussionInfo.textContent = `${data[i].author} / ${data[i].createdAt}`;
    discussionInfo.classList.add("discussion__information");
    discussionContent.append(discussionTitle, discussionInfo);
    //discussionAnswered 자식요소
    const discussionCheckbox = document.createElement("div");
    if (!!data[i].answer === !!null) {
      discussionCheckbox.textContent = "🥺";
    } else {
      discussionCheckbox.textContent = "😍";
    }
    $li.addEventListener("click", modal);
    discussionAnswered.append(discussionCheckbox);

    //li append
    $li.append(avatarWrapper, discussionContent, discussionAnswered);
    $fragment.appendChild($li);
  }
  return $fragment;
};

export default convertToDiscussion;
