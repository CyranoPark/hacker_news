const $moreBtn = document.querySelector('.more');
const $logotitle = document.querySelector('.title');
let topList = [];
let page = 1;

topListLayout(page);
getTopList();

$moreBtn.addEventListener('click', function () {
  page++;
  topListLayout(page);
  getTopList();
});

$logotitle.addEventListener('click', function () {
  page = 1;
  topListLayout(page);
  getTopList();
});


function getTopList () {
  $.get({
    url : 'https://hacker-news.firebaseio.com/v0/topstories.json',
    error : function () {
      alert('데이터를 가져올 수 없습니다.');
    },
    success : function (data) {
      topList = data;
      writeTopList(topList);
    }
  });
}

function writeTopList (topArticles) {
  const startIdx = (page * 30) - 29;
  // let voteImgs = document.querySelectorAll('.article-top > img');
  const $articles = document.querySelectorAll('.article');
  const $titles = document.querySelectorAll('.article-title');
  const $sites = document.querySelectorAll('.site');
  const $articleBottom = document.querySelectorAll('.article-bottom > span');
  const $rank = document.querySelectorAll('.rank');
  console.log(topArticles[40])
  for (let i = startIdx; i < startIdx + 30; i++) {
    $.get({
      url : `https://hacker-news.firebaseio.com/v0/item/${topArticles[i - 1]}.json?print=pretty`,
      error : function () {
        alert('기사를 읽어오는데 실패했습니다.');
      },
      success : function (data) {
        let elIdx = i - startIdx;
        let siteUrl = data.url ? data.url.split('/')[2] : '';
        let creatTime = data.time;
        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        let elaspedTime = (currentTime - creatTime) / 60000;
        let elaspedTxt = `${Math.round(elaspedTime)} min ago`;
        if (Math.round(elaspedTime) > 60) {
          elaspedTxt = `${Math.round(elaspedTime / 60)} hours ago`;
        } else if (Math.round(elaspedTime) > 1440) {
          elaspedTxt = `${Math.round(elaspedTime / 1440)} days ago`;
        }

        $articles[elIdx].dataset.id = data.id;
        $rank[elIdx].textContent = i + '.';
        $titles[elIdx].textContent = data.title;
        $sites[elIdx].textContent = `(${siteUrl})`;
        $articleBottom[((elIdx + 1) * 8) - 8].textContent = `${data.score} points`;
        $articleBottom[((elIdx + 1) * 8) - 7].textContent = 'by';
        $articleBottom[((elIdx + 1) * 8) - 6].textContent = data.by;
        $articleBottom[((elIdx + 1) * 8) - 5].textContent = elaspedTxt;
        $articleBottom[((elIdx + 1) * 8) - 4].textContent = '|';
        $articleBottom[((elIdx + 1) * 8) - 3].textContent = 'hidden';
        $articleBottom[((elIdx + 1) * 8) - 2].textContent = '|';
        $articleBottom[((elIdx + 1) * 8) - 1].textContent = data.descendants;
      }
    })
  }
}

// 보트 : /vote?id=20352417&how=up&goto=news
// 타이들 : 기사 링크, 
// 사이트 주소 : 기사를 작성한 사이트 주소 링크,
// 스코어 : 
// 작성자 : /user?id=sohkamyung
// 작성시간 : /item?id=20352417
// hide : hide?id=20352417&goto=news
// 댓글 수

function topListLayout (page) {
  const $contentsBox = document.querySelector('.contents-box');

  while($contentsBox.firstChild) {
    $contentsBox.removeChild($contentsBox.firstChild);
  }

  let startNum = (page * 30) - 29;
  
  for (let num = startNum; num < startNum + 30; num++) {
    let $article = document.createElement('div');
    $article.className = 'article';

    for (let i = 0; i < 3; i++) {
      let $div = document.createElement('div');
      $article.appendChild($div);
    }
    $article.children[0].className = 'space';
    $article.children[1].className = 'article-top';
    $article.children[2].className = 'article-bottom';
    
    let $rank = document.createElement('div');
    $rank.className = 'rank'
    let $img = document.createElement('img');
    $img.setAttribute('src', 'asset/img/arrow.gif');
    $img.setAttribute('alt', 'vote arrow');
    let $articleTitle = document.createElement('span');
    $articleTitle.className = 'article-title';
    let $site = document.createElement('span');
    $site.className = 'site';
  
    $article.children[1].appendChild($rank);
    $article.children[1].appendChild($img);
    $article.children[1].appendChild($articleTitle);
    $article.children[1].appendChild($site);
  
    for (let j = 0; j < 8; j++) {
      let $span = document.createElement('span');
      $article.children[2].appendChild($span);
    }
    $contentsBox.appendChild($article);
  }
}