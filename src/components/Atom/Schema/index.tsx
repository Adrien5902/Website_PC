import useCanvas from "../../../hooks/Canvas";
import { Isotope } from "../isotope";
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { Pos, drawDot, drawLine, setColor } from "../../../types/canvas";

interface Props{
    atome: Isotope
}

export default function AtomeSchema({atome}: Props) {
    const canvasRef = useCanvas()
    const [size, setSize] = useState<number>(12)
    const frameRate = 30
    const angleRef = useRef<number>(0)

    class Nucléon{
        type: "proton" | "neutron"
        pos: Pos

        constructor(type: "proton" | "neutron", pos: Pos){
            this.type = type
            this.pos = pos
        }

        draw(ctx: CanvasRenderingContext2D){
            setColor(ctx, this.type == "proton" ? "red" : "green")
            drawDot(ctx, this.pos, size);
        }
    }

    class Noyau{
        data: Nucléon[]

        constructor(atome: Isotope){
            const A = atome.A
            let remainingZ = atome.Z
            let remainingN = atome.getN()

            this.data = new Array(A+1).fill(0).map(() => {
                const canvas = canvasRef.current
                const {width, height} = canvas
                const origin: Pos = {x: width/2, y: height/2}

                let isProton = Math.random() - .5 > 0

                isProton = remainingZ > 0 ? isProton : !isProton
                isProton = remainingN > 0 ? !isProton : isProton

                if(isProton){
                    remainingZ -= 1
                }else{
                    remainingN -= 1
                }

                const {x, y} = origin

                return new Nucléon(isProton ? "proton":"neutron", {x,y})
            })
        }

        draw(ctx: CanvasRenderingContext2D){
            this.data.forEach(n => {
                n.draw(ctx)
            });
        }
    }

    function drawCanvas(noyau: {draw: (ctx: CanvasRenderingContext2D) => void, data: Nucléon[]}){
        const canvas = canvasRef.current
        const {width, height} = canvas
        const origin: Pos = {x: width/2, y: height/2}
        const angle = angleRef.current

        const ctx = canvas.getContext("2d")

        //Clear
        ctx.lineWidth = size/3
        ctx.clearRect(0, 0, width, height)

        setColor(ctx, "black")

        //Électrons
        for(let p = atome.période; p > 0; p--){
            const electrons :number = Object.keys(atome.couches).filter(key => key.includes(p.toString())).map(c => atome.couches[c]).reduce((prev, curr) => prev+curr, 0)
            setColor(ctx, "black")
            ctx.beginPath()
            const radius = (origin.x - size*15) * p/atome.période + size*12
            ctx.arc(origin.x, origin.y, radius, 0, Math.PI*2);
            ctx.stroke()

            for(let e = electrons; e > 0; e--){
                const eangle = ((p % 2 - .5) * 2) * angle + Math.PI*2*(e/electrons)
                setColor(ctx, "blue")
                const ePos = {x: origin.x + radius * Math.cos(eangle), y: origin.y + radius * Math.sin(eangle)}
                drawDot(ctx, ePos, size)
                setColor(ctx, "white")
                drawLine(ctx, {x: ePos.x - size/2, y: ePos.y}, {x: ePos.x + size/2, y: ePos.y})
            }
        }

        //Noyau
        noyau?.draw(ctx)
    }

    useEffect(() => {
        const noyau = new Noyau(atome)
        const intervalId = setInterval(() => {
            drawCanvas(noyau)
            angleRef.current += 1/frameRate
        }, 1000/frameRate)
    
        return () => clearInterval(intervalId);
    }, [])

    return (<div>
        <canvas ref={canvasRef} style={{margin: "1em"}} id="isotope-schema-canvas"></canvas>
        <p>Schéma d'un atome de <sup>{atome.Z}</sup>{atome.symbol}</p>
    </div>);

}