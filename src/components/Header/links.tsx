import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

interface Props{
    id: string
    icon: IconDefinition
    name: string
}

export default function HeaderLink(props: Props) {
    return (<Link
        to={"/"+props.id} 
        className={useLocation().pathname.split("/")[1] == props.id ? "underlined" : ""}
    >
        <FontAwesomeIcon icon={props.icon}/>
        <span> {props.name}</span>
    </Link>);
}