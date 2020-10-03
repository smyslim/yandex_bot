// ==UserScript==
// @name         yandex_bot_2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match        https://crushdrummers.ru/*
// @grant        none
// ==/UserScript==

let yandexInput = document.getElementsByName("text")[0]; //поле поиска
let btnK = document.getElementsByClassName("button mini-suggest__button button_theme_websearch button_size_ws-head i-bem button_js_inited")[0]; //кнопка поиск
let sites = { //создаем объект sites, в котором ключи - домены сайтов, а значения - поисковые слова для каждого сайта
    "xn----7sbab5aqcbiddtdj1e1g.xn--p1ai": ["Гобой","Саксофон","Валторна","Фагот","Скрипка","Флейта","Как звучит флейта"],
    "crushdrummers.ru":["Барабанное шоу","Шоу барабнщиков в Москве","Заказать барабанщиков в Москве"]
};
let site = Object.keys(sites)[getRandom(0,Object.keys(sites).length)]; //рандомно выбираем ключ(домен сайта) из объекта sites
let keywords = sites[site]; //в объекте sites обращаемся к массиву поисковых слов по выбранному ключю (домену сайта), который мы положили в переменную site
let keyword = keywords[getRandom(0,keywords.length)]; //рандомно выбираем поисковое слово из массива keywords
let i = 0;

function getRandom(min,max){ //функция генерирует случайное число и округляет до меньшего значения (Math.floor). Важно: Math.round округляет до большего значения
    return Math.floor(Math.random()*(max-min)+min);
}
function getCookie(name) { //функция скопирована из документации learn.javascript.ru - получает доступ к куки с помощью регулярного выражения
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (btnK!=undefined){ //Если мы на главной странице поиска
    document.cookie = "site="+site; //Записываем сайт в куки, так как скрипт начинает заново на след странице и выберет и перезапишет новый сайт в переменную site
}
else{
    site = getCookie("site"); //Если не на главной, берем сайт из куки
}

if(btnK!=undefined){ //если находимся на главной странице поисковика (есть ли кнопка поиск)
    let timerId = setInterval(()=>{
        yandexInput.value += keyword[i++]; //печатаем в поле инпута ключевое слово по одной букве с задержкой
        if(i == keyword.length){ //на последней букве поискового слова останавливаем печатание букв, иначе будет нон-стоп печатать undefinedundefinedundefined
            clearInterval(timerId);
            btnK.click(); //кликаем по кнопке поиск
        }
    },500);
}
else if(location.hostname == "yandex.ru"){ //если находимся не на главной, но на любой другой странице поиска
    let links = document.links; //все ссылки на странице собираем в переменную
    let flag = true; //включаем флаг
    let pageNum = document.querySelector("span.pager__item").innerText; //номер текущей страницы заводим в переменную
    for(let i=0; i<links.length; i++){
        let link = links[i]; //фиксируем ссылку в переменной, иначе на странице могут динамически подгрузиться другие ссылки
        if(link.href.indexOf(site) != -1){ //если у ссылки нужный адрес, то...
            link.removeAttribute('target'); //...отключить аттрибут target для открытия в той же вкладке
            setTimeout(()=>link.click(),2000); //...кликнуть по ссылке с задержкой
            flag = false; //...выключить флаг
            break; //...и остановить цикл
        }
    }
    if(pageNum == "10") location.href = "https://yandex.ru/"; //если пришел на 10 страницу, то возвращайся на стартовую страницу поисковика
    if(flag) {
        let nextPage = document.querySelector(".pager__item_kind_next");
        setTimeout(()=>nextPage.click(),2000); //кликать кнопку next page, пока флаг true (пока не найдена ссылка на страницу)
    }
}
else{ //если находимся на другом сайте (ушли с поисковика)
    if(getRandom(0,100)>=80){ //иногда случайно возвращаться на сайт поисковика
        location.href = "https://yandex.ru/";
    }
    else{
        let links = document.links; //все ссылки на странице собираем в переменную
        setInterval(()=>{ //повторяем выбор ссылки из массива и клик каждые 5 секунд
            let index = getRandom(0,links.length); //случайно выбираем индекс массива links (выбираем ссылку из массива links)
            console.log("Я работаю! Проверяю ссылку"+links[index]);
            if(links[index].href.indexOf(location.hostname) != -1){ //если у выбранной ссылки адрес сайта (не ссылка на внешний сайт), то кликаем по ней
                links[index].click();
            }
        },5000);
    }
}


