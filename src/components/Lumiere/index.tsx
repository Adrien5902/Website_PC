import { useEffect } from "react";
import useCanvas from "../../hooks/Canvas";
import './style.css'

export default function SpectreCouleur() {
    const canvasRGBRef = useCanvas(() => drawCanvas("additive"))
    const canvasCMYRef = useCanvas(() => drawCanvas("soustractive"))

    const RGB = {
        R: {x: 150, y: 200, color: "#F00", alpha: 1},
        G: {x: 180, y: 200, color: "#0F0", alpha: 1},
        B: {x: 170, y: 150, color: "#00F", alpha: 1}
    }

    const CMY = {
        C: {x: 150, y: 200, color: "#0FF", alpha: 1},
        M: {x: 180, y: 200, color: "#F0F", alpha: 1},
        Y: {x: 170, y: 150, color: "#FF0", alpha: 1}
    }

    useEffect(() => {
        drawCanvas("additive")
        drawCanvas("soustractive")
    }, [])

    function drawCanvas(sythese: "additive" | "soustractive"){
        const canvas = (sythese == "additive" ? canvasRGBRef : canvasCMYRef).current
        const ctx = canvas.getContext("2d")
        ctx.fillStyle = "white"

        ctx.globalCompositeOperation = sythese == "soustractive" ? 'multiply' : 'screen';

        for(let circle of Object.values(sythese == "additive" ? RGB : CMY)){
            ctx.globalAlpha = circle.alpha
            ctx.fillStyle = circle.color
            ctx.beginPath()
            ctx.arc(circle.x, circle.y, 100, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    return (<div>
        <canvas ref={canvasRGBRef} className="shadow-box" style={{background: "#000"}}></canvas>
        <div>
        {
            Object.values(RGB).map((color, i) => <div className="alpha-slider" key={i}>
                <div style={{background: color.color}} className="round-label"></div>
                <input type="range" min={0} max={1} step={.05} defaultValue={color.alpha} onChange={(e) => {color.alpha = Number(e.target.value); drawCanvas("additive")}}/>
            </div>)
        }
        </div>

        <canvas ref={canvasCMYRef} className="shadow-box" style={{background: "#FFF"}}></canvas>
        <div>
        {
            Object.values(CMY).map((color, i) => <div className="alpha-slider" key={i}>
                <div style={{background: color.color}} className="round-label"></div>
                <input type="range" min={0} max={1} step={.05} defaultValue={color.alpha}  onChange={(e) => {color.alpha = Number(e.target.value); drawCanvas("soustractive")}}/> 
            </div>)
        }
        </div>
    </div>);
}