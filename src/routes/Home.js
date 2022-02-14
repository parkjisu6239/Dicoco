import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <nav>
                <h1>여기 항상 고정</h1>
                <Link to="/session">session</Link>
            </nav>
        </>
    )
}

export default Home;