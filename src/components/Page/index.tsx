import { Link } from "react-router-dom";
import './style.css'

interface Props{
    img : string
    text : string | JSX.Element
    href : string
}

function Page(props: Props) {
    return (      
        <Link 
            style={{backgroundImage: `url(${props.img})`}}
            to={props.href}
            className="page"
        ><div className="page-text">{props.text}</div></Link>
    );
}

export default Page;