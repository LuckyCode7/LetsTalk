import { Connector } from './webRTC.js';
import { Intro, Animation } from './Animation.js';
import * as Action from './actionDOM.js';

$(document).ready((event) => {

    Animation.setText($('#send-box'), "Write here . . .");

    const connector = new Connector(Action.getCookie('peer'));

    Action.handleUsers(connector);

    //
    // User recived msg from guest
    //

    connector.onReciveMessage(Action.displayMsg);

    // peer.on('connection', conn => {
    //     conn.on('data', message => {
    //         Action.displayMsg(message, "single-guest-msg");
    //     });
    // });

    // peer.on('disconnected', () => {
    //     $.get('/activity', { login: getCookie('login') });
    // });

    // peer.on('call', call => {
    //     if (!Action.isVideoOn()) {
    //         var acceptsCall = confirm("Videocall incoming, do you want to accept it ?");
    //     }

    //     if (acceptsCall) {

    //         Action.handleVideo(peer);

    //         call.answer(Action.localStream);

    //         call.on('stream', stream => {
    //             $("#guest-video")[0].srcObject = stream;
    //         });

    //         // Handle when the call finishes
    //         call.on('close', function() {
    //             alert("The videocall has finished");
    //         });
    //     } else {
    //         call.answer(Action.localStream);

    //         call.on('stream', stream => {
    //             $("#guest-video")[0].srcObject = stream;

    //         });

    //         // Handle when the call finishes
    //         call.on('close', function() {
    //             alert("The videocall has finished");
    //         });
    //     }
    // });

    $(".send-btn").click(() => {
        Action.displayMsg({ sender: Action.getCookie('login'), content: $('#send-box').val() }, "single-user-msg", connector);
        Action.sendMsg(connector);
        Action.setDefaultBoxHeight($('#send-box'));
        Action.clearBox($('#send-box'));
        Action.setRecivedBoxScrollBar();
    });

    $("#logout-btn").click(() => {
        Action.logOut();
    });

    $('#call-btn').click(() => {
        Action.handleVideo(connector);
    });

    $('#send-box').keydown(function(e) {
        if (Action.isEnterPressed(e)) {
            e.preventDefault();
            Action.displayMsg({ sender: Action.getCookie('login'), content: $('#send-box').val() }, "single-user-msg", connector);
            Action.sendMsg(connector);
            Action.setDefaultBoxHeight($(this));
            Action.clearBox($(this));
            Action.setRecivedBoxScrollBar();
        } else {
            Action.autoSize($(this)[0]);
        }
    });

    $(document).mousemove((event) => {
        Action.handleMenu(event);
    });

    $('.search-user-box').on('input', () => {
        Action.searchUser();
    });






}, false);


// const ws = new WebSocket('wss://192.168.1.13:8081');

// // odbieranie danych z Servera:
// ws.onmessage = function(msg) {
//     console.log(msg.data);
// };

// //ws.send("Hello server :D");