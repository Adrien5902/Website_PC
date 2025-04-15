import { Navigate, Route, Routes } from "react-router-dom";
import Page from "../Page";
import ElecSimulate from "./Simulate";

function Electricity() {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Navigate to={"/elec/simulate"} />
							<h2>Pages : </h2>
							<div id="pages">
								<Page
									href="/elec/simulate"
									text="Simulation de circuit électrique"
									img="/assets/pages/elecSchema.png"
								/>
							</div>
						</>
					}
				/>

				<Route path="/simulate" element={<ElecSimulate />} />
			</Routes>
		</>
	);
}

export default Electricity;
