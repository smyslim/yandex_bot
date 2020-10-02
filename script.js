// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/*
// @grant        none
// ==/UserScript==

let yandexInput = document.getElementsByName("text")[0]; //поле поиска
let btnK = document.getElementsByClassName("button mini-suggest__button button_theme_websearch button_size_ws-head i-bem button_js_inited")[0]; //кнопка поиск
let keywords = ["Гобой","Саксофон","Валторна","Фагот","Скрипка","Флейта","Как звучит флейта"];
let keyword = "Гобой" //keywords[getRandom(0,keywords.length)]; //рандомно выбираем ключевые слова
let i = 0;

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

if(btnK!=undefined){ //проверка, на главной ли мы странице (есть ли кнопка поиск)
    let timerId = setInterval(()=>{
        yandexInput.value += keyword[i++]; //печатаем в поле инпута ключевое слово по одной букве с интервалом
        if(i == keyword.length){
            clearInterval(timerId);
            btnK.removeAttribute('target');
            btnK.click(); //кликаем по кнопке поиск
        }
    },1000);
}
else{ //если не на главной странице поиска
    let links = document.links; //все ссылки на странице
    let flag = true;
    let numPage = document.querySelector("span.pager__item").innerText; //номер текущей страницы
    for(let i=0; i<links.length; i++){
        if(links[i].href.indexOf("xn----7sbab5aqcbiddtdj1e1g.xn--p1ai") != -1){ //если у ссылки нужный адрес, то кликнуть по ней, выключить флаг и остановить цикл
            links[i].removeAttribute('target');
            setTimeout(()=>links[i].click(),2000);
            flag = false;
            break;
        }
    }
    if(numPage == "10") location.href = "https://yandex.ru/"; //если пришел на 10 страницу, то возвращайся на стартовую страницу яндекса
    if(flag) setTimeout(()=>document.querySelector(".pager__item_kind_next").click(),2000); //кликать кнопку next page, пока флаг true
}




