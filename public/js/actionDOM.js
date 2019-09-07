var connection = null;
var localStream;
var call;


export const displayMsg = (message, mode) => {
    if (message.content !== "") {
        const singleMsgBox = $("<div class='" + mode + "'></div>").text(message.content);
        const timeStamp = $("<div class=time-stamp></div>").text(generateTimeStamp());

        singleMsgBox.append(timeStamp);

        switch (mode) {
            case 'single-user-msg':
                if (connection === null) {
                    alert('First select the guest');
                    return;
                }

                getActiveReciveBox().append(singleMsgBox);

                break;

            case 'single-guest-msg':
                $('#recived-box-' + message.sender).append(singleMsgBox);

                displayUnreadMsgIcon(message.sender);

                displayUnreadMsgIcon();

                break;
        }
    }
}

export const displayUnreadMsgIcon = (sender) => {
    if (getActiveReciveBox().attr('id').includes(sender) === false) {
        if ($('#unread-msg-' + sender).css('visibility') === 'hidden') {
            $('#unread-msg-' + sender).css('visibility', 'visible');
        }
    }
}

export const getActiveReciveBox = () => {
    let result = null;

    $('.msg-box').find('*').map(function() {
        if (($(this).css('display') === 'block') && ($(this).hasClass('recived-box'))) {
            result = $(this);
            return;
        }
    });

    return result;
}

export const getConnectedGuest = () => {
    return getActiveReciveBox().attr('id').split('-')[2];
}

export const generateTimeStamp = () => {
    const now = new Date();

    return now.toLocaleTimeString();
}

export const clearBox = el => {
    el.val('');
}

export const isVideoOn = () => {
    return ($("#video-box").css("display") === "flex");
}

export const setDefaultBoxHeight = (el) => {
    el.css('height', 'auto');
}

export const createVideo = () => {
    const userVideo = $('<video />', {
        id: 'user-video',
        autoplay: true
    });

    const guestVideo = $('<video />', {
        id: 'guest-video',
        autoplay: true
    });

    $('.user-video').append(userVideo);
    $('.guest-video').append(guestVideo);

    $("#video-box").fadeIn("slow").css('display', 'flex');
}

export const removeVideo = () => {
    if ($("#user-video")[0].srcObject) {
        $("#user-video")[0].srcObject.getTracks().forEach(track => track.stop());
    }

    if ($("#guest-video")[0].srcObject) {
        $("#guest-video")[0].srcObject.getTracks().forEach(track => track.stop());
    }

    $('#user-video').remove();
    $('#guest-video').remove();

    $("#video-box").css('display', 'none').fadeOut("slow");
}

export const changeCallBtnBackground = () => {
    $('#call-btn').toggleClass('call-inactive');
    $('.fa-phone').toggleClass('fa-phone-slash');
}

export const autoSize = el => {
    if (!isVideoOn()) {
        setTimeout(() => {
            el.style.cssText = 'height:auto; padding:0';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    }
}

export const setRecivedBoxScrollBar = () => {
    getActiveReciveBox().scrollTop(getActiveReciveBox()[0].scrollHeight);
}

export const captureUserCamera = (peer) => {
    const constraints = { video: true, audio: true };

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            $("#user-video")[0].srcObject = new MediaStream(stream.getVideoTracks());
            localStream = stream;
        }).then(() => {
            $.get('/getUserPeer', { login: getConnectedGuest() }, (guestPeer, status) => {
                call = peer.call(guestPeer, localStream);
            });
        }).catch(e => {
            console.log(e);
        });
    } else {
        alert("Can not acces user camera");
    }
}

export const handleVideo = peer => {
    if (connection !== null) {
        if (!isVideoOn()) {
            createVideo();
            captureUserCamera(peer);
        } else {
            removeVideo();
            call.close();
            localStream = null;
        }
        changeCallBtnBackground();
    } else {
        alert('First select guest');
    }
}

export const sendMsg = () => {
    if (connection !== null) {
        const message = {
            sender: getCookie('login'),
            content: $('#send-box').val()
        }

        connection.send(message);
    }
}

export const connect = (guestLogin, peer) => {
    $.get('/getUserPeer', { login: guestLogin }, function(guestPeer, status) {
        connection = peer.connect(guestPeer);
        connection.on('open', () => {});
    });
}

export const setUserBoxBackgroundColor = (userBox) => {
    $('.single-user-box').css('background-color', '');
    userBox.css('background-color', 'rgba(9, 64, 109, 0.486)');
}

export const displayUserInfo = user => {
    $.get('/getUserInfo', { login: user.login }, function(user, status) {
        $('#conn-title').text(user.login);
        $('#conn-status').text('Status: ' + user.status);
        $('#conn-mail').text('Email: ' + user.mail);
        if (user.activity === '') {
            $('#conn-activity').text('Last login: never');
        } else {
            $('#conn-activity').text('Last login: ' + user.activity);
        }

        if ($(".connection-info").css("display") === "none") {
            $(".connection-info").fadeIn("slow").css('display', 'block');
        } else {
            $(".connection-info").fadeOut('fast');
            $(".connection-info").fadeIn("slow").css('display', 'block');
        }
    });
}

export const displayUserReciveBox = user => {
    $('.recived-box').css('display', 'none');
    $('#recived-box-' + user.login).css('display', 'block');
}

export const handleUsers = (peer) => {
    $.get('/getUsers', function(users, status) {
        users.forEach(user => {
            if (user.login !== getCookie('login')) {

                const userBox = $("<div class='single-user-box'></div>");

                const userNick = $("<div class='single-nick-box'></div>").text(user.login);

                const unreadMsg = $("<div class='unread-msg' id='unread-msg-" + user.login + "'></div>").append('<i class="far fa-envelope"></i>');

                unreadMsg.css('visibility', 'hidden');

                userBox.append(userNick).append(unreadMsg);

                const reciveMsgBox = $('<div class="recived-box scroll" id="recived-box-' + user.login + '"></div>').css('display', 'none');

                $('.msg-box').prepend(reciveMsgBox);

                userBox.click(() => {

                    setUserBoxBackgroundColor(userBox);

                    connect(user.login, peer);

                    displayUserInfo(user);

                    displayUserReciveBox(user);

                    userBox.find('.unread-msg').css('visibility', 'hidden');

                });
                $('.users-list').append(userBox);
            } else {
                $('#conn-title').text('Hi, ' + user.login + ' !');
            }
        });
    });
}

export const getCookie = (key) => {
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

export const logOut = () => { // co ? ? ? 
    $.get('/logout', (data, status) => {
        $.get('/logout', (data, status) => {
            window.location.replace(data.url);
        });
    });
}

export const handleMenu = (event) => {
    $('#menu-btn').click(() => {
        $('#menu-btn').css('display', 'none');
        $('.menu').css('display', 'block');
    });

    if (event.pageX < $(window).width() - $('.menu').width()) {
        $('.menu').css('display', 'none');
        $('#menu-btn').css('display', 'block');
    }
}

export const searchUser = () => {
    $('.users-list').find('*').map(function() {
        if ($(this).text().includes($('.search-user-box').val())) {
            $(this).css('display', 'block');
        } else {
            $(this).css('display', 'none');
        }
    });
}

export const isEnterPressed = (e) => {
    const asciiEnter = 13;
    return e.keyCode === asciiEnter;
}