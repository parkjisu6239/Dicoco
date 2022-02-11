import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import './Friends.css'

const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';


class Friends extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            session: undefined,
            chatList: [],
            msg: '',
            friends: [
                {name: '1', isOn: false},
                {name: '2', isOn: false},
                {name: '3', isOn: false},
                {name: '4', isOn: false},
                {name: '5', isOn: false},
            ]
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.handleChangeChatContent = this.handleChangeChatContent.bind(this)
        this.submitChat = this.submitChat.bind(this)
        this.enterExitChatRoom = this.enterExitChatRoom.bind(this)
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        this.enterExitChatRoom("exit");
        this.leaveSession();
    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleChangeUserName(e) {
        this.setState({
            myUserName: e.target.value,
        });
    }

    handleChangeChatContent(e) {
        this.setState({
            msg: e.target.value,
        });
    }

    submitChat(e) {
        if (e.keyCode !== 13) return
       
        this.state.session.signal({
            data: this.state.msg,  // Any string (optional)
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

    enterExitChatRoom(msg) {
        this.state.session.signal({
            data: msg,  // Any string (optional)
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
                            {
                                name: JSON.parse(event.from.data).clientData,
                                text: event.data
                            }
                        ]
                    })
                    // console.log(event.from); // Connection object of the sender
                    // console.log(event.type); // The type of message ("my-chat")
                });

                mySession.on('signal:enter-exit', (event) => {
                    const name = JSON.parse(event.from.data).clientData
                    const text = event.data
                    
                    if (text === "enter" && name !== this.state.myUserName) {
                        this.enterExitChatRoom("reenter")
                    }

                    if (text === "enter" || text === "reenter") {
                        const friends = this.state.friends.map(friend => {
                            let temp = friend
                            if (friend.name === name) {
                                temp.isOn = true
                            }
                            return temp
                        })
                        this.setState({friends})
                    }

                    if (text === "exit") {
                        const friends = this.state.friends.map(friend => {
                            let temp = friend
                            if (friend.name === name) {
                                temp.isOn = false
                            }
                            return temp
                        })
                        this.setState({friends})
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
                            this.enterExitChatRoom("enter")
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    leaveSession() {
        this.enterExitChatRoom("exit")
        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        this.OV = null;
        this.setState({
            session: undefined,
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            chatList: [],
        });
    }

    render() {
        const mySessionId = this.state.mySessionId;
        const myUserName = this.state.myUserName;
        const msg = this.state.msg

        return (
            <div className="container">
                {this.state.session === undefined ? (
                    <div id="join">
                        <div id="img-div">
                            <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
                        </div>
                        <div id="join-dialog" className="jumbotron vertical-center">
                            <h1> Join a Chat session </h1>
                            <form className="form-group" onSubmit={this.joinSession}>
                                <p>
                                    <label>Participant: </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="userName"
                                        value={myUserName}
                                        onChange={this.handleChangeUserName}
                                        required
                                    />
                                </p>
                                <p>
                                    <label> Session: </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="sessionId"
                                        value={mySessionId}
                                        onChange={this.handleChangeSessionId}
                                        required
                                    />
                                </p>
                                <p className="text-center">
                                    <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                                </p>
                            </form>
                        </div>
                    </div>
                ) : null}

                {this.state.session !== undefined ? (
                    <div className="chat">
                        <div id="session">
                            <div id="session-header">
                                <h1 id="session-title">{mySessionId}</h1>
                                <input
                                    className="btn btn-large btn-danger"
                                    type="button"
                                    id="buttonLeaveSession"
                                    onClick={this.leaveSession}
                                    value="Leave session"
                                />
                                <p>내 이름{myUserName}</p>
                                <input 
                                    id="chat-input"
                                    type="text"
                                    value={msg}
                                    onChange={this.handleChangeChatContent}
                                    onKeyUp={this.submitChat}/>
                                <ul>
                                    {this.state.chatList.map((chat, idx) => <li key={idx}>{chat.name} : {chat.text}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3>칭긔</h3>
                            <ul>
                                {this.state.friends.map(friend => 
                                    <li key={friend.name}>{friend.name} : {friend.isOn ? "들어옴" : "없음"}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>
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

export default Friends;
