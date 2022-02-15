import { useEffect, useRef } from "react"
import ChatListItem from "./ChatListItem"
import style from './ChatList.module.css'

function ChatList({chatList, pk}) {
    const chatListRef = useRef()

    useEffect(() => {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }, [chatList])

    return (
        <ul className={style.chatList} ref={chatListRef}>
            {chatList.map((chat, idx) =>
                <ChatListItem prevChat={idx > 0 ? chatList[idx-1] : null} chat={chat} idx={idx} pk={pk}/>
            )}
        </ul>
    )
}

export default ChatList