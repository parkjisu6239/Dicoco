import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import style from './SpeechToText.module.css'

function SpeechToText({isSTTOn, changeChatContent}) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className={`${style.container} ${isSTTOn && style.isOn}`}>
                <span>Browser doesn't support speech recognition.</span>;
            </div>
        )
    }

    return (
        <div className={`${style.container} ${isSTTOn && style.isOn}`}>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    )
}

export default SpeechToText