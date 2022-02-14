import { useEffect, useRef } from "react"
import style from './ChatList.module.css'

function ChatList({chatList, pk}) {
    const chatListRef = useRef()

    useEffect(() => {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }, [chatList])

    return (
        <ul className={style.chatList} ref={chatListRef}>
            {chatList.map((chat, idx) => {
                if (chat.type !== 'chat') {
                    return (
                        <li key={idx} className={style.enter}>
                            {chat.name}{chat.text}
                        </li>
                    )
                } else {
                    return (
                        <li key={idx} className={`${style.chat} ${pk === chat.pk ? style.me : style.you}`}>
                            {!(idx > 0 && chatList[idx-1].type === 'chat' && chatList[idx-1].pk === chat.pk) && <div className={style.name}>{chat.name}</div>}
                            <div className={style.text}>{chat.text}</div>
                        </li>
                    )
                }
            })}
        </ul>
    )
}

export default ChatList