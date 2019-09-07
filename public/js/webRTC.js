import Peer from 'peerjs';

export class Connector {
    constructor(peer) {
        this.connection = null;
        this.localStream = null;
        this.call = null;
        this.peer = new Peer(peer, {
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
    }

    createConnectionTo(guestPeer) {
        this.connection = this.peer.connect(guestPeer);
        this.connection.on('open', () => {});
    }

    onOpenConnection(callback) {
        this.peer.on('open', callback);
    }

    onReciveMessage(callback) {
        this.peer.on('connection', conn => {
            conn.on('data', message => {
                callback(message, "single-guest-msg");
            });
        });
    }

    sendMessageToGuest(message) {
        this.connection.send(message);
    }

    sendLocalStreamToGuest(guestPeer) {
        this.call = this.peer.call(guestPeer, this.localStream);
    }

    isConnectionCreated() {
        return this.connection !== null;
    }

    setLocalStream(stream) {
        this.localStream = stream;
    }

    stopStreaming() {
        this.call.close();
        this.call = null;
        this.localStream = null;
    }
}