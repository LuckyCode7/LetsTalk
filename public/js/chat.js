import Peer from 'peerjs';
import { Intro, Animation } from './Animation.js';
const shortid = require('shortid');
var connection;
var windowStream;
var call;
const enterASCII = 13;

const displayMsg = (content, look) => {
    if (content !== "") {
        const msg = $("<div class='" + look + "'></div>").text(content);
        //const msg = $("<div class='" + look + "'>" + connect + "</div>");
        //msg.append("\ncoscoscos");
        $('#recived-box').append(msg);
    }
}

const clearBox = el => {
    el.val('');
}

const isVideoOn = () => {
    return ($("#video-box").css("display") === "flex");
}

const setDefaultBoxHeight = (el, height) => {
    el.css('height', height + 'px');
}

const toogleVideoBox = () => {
    if (!isVideoOn()) {
        $("#video-box").fadeIn("slow").css('display', 'flex');
    } else {
        $("#video-box").css('display', 'none').fadeOut("slow");
    }
}

const changeBackground = el => {
    el.toggleClass('call-inactive');
    $('.fa-phone').toggleClass('fa-phone-slash');
}

const autoSize = el => {
    if (!isVideoOn()) {
        setTimeout(() => {
            el.style.cssText = 'height:auto; padding:0';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    } else {

    }
}

const setRecivedBoxScrollBar = () => {
    $('.recived-box').scrollTop($('.recived-box')[0].scrollHeight);
}

const handleVideo = peer => {
    if (isVideoOn()) {
        console.log("Video START");
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function(stream) {
                $("#user-video")[0].srcObject = new MediaStream(stream.getVideoTracks());
                $("#user-video")[0].play();
                windowStream = stream;
            }).then(function() {
                call = peer.call($("#guest-id").val(), windowStream);
            }).catch(function(error) {
                console.log(error);
            });

        } else {
            console.log("Can't use getUserMedia");
        }

    } else {
        console.log("Video STOP");
        connection.send("VIDEO STOPPED");
        $("#user-video")[0].srcObject.getTracks().forEach(track => track.stop());
        $("#guest-video")[0].srcObject.getTracks().forEach(track => track.stop());
        call.close();

        // windowStream = null;
    }
}

const sendMsg = () => {
    if (connection) {
        connection.send($('#send-box').val());
    }
}

const connect = (peer) => {
    $.get('/getUserPeer', function(data, status) {
        connection = peer.connect(data);
        //$("#guest-id").val("");
        connection.on('open', () => {
            //  connection.send('User with id ' + $("#user-id").val() + 'is online');
        });
    });
}

const handleUsers = (look, peer) => {
    $.get('/getUsers', function(users, status) {
        users.forEach(user => {
            if (user.login !== getCookie('login')) {

                const userBox = $("<div class='" + look + "'></div>").text(user.login);
                userBox.click(() => {
                    connect(user.login, peer);
                    $.get('/getUserInfo', { login: user.login }, function(user, status) {
                        Animation.displayTextAsync('Connection data', $('#conn-title'), 80);
                        Animation.displayTextAsync('Login: ' + user.login, $('#conn-login'), 90);
                        Animation.displayTextAsync('Status: ' + user.status, $('#conn-status'), 90);
                        Animation.displayTextAsync('Email: ' + user.mail, $('#conn-mail'), 90);
                        Animation.displayTextAsync("Last login: " + user.activity, $('#conn-activity'), 90);

                    });
                });
                $('.users-box').append(userBox);
            }
        });
    });
}

const getCookie = (key) => {
    let cookies = document.cookie.replace(/\s+/g, '').split(';');

    if (cookies.length === 0) {
        console.log("No cookies available");

        return;
    }

    let cookieObj = {};

    for (let i = 0; i < cookies.length; i++) {
        const key = cookies[i].substring(0, cookies[i].indexOf('='));
        cookieObj[key] = cookies[i].substring(cookies[i].indexOf('=') + 1, cookies[i].length);
    }

    return cookieObj[key];
}

const logOut = () => {
    $.get('/logout', (data, status) => {
        $.get('/logout', (data, status) => {
            window.location.replace(data.url);
        });
    });
}

const handleMenu = (event) => {
    if (event.pageX > $(window).width() - 5) {
        $('.menu').css('display', 'block');
    } else if (event.pageX < $(window).width() - $('.menu').width()) {
        $('.menu').css('display', 'none');
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready((event) => {

    Animation.setText($('#send-box'), "Write here . . .");

    const peer = new Peer(getCookie('peer'), {
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });

    handleUsers('single-user-box', peer);

    peer.on('open', () => {
        // $('#user-id').text(peer.id);
    });

    peer.on('connection', conn => {
        conn.on('data', data => {
            displayMsg(data, "single-guest-msg");
        });
    });

    // peer.on('disconnected', () => {
    //     $.get('/activity', { login: getCookie('login') });
    // });

    peer.on('call', call => {
        if (!isVideoOn()) {
            var acceptsCall = confirm("Videocall incoming, do you want to accept it ?");
        }

        if (acceptsCall) {
            toogleVideoBox();
            changeBackground($('#call-btn'));
            handleVideo(peer);

            call.answer(windowStream);

            call.on('stream', stream => {
                $("#guest-video")[0].srcObject = stream;
                $("#guest-video")[0].play();
            });

            // Handle when the call finishes
            call.on('close', function() {
                alert("The videocall has finished");
            });
        } else {
            call.answer(windowStream);

            call.on('stream', stream => {
                $("#guest-video")[0].srcObject = stream;
                $("#guest-video")[0].play();
            });

            // Handle when the call finishes
            call.on('close', function() {
                alert("The videocall has finished");
            });
        }
    });

    $(".send-btn").click(() => {
        // connection = peer.connect($("#guest-id").val());
        //$("#guest-id").val("");
        // connection.on('open', () => {
        //  connection.send('User with id ' + $("#user-id").val() + 'is online');
        displayMsg($('#send-box').val(), "single-user-msg");
        sendMsg();
        setDefaultBoxHeight($('#send-box'), 16);
        clearBox($('#send-box'));
        setRecivedBoxScrollBar();

    });

    $("#logout-btn").click(() => {
        logOut();
    });



    $('#call-btn').click(function() {
        toogleVideoBox();
        changeBackground($(this));
        handleVideo(peer);
    });


    $('#send-box').keydown(function(e) {
        if (e.keyCode === enterASCII) {
            e.preventDefault();
            displayMsg($(this).val(), "single-user-msg");
            sendMsg();
            setDefaultBoxHeight($(this), 16);
            clearBox($(this));
            setRecivedBoxScrollBar();
        } else {
            autoSize($(this)[0]);
        }
    });

    $(document).mousemove((event) => {
        handleMenu(event);
    });




}, false);


// const ws = new WebSocket('wss://192.168.1.13:8081');

// // odbieranie danych z Servera:
// ws.onmessage = function(msg) {
//     console.log(msg.data);
// };

// //ws.send("Hello server :D");