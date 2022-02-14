import { Link } from "react-router-dom";
import style from './Home.module.css'

function Home() {
    return (
        <div className={style.home}>
            <h1>Chatty</h1>
            <div className={style.menu}>
                <Link to="/session">chat room</Link>
                <Link to="/session">chat room</Link>
                <Link to="/session">chat room</Link>
            </div>
        </div>
    )
}

export default Home;