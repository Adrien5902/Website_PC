import {
	faAtom,
	faBolt,
	faChartLine,
	faDna,
	faFlask,
	faFlaskVial,
	faLightbulb,
	faMagnet,
	faSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import HeaderDropDown from "./dropdown";
import HeaderLink from "./links";
import "./style.css";

interface Props {
	experiments: boolean;
	setExperiments: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ experiments, setExperiments }: Props) {
	return (
		<header>
			<Link className="unlink" to="/">
				<img src="./assets/logo.png" alt="[Nom du site]" />
			</Link>

			<div id="links">
				<HeaderDropDown name="Physique">
					<HeaderLink id="forces" name="Forces" icon={faMagnet} />
					<HeaderLink id="elec" name="Électricité" icon={faBolt} />
					<HeaderLink id="lumiere" name="Lumière" icon={faLightbulb} />
				</HeaderDropDown>

				<HeaderDropDown name="Chimie">
					<HeaderLink id="atom" name="Atomes" icon={faAtom} />
					<HeaderLink
						id="reactions"
						name="Réactions chimiques"
						icon={faFlaskVial}
					/>
					{experiments ? (
						<>
							<HeaderLink id="molecules" name="Molécules" icon={faDna} />
						</>
					) : (
						<></>
					)}
				</HeaderDropDown>

				{experiments ? (
					<HeaderDropDown name="Autres">
						<HeaderLink id="graph" name="Graphiques" icon={faChartLine} />
					</HeaderDropDown>
				) : (
					""
				)}
			</div>
			<div id="experiments" onClick={() => setExperiments((e) => !e)}>
				<FontAwesomeIcon icon={faFlask} />
				<FontAwesomeIcon
					className="slash"
					icon={faSlash}
					style={{ display: experiments ? "none" : "block" }}
				/>
			</div>
		</header>
	);
}

export default Header;
