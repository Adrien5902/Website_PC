import useCanvas from "../../../hooks/Canvas";
import { Isotope } from "../isotope";
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { Pos, drawDot, drawLine, setColor } from "../../../types/canvas";
import { Bloc, colorByBloc, couchesLimit } from "../funct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

interface Props {
    atome: Isotope
}

export default function AtomeSchema({ atome }: Props) {
    const sizeCoef = 2
    const canvasRef = useCanvas(null, sizeCoef)
    const [size, setSize] = useState<number>(12)
    const frameRate = 30
    const angleRef = useRef<number>(0)
    const [paused, setPaused] = useState(true)

    class Nucléon {
        type: "proton" | "neutron"
        pos: Pos

        constructor(type: "proton" | "neutron", pos: Pos) {
            this.type = type
            this.pos = pos
        }

        draw(ctx: CanvasRenderingContext2D) {
            setColor(ctx, this.type == "proton" ? "red" : "green")
            drawDot(ctx, this.pos, size);
        }
    }

    class Noyau {
        data: Nucléon[]

        constructor(atome: Isotope) {
            let remainingZ = atome.Z
            let remainingN = atome.getN()

            const canvas = canvasRef.current
            const { width, height } = canvas
            const origin: Pos = { x: width / 2, y: height / 2 }

            this.data = []/* Array.from({ length: atome.période }, (_, p) => {
                const totalAinCouche = atome.getElectronsInCouche(p) * 2
                return Array.from({ length: totalAinCouche }, (_, i) => {
                    let isProton = Math.random() - .5 > 0

                    isProton = remainingZ > 0 ? isProton : !isProton
                    isProton = remainingN > 0 ? !isProton : isProton

                    if (isProton) {
                        remainingZ -= 1
                    } else {
                        remainingN -= 1
                    }

                    const { x, y } = origin
                    const radius = (canvas.width / 10) * (p / atome.période)
                    const angle = (i / totalAinCouche) * Math.PI * 2

                    return new Nucléon(isProton ? "proton" : "neutron", { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) })
                })
            }).flat()*/
        }

        draw(ctx: CanvasRenderingContext2D) {
            this.data.forEach(n => {
                n.draw(ctx)
            });
        }
    }

    function drawCanvas(noyau: { draw: (ctx: CanvasRenderingContext2D) => void, data: Nucléon[] }) {
        const canvas = canvasRef.current
        const { width, height } = canvas
        const origin: Pos = { x: width / 2, y: height / 2 }
        const angle = angleRef.current

        const ctx = canvas.getContext("2d")

        //Clear
        ctx.lineWidth = size / 3
        ctx.clearRect(0, 0, width, height)

        setColor(ctx, "black")

        //Électrons
        Object.keys(atome.couches).forEach((souscouche, i) => {
            const electrons: number = atome.couches[souscouche]
            const period = Number(souscouche[0])
            const sousCoucheId = souscouche[1] as Bloc
            const sousCoucheIndex = Object.keys(couchesLimit).findIndex(sc => sc == sousCoucheId)

            setColor(ctx, `hwb(${period / atome.période * 360} 0% 0%)`)

            ctx.beginPath()
            const radius = canvas.width * (period + sousCoucheIndex / 4) / (atome.période + 1) / sizeCoef
            ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
            ctx.stroke()

            for (let e = electrons; e > 0; e--) {
                const eangle = ((i % 2) == 0 ? 1 : -1) * (angle + Math.PI * 2 * (e / electrons) + Math.PI * sousCoucheIndex / 4)
                setColor(ctx, "blue")
                const ePos = { x: origin.x + radius * Math.cos(eangle), y: origin.y + radius * Math.sin(eangle) }
                drawDot(ctx, ePos, size)
                setColor(ctx, "white")
                drawLine(ctx, { x: ePos.x - size / 2, y: ePos.y }, { x: ePos.x + size / 2, y: ePos.y })
            }
        })

        //Noyau
        noyau?.draw(ctx)
    }

    useEffect(() => {
        const noyau = new Noyau(atome)
        const intervalId = setInterval(() => {
            if (!paused) {
                drawCanvas(noyau)
                angleRef.current += 1 / frameRate
            }
        }, 1000 / frameRate)

        drawCanvas(noyau)

        return () => clearInterval(intervalId);
    }, [paused])

    return (<div>
        <p>
            <FontAwesomeIcon
                icon={paused ? faPlay : faPause}
                onClick={() => setPaused(p => !p)}
                className="pause-button"
            />
            <span>Schéma d'un atome de <sup>{atome.A}</sup><sub>{atome.Z}</sub>{atome.symbol}</span>
        </p>
        <canvas ref={canvasRef} style={{ margin: "1em" }} id="isotope-schema-canvas"></canvas>
    </div>);

}