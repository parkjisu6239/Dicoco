import style from './VideoList.module.css'

function VideoList({cameraOn}) {
    // TODO
    // 비디오 챗 참여하기로 선택지를 줄지 ?
    // 무조건 비디오 챗으로 하고, 저 탭을 열면 볼 수 있게 할지 ?
    // 혹은 채팅 기능만 있는 것, 비디오 챗도 가능한 것으로 아예 메뉴를 나눌지?
    return (
        <div className={`${style.videoList} ${cameraOn ? style.toggleOn : style.toggleOff}`}>
            <div>비디오들</div>
        </div>
    )
}

export default VideoList