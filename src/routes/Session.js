import { useState } from "react";
import { Link } from "react-router-dom";
import style from './Session.module.css'

function Session() {
    const [sessionId, setSessionId] = useState('SessionA')

    function ChangeSessionId(e) {
        setSessionId(e.target.value);
    }

    return (
        <div className={style.session}>
            <h1>Entner Chat Room</h1>
            <div className={style.form}>
                <label>Room name*</label>
                <div className={style.join}>
                    <input
                        className="form-control"
                        type="text"
                        id="sessionId"
                        value={sessionId}
                        onChange={ChangeSessionId}
                        required
                    />
                    <Link 
                        className={sessionId.trim() ? style.enable : style.disable}
                        to={`/session/${sessionId.trim()}`} 
                        disabled={sessionId.trim() ? false : true}>
                        →
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Session;