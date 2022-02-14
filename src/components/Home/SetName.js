import { useState } from "react";
import style from './SetName.module.css'

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
        <div className={style.setName}>
            <h1>Set your name</h1>
            <form>
                <label>name*</label>
                <div className={style.join}>
                    <input
                        type="text"
                        value={input}
                        onChange={ChangeInput}
                        required
                    />
                    <button 
                        disabled={input.trim() ? false : true}
                        onClick={submitInput}>
                        →
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SetName;