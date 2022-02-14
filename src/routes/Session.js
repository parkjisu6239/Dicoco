import { useState } from "react";
import { Link } from "react-router-dom";

function Session() {
    const [sessionId, setSessionId] = useState('SessionA')

    function ChangeSessionId(e) {
        setSessionId(e.target.value);
    }

    return (
        <div>
            <label> Session: </label>
            <input
                className="form-control"
                type="text"
                id="sessionId"
                value={sessionId}
                onChange={ChangeSessionId}
                required
            />
            <Link 
                to={`/session/${sessionId.trim()}`} 
                disable={sessionId.trim() ? 'false' : 'true'}>
                submit
            </Link>
        </div>
    )
}

export default Session;