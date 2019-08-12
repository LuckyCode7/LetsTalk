const Intro = {
    greeting: "Hi, nice to meet you !",
    footer: "All rights reserved " + new Date().getFullYear(),
    leftText: "I'm just wondering ... ",
    rightText: "Maybe we can talk ?"
};

Object.freeze(Intro);

class Animation {
    static displayTextAsync(text, element, spaceTime) {
        let i = 0;
        let timer = setInterval(() => {
            element.text(text.substr(0, i++));
            if (i == text.length + 1) {
                clearInterval(timer);
            }
        }, spaceTime);
    }

    static displayTextWithDelay(text, element, spaceTime, delay) {
        setTimeout(Animation.displayTextAsync, delay, text, element, spaceTime);
    }

    static setText(object, text) {
        object.on({
            focus: () => { object.attr('placeholder', '') },
            blur: () => { object.attr('placeholder', text) }
        });
    }
}

export { Intro, Animation };