import { useState } from "react";
import { Link } from "react-router-dom";
import style from './Session.module.css'

function Session() {
    const [sessionId, setSessionId] = useState('SessionA')
    const [valid, setValid] = useState(true)
    const [validMsg, setValidMsg] = useState('')
    const reg = /^[a-zA-Z]+$/

    function ChangeSessionId(e) {
        if (!reg.test(e.target.value)) {
            setValid(false)
            setValidMsg('No space, only english, up to 20 characters')
        } else {
            setValid(true)
            setValidMsg('')
        }

        if (e.target.value.length > 20) return

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
                    {valid}
                    <Link 
                        className={valid ? style.enable : style.disable}
                        to={`/session/${sessionId.trim()}`} 
                        disabled={valid ? false : true}>
                        →
                    </Link>
                </div>
                <p className={style.warn}>{validMsg}</p>
            </div>
        </div>
    )
}

export default Session;