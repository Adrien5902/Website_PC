import { Route, Routes } from "react-router-dom"
import Home from "../Home";
import Header from "../Header";
import Atom from "../Atom";
import Electricity from "../Elec";
import Forces from "../Forces";
import Molecules from "../Molecules";
import Graph from "../Graph";
import ReactionsChimique from "../Reactions";
import Lumiere from "../Lumiere";
import { createContext, useState } from "react";

export const ExperimentsContext = createContext(import.meta.env.DEV)

function App() {
    const [experiments, setExperiments] = useState<boolean>(import.meta.env.DEV)

    return (
        <>
            <Header {...{ experiments, setExperiments }}></Header>

            <ExperimentsContext.Provider value={experiments}>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home></Home>}></Route>
                        <Route path="/atom/*" element={<Atom></Atom>}></Route>
                        <Route path="/elec/*" element={<Electricity></Electricity>}></Route>
                        <Route path="/forces/*" element={<Forces></Forces>}></Route>
                        <Route path="/molecules/*" element={<Molecules></Molecules>}></Route>
                        <Route path="/graph/*" element={<Graph></Graph>}></Route>
                        <Route path="/lumiere/*" element={<Lumiere />}></Route>
                        <Route path="/reactions/*" element={<ReactionsChimique />}></Route>
                    </Routes>
                </div>
            </ExperimentsContext.Provider>
        </>
    );
}

export default App;