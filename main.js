let articles = [];
let page = 1;
let totalPage = 1;
const PAGE_SIZE = 10;
let menus = document.querySelectorAll("#menu-list button");
let searchInput = document.getElementById("search-input");

// API
const API_KEY = "8880e04845964d05a6f47051baf05ff6";

// URL
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
);

//카테고리 클릭 이벤트
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

// 키보드 엔터 이벤트
searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    getNewsByKeyWord();
  }
});

// API 호출
const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        throw new Error("검색어와 일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};

// 최신 뉴스
const getLatestNews = () => {
  page = 1; // 9. 새로운거 search마다 1로 리셋
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );

  getNews();
};

//키워드별 검색
const getNewsByKeyWord = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
};

//카테고리별 검색
const getNewsByTopic = (e) => {
  const topic = e.target.textContent.toLowerCase();

  page = 1;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  );

  getNews();
};

//검색창 버튼
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

//화면 렌더링
const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${
                  news.urlToImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${
        news.title
      }</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"}  ${moment(
        news.publishedAt
      ).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};

//페이지네이션
const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;

  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

//페이지네이션
const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

//에러
const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

//사이드 버튼 스타일
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

//사이드 버튼 스타일
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

getLatestNews();
