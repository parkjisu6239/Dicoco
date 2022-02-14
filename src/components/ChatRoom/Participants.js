import style from './Participants.module.css'
import { BsFillPeopleFill } from 'react-icons/bs' 

function Participants({participants, pk}) {
    return (
        <div className={style.participants}>
            <h3>chatty <BsFillPeopleFill/> {participants.length}</h3>
            <ul>
                {participants.map(participant => 
                    <li key={participant.pk}>{pk === participant.pk && "(me)" } {participant.name}</li>
                )}
            </ul>
        </div>
    )
}

export default Participants