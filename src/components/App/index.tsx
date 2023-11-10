import { Route, Routes } from "react-router-dom"
import Home from "../Home";
import Header from "../Header";
import Atom from "../Atom";
import Electricity from "../Elec";
import Forces from "../Forces";
import Molecules from "../Molecules";
import Lentilles from "../Lentilles";
import Graph from "../Graph";

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
                <Route path="/molecules/*" element={<Molecules></Molecules>}></Route>
                <Route path="/lentilles/*" element={<Lentilles></Lentilles>}></Route>
                <Route path="/graph/*" element={<Graph></Graph>}></Route>
            </Routes>
        </div>
        </>
    );
}

export default App;