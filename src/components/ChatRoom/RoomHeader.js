import { Link } from 'react-router-dom' 
import style from './RoomHeader.module.css'
import { BiExit } from 'react-icons/bi'
import { BsFillPeopleFill } from 'react-icons/bs'
import { IoIosVideocam } from 'react-icons/io' 

function RoomHeader({sessionId, participantsToggle, toggleParticipants, cameraOn, toggleCameraOn}) {
    return (
        <header className={style.top}>
            <h2>{sessionId}</h2>
            <div className={style.icons}>
                <div 
                    className={`${style.camera} ${cameraOn ? style.cameraOn : style.cameraOff}`}
                    onClick={toggleCameraOn}>
                        <IoIosVideocam size="1.3rem"/>
                </div>
                <div 
                    className={`${style.participants} ${participantsToggle ? style.toggleOn : style.toggleOff}`}
                    onClick={toggleParticipants}>
                        <BsFillPeopleFill size="1.3rem"/>
                </div>
                <Link to="/">
                    <BiExit 
                        className={style.exit}
                        size="1.3rem"/>
                </Link>
            </div>
        </header>
    )
}

export default RoomHeader