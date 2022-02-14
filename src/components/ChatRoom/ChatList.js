import { useEffect, useRef } from "react"

function ChatList({chatList, pk}) {
    const chatListRef = useRef()

    useEffect(() => {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }, [chatListRef])

    return (
        <ul ref={chatListRef}>
            {chatList.map((chat, idx) => (
                <li key={idx}>
                    {pk === chat.pk && "(나) " }{chat.name}{chat.type === 'chat' && " : "}{chat.text}
                </li>
            ))}
        </ul>
    )
}

export default ChatList