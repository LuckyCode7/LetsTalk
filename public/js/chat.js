import { Connector } from './webRTC.js';
import { Intro, Animation } from './Animation.js';
import * as Action from './actionDOM.js';

$(document).ready((event) => {

    const connector = new Connector(Action.getCookie('peer'));

    Animation.setText($('#send-box'), "Write here . . .");

    Action.handleUsers(connector);

    connector.onReciveMessage(Action.handleRecivedMessage);

    connector.onReciveStream(Action.handleRecivedStream);

    $("#send-btn").click(() => {
        Action.handleSendButtonClick(connector);
    });

    $('#call-btn').click(() => {
        Action.handleCallButtonClick(connector);
    });

    $('#send-box').keydown((event) => {
        Action.handleSendBoxEnterPressd(event, connector);
    });

    $(document).mousemove((event) => {
        Action.handleDisplayMenu(event);
    });

    $('.search-user-box').on('input', Action.handleSearchUser);

    $("#logout-btn").click(Action.handleLogoutButtonClick);

}, false);


// const ws = new WebSocket('wss://192.168.1.13:8081');

// // odbieranie danych z Servera:
// ws.onmessage = function(msg) {
//     console.log(msg.data);
// };

// //ws.send("Hello server :D");