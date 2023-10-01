import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import './style.css'

export default function useFullscreen(element: React.MutableRefObject<HTMLElement>)
: [JSX.Element, boolean, () => void]
{
    const [fullscreen, setFullscreen] = useState(false)

    document.addEventListener("fullscreenchange", () => {
        setFullscreen(!!document.fullscreenElement)
    })

    const toogleFullscreen = () => {
        setFullscreen(!fullscreen)
        element.current.classList.toggle("fullscreened")
        if(!fullscreen){
            element.current.requestFullscreen()
        }else{
            document.exitFullscreen();
        }
    }

    const button = <FontAwesomeIcon className='toogle-fullscreen' icon={fullscreen ? faCompress : faExpand} onClick={toogleFullscreen}/>

    return [button, fullscreen, toogleFullscreen]
}