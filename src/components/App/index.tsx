import { Route, Routes } from "react-router-dom"
import Home from "../Home";
import Header from "../Header";
import Atom from "../Atom";
import Electricity from "../Elec";
import Forces from "../Forces";

function App() {
    return ( 
        <>
        
        <Header></Header>

        <div className="content">
            <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/atom/*" element={<Atom></Atom>}></Route>
                <Route path="/elec/*" element={<Electricity></Electricity>}></Route>
                <Route path="/forces/*" element={<Forces></Forces>}></Route>
            </Routes>
        </div>
        </>
    );
}

export default App;