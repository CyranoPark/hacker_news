(function () {
  const $moreBtn = document.querySelector('.more');
  const $logotitle = document.querySelector('.title');
  const $new = document.querySelector('.menu-new');

  let page = 1;
  let activePage = 'top';

  topListLayout(page);
  getTopList();

  $moreBtn.addEventListener('click', function () {
    page++;
    if (activePage === 'top') {
      topListLayout(page);
      getTopList();
    } else if (activePage === 'new') {
      newListLayout(page);
      getNewList();
    }
  });

  $logotitle.addEventListener('click', function () {
    page = 1;
    activePage = 'top';
    $new.classList.remove('menu-clicked');

    topListLayout(page);
    getTopList();
  });

  $new.addEventListener('click', function () {
    page = 1;
    activePage = 'new';
    $new.classList.add('menu-clicked');

    newListLayout(page);
    getNewList();

  });

  function getTopList () {
    $.ajax({
      url : 'https://hacker-news.firebaseio.com/v0/topstories.json',
      dataType : 'json',
      error : function () {
        alert('데이터를 가져올 수 없습니다.');
      },
      success : function (data) {
        writeTopList(data);
      }
    });
  }

  function writeTopList (topArticles) {
    const startIdx = (page * 30) - 29;
    const $articles = document.querySelectorAll('.article');
    const $articlesLink = document.querySelectorAll('.article-title > a');
    const $sitesLink = document.querySelectorAll('.site > a');
    const $articleBottom = document.querySelectorAll('.article-bottom > span');
    const $rank = document.querySelectorAll('.rank');
    for (let i = startIdx; i < startIdx + 30; i++) {
      $.ajax({
        url : `https://hacker-news.firebaseio.com/v0/item/${topArticles[i - 1]}.json?print=pretty`,
        dataType : 'json',
        error : function () {
          alert(`ID : ${data.id} \n 기사를 읽어오는데 실패했습니다.`);
        },
        success : function (data) {
          let elIdx = i - startIdx;
          let siteUrl = data.url ? data.url.split('/').splice(0,3).join('/') : '/';
          let siteUrlTxt = data.url ? data.url.split('/')[2] : '';
          let createTime = new Date(data.time).getTime();
          let currentTime = Math.floor(new Date().getTime() / 1000);
          let elaspedTime = (currentTime - createTime) / 60;
          let elaspedTxt = `${Math.floor(elaspedTime)} min ago`;
          if (Math.round(elaspedTime) >= 60 && Math.round(elaspedTime) < 1440) {
            elaspedTxt = `${Math.floor(elaspedTime / 60)} hours ago`;
          } else if (Math.round(elaspedTime) >= 1440) {
            elaspedTxt = `${Math.floor(elaspedTime / (24 * 60))} days ago`;
          }

          $articles[elIdx].dataset.id = data.id;
          $rank[elIdx].textContent = i + '.';
          $articlesLink[elIdx].setAttribute('href', data.url);
          $articlesLink[elIdx].setAttribute('target', '_blank');
          $articlesLink[elIdx].textContent = data.title;
          $sitesLink[elIdx].textContent = `(${siteUrlTxt})`;
          $sitesLink[elIdx].setAttribute('href', siteUrl);
          $sitesLink[elIdx].setAttribute('target', '_blank');
          $articleBottom[((elIdx + 1) * 8) - 8].textContent = `${data.score} points`;
          $articleBottom[((elIdx + 1) * 8) - 7].textContent = 'by';
          $articleBottom[((elIdx + 1) * 8) - 6].textContent = data.by;
          $articleBottom[((elIdx + 1) * 8) - 5].textContent = elaspedTxt;
          $articleBottom[((elIdx + 1) * 8) - 4].textContent = '|';
          $articleBottom[((elIdx + 1) * 8) - 3].textContent = 'hide';
          $articleBottom[((elIdx + 1) * 8) - 2].textContent = '|';
          $articleBottom[((elIdx + 1) * 8) - 1].textContent = data.descendants;
        }
      })
    }
  }

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
      $rank.className = 'rank';

      let $img = document.createElement('img');
      $img.setAttribute('src', 'asset/img/arrow.gif');
      $img.setAttribute('alt', 'vote arrow');

      let $articleLink = document.createElement('a');
      let $articleTitle = document.createElement('span');
      $articleTitle.className = 'article-title';
      $articleTitle.appendChild($articleLink);

      let $siteLink = document.createElement('a');
      let $site = document.createElement('span');
      $site.appendChild($siteLink);
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

  function getNewList () {
    $.ajax({
      url : 'https://hacker-news.firebaseio.com/v0/newstories.json',
      dataType : 'json',
      error : function () {
        alert('데이터를 가져올 수 없습니다.');
      },
      success : function (data) {
        writeNewList(data);
      }
    });
  }

  function writeNewList (topArticles) {
    const startIdx = (page * 30) - 29;
    const $articles = document.querySelectorAll('.article');
    const $articlesLink = document.querySelectorAll('.article-title > a');
    const $sitesLink = document.querySelectorAll('.site > a');
    const $articleBottom = document.querySelectorAll('.article-bottom > span');
    const $rank = document.querySelectorAll('.rank');
    for (let i = startIdx; i < startIdx + 30; i++) {
      $.ajax({
        url : `https://hacker-news.firebaseio.com/v0/item/${topArticles[i - 1]}.json?print=pretty`,
        dataType : 'json',
        error : function () {
          alert(`ID : ${data.id} \n 기사를 읽어오는데 실패했습니다.`);
        },
        success : function (data) {
          let elIdx = i - startIdx;
          let siteUrl = data.url ? data.url.split('/').splice(0,3).join('/') : '/';
          let siteUrlTxt = data.url ? data.url.split('/')[2] : '';
          let createTime = new Date(data.time).getTime();
          let currentTime = Math.floor(new Date().getTime() / 1000);
          let elaspedTime = (currentTime - createTime) / 60;
          let elaspedTxt = `${Math.floor(elaspedTime)} min ago`;
          if (Math.round(elaspedTime) >= 60 && Math.round(elaspedTime) < 1440) {
            elaspedTxt = `${Math.floor(elaspedTime / 60)} hours ago`;
          } else if (Math.round(elaspedTime) >= 1440) {
            elaspedTxt = `${Math.floor(elaspedTime / (24 * 60))} days ago`;
          }

          $articles[elIdx].dataset.id = data.id;
          $rank[elIdx].textContent = i + '.';
          $articlesLink[elIdx].setAttribute('href', data.url);
          $articlesLink[elIdx].setAttribute('target', '_blank');
          $articlesLink[elIdx].textContent = data.title;
          $sitesLink[elIdx].textContent = `(${siteUrlTxt})`;
          $sitesLink[elIdx].setAttribute('href', siteUrl);
          $sitesLink[elIdx].setAttribute('target', '_blank');
          $articleBottom[((elIdx + 1) * 12) - 12].textContent = `${data.score} points`;
          $articleBottom[((elIdx + 1) * 12) - 11].textContent = 'by';
          $articleBottom[((elIdx + 1) * 12) - 10].textContent = data.by;
          $articleBottom[((elIdx + 1) * 12) - 9].textContent = elaspedTxt;
          $articleBottom[((elIdx + 1) * 12) - 8].textContent = '|';
          $articleBottom[((elIdx + 1) * 12) - 7].textContent = 'hide';
          $articleBottom[((elIdx + 1) * 12) - 6].textContent = '|';
          $articleBottom[((elIdx + 1) * 12) - 5].textContent = 'past';
          $articleBottom[((elIdx + 1) * 12) - 4].textContent = '|';
          $articleBottom[((elIdx + 1) * 12) - 3].textContent = 'web';
          $articleBottom[((elIdx + 1) * 12) - 2].textContent = '|';
          $articleBottom[((elIdx + 1) * 12) - 1].textContent = data.descendants ? data.descendants : 'discuss';
        }
      })
    }
  }

  function newListLayout (page) {
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
      $rank.className = 'rank';

      let $img = document.createElement('img');
      $img.setAttribute('src', 'asset/img/arrow.gif');
      $img.setAttribute('alt', 'vote arrow');

      let $articleLink = document.createElement('a');
      let $articleTitle = document.createElement('span');
      $articleTitle.className = 'article-title';
      $articleTitle.appendChild($articleLink);

      let $siteLink = document.createElement('a');
      let $site = document.createElement('span');
      $site.appendChild($siteLink);
      $site.className = 'site';
      
      $article.children[1].appendChild($rank);
      $article.children[1].appendChild($img);
      $article.children[1].appendChild($articleTitle);
      $article.children[1].appendChild($site);
    
      for (let j = 0; j < 12; j++) {
        let $span = document.createElement('span');
        $article.children[2].appendChild($span);
      }
      $contentsBox.appendChild($article);
    }
  }
})();