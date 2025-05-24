import Page from "../../components/Page";

function Molecules() {
	return (
		<div id="pages">
			<Page
				href="/molecules/lewis"
				img="/assets/pages/"
				text="Schéma de Lewis"
			/>
			<Page
				href="/molecules/equation"
				img="/assets/pages/equation_molecules.png"
				text="Equations moléculaires"
			/>
		</div>
	);
}

export default Molecules;
