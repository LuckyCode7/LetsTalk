const greeting = "Hi, nice to meet you !";
const footer = "All rights reserved 2019";
const leftText = "I'm just wondering ... ";
const rightText = "Maybe we can talk ?";

window.addEventListener('load', () => {
    displayTextAsync(greeting, document.getElementsByClassName('header')[0], 80);
    displayTextAsync(footer, document.getElementsByClassName('footer')[0], 100);
    displayTextWithDelay(leftText, document.getElementsByClassName('container-left')[0], 60, 3000);
    displayTextWithDelay(rightText, document.getElementsByClassName('container-right')[0], 60, 5500);
});

function displayTextAsync(text, element, spaceTime) {
    let i = 0;
    let timer = setInterval(() => {
        element.innerText = text.substr(0, i++);
        if (i == text.length + 1) {
            clearInterval(timer);
        }
    }, spaceTime);
}

function displayTextWithDelay(text, element, spaceTime, delay) {
    setTimeout(displayTextAsync, delay, text, element, spaceTime);
}