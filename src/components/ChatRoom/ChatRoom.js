import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import RoomHeader from './RoomHeader';
import Participants from './Participants';
import ChatList from './ChatList';
import ChatInput from './ChatInput';
import SpeechToText from './SpeechToText'
import style from './ChatRoom.module.css'

const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

class ChatRoom extends Component {
    constructor(props) {
        super(props);    
        this.state = {
            mySessionId: props.sessionId,
            myUserName: props.name,
            pk: null,
            session: undefined,
            chatList: [],
            msg: '',
            participants: [],
            participantsToggle: true,
            isSTTOn: false,
        };

        this.joinSession = this.joinSession.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.changeChatContent = this.changeChatContent.bind(this)
        this.submitChat = this.submitChat.bind(this)
        this.sendEnterExitSignal = this.sendEnterExitSignal.bind(this)
        this.toggleParticipants = this.toggleParticipants.bind(this)
        this.toggleIsSTTOn = this.toggleIsSTTOn.bind(this)
    }

    
    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
        this.joinSession()
    }

    componentWillUnmount() {
        this.sendEnterExitSignal("exit");
        this.leaveSession();
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload() {
        this.sendEnterExitSignal("exit");
        this.leaveSession();
    }

    changeChatContent(e) {
        this.setState({
            msg: e.target.value,
        });
    }

    submitChat(e) {
        if ((e.type === 'keyup' && e.keyCode !== 13) || this.state.msg === '') return
        this.sendChatSignal('chat', this.state.msg)
        
    }

    toggleParticipants() {
        this.setState({participantsToggle: !this.state.participantsToggle})
    }

    toggleIsSTTOn() {
        this.setState({isSTTOn: !this.state.isSTTOn})
    }

    sendChatSignal(type, text) {
        const content = {
            type,
            pk: this.state.pk,
            name: this.state.myUserName,
            text
        }

        this.state.session.signal({
            data: JSON.stringify(content),  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
          })
          .then(() => {
              console.log('Message successfully sent');
              this.setState({
                msg: '',
            });
          })
          .catch(error => {
              console.error(error);
          });
    }

    sendEnterExitSignal(type) {
        const content = {
            type,
            pk: this.state.pk,
            name: this.state.myUserName,
        }

        this.state.session.signal({
            data: JSON.stringify(content),  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'enter-exit'             // The type of message (optional)
          })
          .then(() => {
              console.log('Message successfully sent');
          })
          .catch(error => {
              console.error(error);
          });
    }

    joinSession() {
        // --- 1) Get an OpenVidu object ---

        this.OV = new OpenVidu();

        // --- 2) Init a session ---

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                var mySession = this.state.session;

                // --- 3) Specify the actions when events take place in the session ---

                mySession.on('signal:my-chat', (event) => {
                    this.setState({
                        chatList: [
                            ...this.state.chatList,
                            JSON.parse(event.data)
                        ]
                    })
                    // console.log(event.from); // Connection object of the sender
                    // console.log(event.type); // The type of message ("my-chat")
                });

                mySession.on('signal:enter-exit', (event) => {
                    const {type, pk, name}  = JSON.parse(event.data)
                    
                    if (type === "enter") {
                        this.sendEnterExitSignal("reenter")
                        this.setState({participants: []})
                    }

                    if (type === "reenter") {
                        this.setState({participants: [
                            ...this.state.participants,
                            { 
                                pk,
                                name
                            }
                        ]})
                    }

                    if (type === "exit") {
                        const participants = this.state.participants.filter(participant => participant.pk !== pk)
                        this.setState({participants})
                    }
                    // console.log(event.data);
                    // console.log(event.from); // Connection object of the sender
                    // console.log(event.type); // The type of message ("my-chat")
                });

                // On every asynchronous exception...
                mySession.on('exception', (exception) => {
                    console.warn(exception);
                });

                // --- 4) Connect to the session with a valid user token ---

                // 'getToken' method is simulating what your server-side should do.
                // 'token' parameter should be retrieved and returned by your own backend
                this.getToken().then((token) => {
                    // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                    mySession
                        .connect(
                            token,
                            { clientData: this.state.myUserName },
                        )
                        .then(() => {
                            console.log("연결성공")
                            this.setState({pk: new Date().getTime()})
                            this.sendEnterExitSignal("enter")
                            this.sendChatSignal('enter', '님이 입장하셨습니다.')
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    leaveSession() {
        this.sendEnterExitSignal("exit")
        this.sendChatSignal('exit', '님이 나갔습니다.')
        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        this.OV = null;
        this.setState({
            session: undefined,
            mySessionId: null,
            myUserName: null,
            pk: null,
            chatList: [],
        });

        //todo : 뒤로가기
    }

    render() {
        const mySessionId = this.state.mySessionId;
        const participants = this.state.participants
        const chatList = this.state.chatList
        const pk = this.state.pk
        const msg = this.state.msg
        const participantsToggle = this.state.participantsToggle
        const isSTTOn = this.state.isSTTOn

        return (
            <>
                {this.state.session !== undefined ? (
                    <div className={style.chatContainer}>
                        <RoomHeader sessionId={mySessionId} participantsToggle={participantsToggle} toggleParticipants={this.toggleParticipants}/>
                        <div className={style.chatContent}>
                            <Participants participantsToggle={participantsToggle} participants={participants} pk={pk}/>
                            <div className={style.chat}>
                                <ChatList chatList={chatList} pk={pk}/>
                                <SpeechToText
                                    isSTTOn={isSTTOn}
                                    changeChatContent={this.changeChatContent} />
                                <ChatInput 
                                    msg={msg}
                                    changeChatContent={this.changeChatContent} 
                                    submitChat={this.submitChat}
                                    toggleIsSTTOn={this.toggleIsSTTOn}
                                    isSTTOn={isSTTOn}/>
                            </div>
                        </div>
                    </div>
                ) : null}
            </>
        );
    }

    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
     *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
     *   3) The Connection.token must be consumed in Session.connect() method
     */

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error?.response?.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = {};
            axios
                .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }
}

export default ChatRoom;
