"use client";

import { useState } from "react";
import "./style.css";
import { PeriodicTable } from "@/components/Atom/PeriodicTable";
import AtomSearch from "@/components/Atom/Search";

function AtomPage() {
	const [selectedAtomZ, setSelectedAtomZ] = useState<number | null>(null);
	const [search, setSearch] = useState<string>("");

	return (
		<>
			<AtomSearch
				search={search}
				setSearch={setSearch}
				setSelectedAtomZ={setSelectedAtomZ}
			/>
			<PeriodicTable selectedAtomZ={selectedAtomZ} />
		</>
	);
}

export default AtomPage;
