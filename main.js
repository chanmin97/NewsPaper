//https://newsapi.org/    api address
let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", (keyword) => getNewsBySearch(keyword));
let searchInput = document.getElementById("search-input");
let url;
let page = 1;
let total_pages = 0;

const getNews = async () => {
  try {
    let header = new Headers({
      "X-Api-Key": "64cd9fa3540247ba9df268f3a9cfc0a4",
    });

    url.searchParams.set("page", page); //&page=

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      console.log("리스폰스", response);
      console.log("데이터", data);
      news = data.articles;
      total_pages = Math.ceil(data.totalResults / 20);

      if (data.totalResults == 0) {
        throw new Error("검색 된 결과물이 없습니다.");
      }
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("에러는 말이야", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  
  url = new URL(
    "https://newsapi.org/v2/top-headlines?country=kr&apiKey=64cd9fa3540247ba9df268f3a9cfc0a4"
  );

  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${topic}&apiKey=64cd9fa3540247ba9df268f3a9cfc0a4`
  );

  getNews();
};

const getNewsBySearch = async (keyword) => {
  let searchWord = searchInput.value;
  url = new URL(
    `https://newsapi.org/v2/everything?q=${searchWord}&apiKey=64cd9fa3540247ba9df268f3a9cfc0a4`
  );

  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((news) => {
      if (news.description == null) {
        news.description = "내용없음";
      }
      if (news.author == null) {
        news.author = "글쓴이 없음";
      }
      if (news.urlToImage == null) {
        news.urlToImage =
          "https://i.ytimg.com/vi/pZhgbQNy31s/maxresdefault.jpg";
      }
      return `
        <div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${news.urlToImage}"/>
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p class="news-description">
                    ${news.description}
                </p>
                <div>
                ${news.author} * ${moment(news.publishedAt).fromNow()}
                </div>
            </div>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > total_pages) {
    last = total_pages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    pagenationHTML = `<li class="page-item">
  <a class="page-link" onclick="moveToPage(1)" href="#" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>
<li class="page-item">
  <a class="page-link" onclick="moveToPage(${
    page - 1
  })" href="#" aria-label="Previous">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  }

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" onclick="moveToPage(${i})" href="#">${i}</a></li>`;
  }
  if (last < total_pages || page == 1) {
    pagenationHTML += `<li class="page-item">
  <a class="page-link" onclick="moveToPage(${
    page + 1
  })" href="#" aria-label="Next">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>
<li class="page-item">
  <a class="page-link" onclick="moveToPage(total_pages)" href="#" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;

  getNews();
};

getLatestNews();

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};


