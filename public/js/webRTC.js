import Peer from 'peerjs';

export class Connector {
    constructor(peerID) {
        this.connection = null;
        this.localStream = null;
        this.call = null;
        this.peer = new Peer(peerID);
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
                callback(message, this);
            });
        });
    }

    onReciveStream(callback) {
        this.peer.on('call', call => {
            callback(call, this);
        });
    }

    sendMessageToGuest(message) {
        this.connection.send(message);
    }

    sendLocalStreamToGuest(guestPeer) {
        this.call = this.peer.call(guestPeer, this.localStream);
        this.call.on('stream', stream => {
            $("#guest-video")[0].srcObject = stream;

        });
    }

    isConnectionCreated() {
        return this.connection !== null;
    }

    isCalling() {
        return this.call !== null;
    }

    setLocalStream(stream) {
        this.localStream = stream;
    }

    getLocalStream() {
        return this.localStream;
    }

    stopStreaming() {
        if (this.call != null) {
            this.call.close();
        }
        this.call = null;
        this.localStream = null;
    }
}