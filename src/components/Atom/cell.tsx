import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Atome } from "./funct";

interface Props {
	atome: Atome;
	color?: string;
	selected?: boolean;
	canBeHovered?: boolean;
	defaultHover?: boolean;
	setSelectedAtomZ?: React.Dispatch<React.SetStateAction<number>>;
}

function AtomCell({
	atome,
	color = "#ffffff",
	selected,
	canBeHovered = true,
	defaultHover = false,
	setSelectedAtomZ,
}: Props) {
	const [hover, setHover] = useState(defaultHover);

	useEffect(() => {
		setHover(defaultHover);
	}, [defaultHover]);

	function handleHover(enter: boolean) {
		if (canBeHovered && !defaultHover) {
			setHover(enter);
		}

		if (setSelectedAtomZ) {
			setSelectedAtomZ(enter ? atome.Z : null);
		}
	}

	return (
		<Link
			to={`/atom/view/${atome.Z}`}
			style={{ background: color }}
			className={`${
				(selected ? "selected " : "") + (hover ? "hover " : "")
			}atom-cell unlink`}
			onMouseEnter={() => handleHover(true)}
			onMouseLeave={() => handleHover(false)}
		>
			<span className="z">{(hover ? "Z=" : "") + atome.Z}</span>
			<br />
			<span className="symbol">{atome.symbol}</span>
			{hover ? (
				<>
					<br />
					<span className="name">{atome.name}</span>
					<br />
					<span className="M">M={atome.M}</span>
				</>
			) : (
				""
			)}
		</Link>
	);
}

export default AtomCell;
