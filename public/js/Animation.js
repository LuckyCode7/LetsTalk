const Intro = {
    greeting: "Hi, nice to meet you !",
    footer: "All rights reserved 2019",
    leftText: "I'm just wondering ... ",
    rightText: "Maybe we can talk ?"
};

class Animation {
    static displayTextAsync(text, element, spaceTime) {
        let i = 0;
        let timer = setInterval(() => {
            element.innerText = text.substr(0, i++);
            if (i == text.length + 1) {
                clearInterval(timer);
            }
        }, spaceTime);
    }

    static displayTextWithDelay(text, element, spaceTime, delay) {
        setTimeout(Animation.displayTextAsync, delay, text, element, spaceTime);
    }
}
Animation

export { Intro, Animation };