import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Atom from "../Atom";
import Electricity from "../Elec";
import Forces from "../Forces";
import Graph from "../Graph";
import Header from "../Header";
import Home from "../Home";
import Lumiere from "../Lumiere";
import Molecules from "../Molecules";
import ReactionsChimique from "../Reactions";

export const ExperimentsContext = createContext(import.meta.env.DEV);

function App() {
	const [experiments, setExperiments] = useState<boolean>(import.meta.env.DEV);

	return (
		<>
			<Header {...{ experiments, setExperiments }} />

			<ExperimentsContext.Provider value={experiments}>
				<div className="content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/atom/*" element={<Atom />} />
						<Route path="/elec/*" element={<Electricity />} />
						<Route path="/forces/*" element={<Forces />} />
						<Route path="/molecules/*" element={<Molecules />} />
						<Route path="/graph/*" element={<Graph />} />
						<Route path="/lumiere/*" element={<Lumiere />} />
						<Route path="/reactions/*" element={<ReactionsChimique />} />
					</Routes>
				</div>
			</ExperimentsContext.Provider>
		</>
	);
}

export default App;
