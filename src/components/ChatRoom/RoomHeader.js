function RoomHeader({sessionId, leaveSession}) {
    return (
        <header className='top'>
            <h2>{sessionId}</h2>
            <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={leaveSession}
                value="Leave session"
            />
        </header>
    )
}

export default RoomHeader