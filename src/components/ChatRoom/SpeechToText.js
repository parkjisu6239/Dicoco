import { useState } from 'react'
import {IoMdMic} from 'react-icons/io'
import style from './SpeechToText.module.css'

function SpeechToText({isSTTOn, changeChatContent}) {
    const [listening, setListening] = useState(false)
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

    function startRecognition() {
        let recognition = new SpeechRecognition()
        recognition.interimResults = true;

        if (!recognition) return

        setListening(true)
        recognition.start()

        recognition.onresult = function(event) {
            if (event.results.length > 0) {
                let text = event.results[0][0].transcript
                changeChatContent(text)
            }
        }

        recognition.onerror = function(event){
            console.log(event)
        }

        recognition.onend = function(event) {
            setListening(false)
            console.log(event)
        }
    } 

    // TODO : audio visualizer
    // async function audioTest() {
    //     if (window.navigator.mediaDevices.getUserMedia !== null) {
    //         const options = {
    //           video: false,
    //           audio: true,
    //         };
    //          try {
    //             const stream = await navigator.mediaDevices.getUserMedia(options);        
    //             const audioCtx = new AudioContext();     
    //             const audioSrc = audioCtx.createMediaStreamSource(stream);
    //             console.log(audioSrc)
    //          }catch (err) {
    //           // error handling
    //           }
    //     }
    // }  

    return (
        <div className={`${style.container} ${isSTTOn && style.isOn}`}>
            {/* <button onClick={audioTest}>audio</button> */}
            <button className={`${style.startButton} ${listening && style.micOn}`} onClick={startRecognition}>
                <IoMdMic size="2rem" className={style.mic}/>
            </button>
            <p className={`${style.desc} ${listening && style.listening}`}>{listening ? 'I\'m listening' : 'Click mic button'}</p>
        </div>
    )
}

export default SpeechToText