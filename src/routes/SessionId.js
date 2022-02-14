import { useState } from "react";
import { useParams } from "react-router-dom";
import SetName from "../components/Home/SetName";
import ChatRoom from "../components/ChatRoom/ChatRoom";

function SessionId() {
    const [name, setName] = useState(null)
    let sessionId = useParams().sessionId;

    return (
        <div className="sessionId">
            {name ? 
                <ChatRoom name={name} sessionId={sessionId}/>
                : <SetName setName={setName}/>
            }
        </div>
    )
}

export default SessionId;