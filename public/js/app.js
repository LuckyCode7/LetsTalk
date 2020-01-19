const path = require('path');

import '../style/main.scss';

import { Intro, Animation } from './Animation.js';

$(document).ready(() => {
    Animation.displayTextAsync(Intro.greeting, $('.header'), 80);
    Animation.displayTextAsync(Intro.footer, $('.footer'), 100);
    Animation.displayTextWithDelay(Intro.leftText, $('.log-container-left'), 60, 3000);
    Animation.displayTextWithDelay(Intro.rightText, $('.log-container-right'), 60, 5500);

    Animation.setText($('#login'), "Login");
    Animation.setText($('#pass'), "Password");
});