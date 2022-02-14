import styles from './ChatInput.module.css'
import {IoMdMic} from 'react-icons/io'

function ChatInput({msg, changeChatContent, submitChat}) {
    return (
        <div className={styles.formControl}>
            <input 
                id="chat-input"
                type="text"
                value={msg}
                onChange={changeChatContent}
                onKeyUp={submitChat}
                placeholder="Type something to send"/>
            <IoMdMic className={styles.mic} size="1.1rem"/>
        </div>
    )
}

export default ChatInput