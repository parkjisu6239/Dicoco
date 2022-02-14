function Participants({participants, pk}) {
    return (
        <div className='participant'>
            <h3>참가자 ({participants.length} 명)</h3>
            <ul>
                {participants.map(participant => 
                    <li key={participant.pk}>{pk === participant.pk && "(나)" } {participant.name}</li>
                )}
            </ul>
        </div>
    )
}

export default Participants