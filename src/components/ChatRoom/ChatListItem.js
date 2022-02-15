import { useEffect, useState } from 'react'
import style from './ChatListItem.module.css'

function ChatListItem({prevChat, chat, idx, pk}) {
    const [processedText, setProcessedText] = useState()

    useEffect(() => {
        if (chat.type !== 'chat') return
        setProcessedText(ChatText(chat.text))
    }, [chat])

    function ChatText(text) {
        const splitText = text.split(/(\s)/g) // 정규식에 괄호를 사용하면 구분자도 포함 가능
        const processedText =  splitText.map(word => {
            if (word.includes('https') || word.includes('http') || word.includes('www')) {
                return <a href={word}>{word}</a>
            } else {
                return <span>{word.replace('시발', '🌸')}</span>
            }
        })

        return processedText
    }

    if (chat.type !== 'chat') {
        return (
            <li key={idx} className={style.enter}>
                {chat.name}{chat.text}
            </li>
        )
    }
    
    
    return (
        <li key={idx} className={`${style.chat} ${pk === chat.pk ? style.me : style.you}`}>
            {!(idx > 0 && prevChat.type === 'chat' && prevChat.pk === chat.pk) && <div className={style.name}>{chat.name}</div>}
            <div className={style.text}>{processedText && processedText}</div>
        </li>
    )
}


export default ChatListItem