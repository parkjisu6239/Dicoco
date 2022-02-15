import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { useEffect, useState } from 'react'
import style from './ChatListItem.module.css'

function ChatListItem({prevChat, chat, idx, pk}) {
    const [processedText, setProcessedText] = useState()
    const [url, setUrl] = useState(null)

    useEffect(() => {
        if (chat.type !== 'chat') return
        setProcessedText(ChatText(chat.text))
    }, [chat])

    function ChatText(text) {
        const splitText = text.split(/(\s)/g) // 정규식에 괄호를 사용하면 구분자도 포함 가능
        const processedText =  splitText.map((word, idx) => {
            if (word.startsWith('https') || word.startsWith('http') || word.startsWith('www')) {
                setUrl(word)
                return <a key={idx} href={word} target='_blank' rel="noreferrer">{word}</a>
            } else {
                return <span key={idx}>{word.replace('시발', '🌸')}</span>
            }
        })

        return processedText
    }

    if (chat.type !== 'chat') {
        return (
            <li className={style.enter}>
                {chat.name}{chat.text}
            </li>
        )
    }
    
    
    return (
        <li className={`${style.chat} ${pk === chat.pk ? style.me : style.you}`}>
            {!(idx > 0 && prevChat.type === 'chat' && prevChat.pk === chat.pk) && <div className={style.name}>{chat.name}</div>}
            <div className={style.text}>{processedText && processedText}</div>
            {url && <LinkPreview 
                url={url}
                className={style.preview}
                width='300px'
                height='200px'
                descriptionLength='20'
                showLoader={true}
                />}
        </li>
    )
}


export default ChatListItem