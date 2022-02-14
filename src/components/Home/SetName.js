import { useState } from "react";

function SetName({setName}) {
    const anonymous = require('./anonymous.json')
    const [input, setInput] = useState('익명의 ' + anonymous[Math.floor(Math.random() * anonymous.length)])

    function ChangeInput(e) {
        setInput(e.target.value);
    }

    function submitInput() {
        if (!input) return
        setName(input.trim())
    }

    return (
        <div>
            <p>
                <label>Participant: </label>
                <input
                    type="text"
                    value={input}
                    onChange={ChangeInput}
                    required
                />
                <button onClick={submitInput}>submit</button>
            </p>
        </div>
    )
}

export default SetName;