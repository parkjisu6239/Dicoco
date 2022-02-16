import style from './ChatInput.module.css'
import {IoMdMic} from 'react-icons/io'

function ChatInput({msg, changeChatContent, submitChat, toggleIsSTTOn, isSTTOn}) {
    return (
        <div className={style.formControl}>
            <input 
                id="chat-input"
                type="text"
                value={msg}
                onChange={changeChatContent}
                onKeyUp={submitChat}
                placeholder="Type something to send"/>
            <div>
                <IoMdMic 
                    className={`${style.mic} ${isSTTOn && style.on}`} 
                    onClick={toggleIsSTTOn} 
                    size="1.1rem"/>
            </div>
        </div>
    )
}

export default ChatInput