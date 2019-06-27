require('../style/authMain.scss');
import { Intro, Animation } from './Animation.js';

window.addEventListener('load', () => {
    Animation.displayTextAsync(Intro.greeting, document.getElementsByClassName('header')[0], 80);
    Animation.displayTextAsync(Intro.footer, document.getElementsByClassName('footer')[0], 100);
    Animation.displayTextWithDelay(Intro.leftText, document.getElementsByClassName('container-left')[0], 60, 3000);
    Animation.displayTextWithDelay(Intro.rightText, document.getElementsByClassName('container-right')[0], 60, 5500);
});