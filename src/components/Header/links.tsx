import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface Props {
	id: string;
	icon: IconDefinition;
	name: string;
}

export default function HeaderLink(props: Props) {
	return (
		<Link
			href={`/${props.id}`}
			className={`${
				"a"
				// useLocation().pathname.split("/")[1] === props.id ? "active " : ""
			}unlink`}
		>
			<FontAwesomeIcon icon={props.icon} />
			<span> {props.name}</span>
		</Link>
	);
}
