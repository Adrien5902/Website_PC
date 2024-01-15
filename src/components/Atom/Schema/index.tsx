import useCanvas from "../../../hooks/Canvas";
import { Isotope } from "../isotope";
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { Pos, drawDot, drawLine, setColor } from "../../../types/canvas";
import { Bloc, couchesLimit } from "../funct";
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
    const noyau = useRef<Noyau>(null)
    const [paused, setPaused] = useState(true)

    class Nucléon {
        type: "proton" | "neutron"
        pos: Pos

        constructor(type: "proton" | "neutron", pos: Pos) {
            this.type = type
            this.pos = pos
        }

        draw(ctx: CanvasRenderingContext2D) {
            const { x, y } = this.pos
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.3)
            gradient.addColorStop(0, "white")
            gradient.addColorStop(1, this.type == "proton" ? "red" : "green")

            ctx.fillStyle = gradient
            drawDot(ctx, this.pos, size * 1.3);
        }
    }

    class Noyau {
        data: Nucléon[]

        constructor(atome: Isotope) {
            let remainingProton = atome.Z
            let remainingNeutron = atome.getN()

            const canvas = canvasRef.current
            const { width, height } = canvas
            const origin: Pos = { x: width / 2, y: height / 2 }

            this.data = []
            const circleMax = Math.floor(Math.log2(atome.A + 4))
            for (let i = 0; i < atome.A; i++) {
                const circleIndex = Math.floor(Math.log2(i + 4))

                let isProton = Math.random() - .5 > 0

                if (isProton) {
                    isProton = remainingProton > 0
                } else {
                    isProton = !(remainingNeutron > 0)
                }

                if (isProton) {
                    remainingProton -= 1
                } else {
                    remainingNeutron -= 1
                }

                const { x, y } = origin
                const radius = ((canvas.width / 10) * (circleIndex / circleMax)) - (size * 2)
                const angle = (i / 2 ** circleIndex) * Math.PI * 2

                this.data.push(new Nucléon(isProton ? "proton" : "neutron", { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) }))
            }

        }

        draw(ctx: CanvasRenderingContext2D) {
            this.data.forEach(n => {
                n.draw(ctx)
            });
        }
    }

    function drawCanvas() {
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
            const radius = canvas.width * (period + sousCoucheIndex / 4) / (atome.période + .5) / sizeCoef
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
        noyau.current?.draw(ctx)
    }

    useEffect(() => {
        if (!noyau.current) noyau.current = new Noyau(atome)
        const intervalId = setInterval(() => {
            if (!paused) {
                drawCanvas()
                angleRef.current += 1 / frameRate
            }
        }, 1000 / frameRate)

        drawCanvas()

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