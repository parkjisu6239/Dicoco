import { useState } from "react";
import style from './SetName.module.css'

function SetName({setName}) {
    const anonymous = require('./anonymous.json')
    const [input, setInput] = useState('익명의 ' + anonymous[Math.floor(Math.random() * anonymous.length)])
    const [valid, setValid] = useState(true)
    const [validMsg, setValidMsg] = useState('')
    const reg = /^[a-zA-Zㄱ-ㅎ가-힣0-9\s]+$/

    function ChangeInput(e) {
        if (!reg.test(e.target.value)) {
            setValid(false)
            setValidMsg('Only ko, eng, num. up to 20 characters.')
        } else {
            setValid(true)
            setValidMsg('')
        }

        if (e.target.value.length > 20) return

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
                        disabled={valid ? false : true}
                        onClick={submitInput}>
                        →
                    </button>
                </div>
                <p className={style.warn}>{validMsg}</p>
            </form>
        </div>
    )
}

export default SetName;