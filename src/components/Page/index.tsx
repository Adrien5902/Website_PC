import { Link } from "react-router-dom";
import './style.css'

interface Props{
    img : string
    text : string
    href : string
}

function Page(props: Props) {
    return (      
        <Link 
            style={{backgroundImage: `url(${props.img})`}}
            to={props.href}
            className="page"
        ><span>{props.text}</span></Link>
    );
}

export default Page;