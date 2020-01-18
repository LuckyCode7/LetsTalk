export const MSGTYPE = {
    TXT: 'txt',
    ORDER: 'order'
}

export const MSGMODE = {
    USER: 'single-user-msg',
    GUEST: 'single-guest-msg'
}

// export const ORDERTYPE = {
//     REJECTED_CALL = 'RC'
// }

export class Message {
    constructor(type, content, sender) {
        this.type = type;
        this.content = content;
        this.sender = sender
    }

    toNativeObject() {
        return {
            type: this.type,
            content: this.content,
            sender: this.sender
        }
    }

    getType() {
        return this.type;
    }

    getContent() {
        return this.content;
    }

    getSender() {
        return this.sender;
    }

    isEmpty() {
        return this.content === "";
    }
}