import styles from './ChatInput.module.css'

function ChatInput({msg, changeChatContent, submitChat}) {
    return (
        <div className={styles.formControl}>
            <input 
                id="chat-input"
                type="text"
                value={msg}
                onChange={changeChatContent}
                onKeyUp={submitChat}/>
            <button onClick={submitChat}>전송</button>
        </div>
    )
}

export default ChatInput