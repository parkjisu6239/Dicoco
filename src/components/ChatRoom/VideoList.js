import style from './VideoList.module.css'
import UserVideoComponent from '../Home/UserVideoComponent'

function VideoList({cameraOn, publisher, subscribers, switchCamera, handleMainVideoStream}) {
    // TODO
    // 비디오 챗 참여하기로 선택지를 줄지 ?
    // 무조건 비디오 챗으로 하고, 저 탭을 열면 볼 수 있게 할지 ?
    // 혹은 채팅 기능만 있는 것, 비디오 챗도 가능한 것으로 아예 메뉴를 나눌지?
    return (
        <div className={`${style.videoList} ${cameraOn ? style.toggleOn : style.toggleOff}`}>
            <input
                    className="btn btn-large btn-success"
                    type="button"
                    id="buttonSwitchCamera"
                    onClick={switchCamera}
                    value="Switch Camera"
                />
            <div id="video-container" className="col-md-6">
                {publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                        <UserVideoComponent
                            streamManager={publisher} />
                    </div>
                ) : null}
                {subscribers.map((sub, i) => (
                    <div key={i} className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(sub)}>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoList