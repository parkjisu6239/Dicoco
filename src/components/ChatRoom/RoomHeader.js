import { Link } from 'react-router-dom' 
import style from './RoomHeader.module.css'
import { BiExit } from 'react-icons/bi'

function RoomHeader({sessionId}) {
    return (
        <header className={style.top}>
            <h2>{sessionId}</h2>
            <Link to="/">
                <BiExit 
                    className={style.exit}
                    size="1.3rem"/>
            </Link>
        </header>
    )
}

export default RoomHeader