"use client";

import ElecSimulate from "./simulate/page";
import Page from "@/components/Page";

function Electricity() {
	return (
		<>
			<h2>Pages : </h2>
			<div id="pages">
				<Page
					href="/elec/simulate"
					text="Simulation de circuit électrique"
					img="/assets/pages/elecSchema.png"
				/>
			</div>
		</>
	);
}

export default Electricity;
