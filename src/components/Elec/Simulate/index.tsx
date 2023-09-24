import './style.css'
import { useEffect, useRef, useState } from "react";
import { Component, Pos, Side } from "./components/types";
import ComponentDrag from './components/drag';

import cableImg from './img/cable.png'
import binImg from './img/bin.png'
import Générateur from './components/Générateur';
import ImageBank from './img/bank';
import Lampe from './components/Lampe';
import { drawDot, getCtx } from './components/functions';
import Interupteur from './components/Interrupteur';
import Pile from './components/Pile';


const componentTypes = [
    Générateur,
    Lampe,
    Interupteur,
    Pile
]

function ElecSimulate() {
    const [cableMouse, setCableMouse] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState<Component>(null)

    const components = useRef<Component[]>([])
    const [idMax, setIdMax] = useState<number>(0)
    let componentSize = 128
    const frameRate = 60

    const mousePosRef = useRef<Pos>({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLCanvasElement>()

    function handleDrop(e){
        const pos = getMousePos(e)
        const type = e.dataTransfer.getData("text/plain")

        const componentType = componentTypes.find(t => type == t.nom)
        console.log(type, componentType)
        
        if(componentType){
            const component = new componentType(idMax, pos)
        
            components.current.push(component)
            setIdMax((prevId) => prevId + 1);
            setSelectedComponent(component)
        }
        
        canvasRef.current.style.border = ''
    }

    function getMousePos(evt) {
        const canvas = canvasRef.current
        var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;
    
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }

    function selectComponent(mousePos){
        let side = 0 as Side
        const component = components.current.find((component) => {
            let x = mousePos.x - component.pos.x
            let y = mousePos.y - component.pos.y
            
            side = x > 0 ? 1 : -1

            return Math.abs(x) < componentSize/2 && Math.abs(y) < componentSize/2
        })

        return {side, component}
    }


    let movingComponent : Component = null

    function handleMouseDown(e){
        const mousePos = getMousePos(e)
        const {component} = selectComponent(mousePos)

        setSelectedComponent(selectedComponent)

        movingComponent = component

        if(movingComponent && !cableMouse){
            movingComponent.pos = mousePos
        }
    }

    function handleMouseUp(){
        movingComponent = null
    }

    function handleMouseMove(e){
        const mousePos = getMousePos(e)
        mousePosRef.current = mousePos

        if(movingComponent && !cableMouse){
            movingComponent.pos = mousePos
        }
    }

    function drawCanvas(ctx: CanvasRenderingContext2D, mousePos: Pos){
        if(canvasRef.current){
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.font = componentSize/3 + "px sans-serif"
            ctx.lineWidth = componentSize/12;
            components.current.forEach(component => component.draw(ctx, componentSize))

            const {component, side} = selectComponent(mousePos)
            if(cableMouse && component && side){
                const ctx = getCtx(canvasRef)
                const {x, y} = component.pos
                drawDot(ctx, {x: x + side * componentSize/2, y})
            }
        }
    }

    useEffect(() => {
        const ctx = getCtx(canvasRef)

        const intervalId = setInterval(() => {
            drawCanvas(ctx, mousePosRef.current)
        }, 1000/frameRate)
    
        return () => clearInterval(intervalId);
    }, [components, componentSize, mousePosRef.current])

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.ondragover = (event) => {
            event.preventDefault()
            canvas.style.borderStyle = 'dashed'
            canvas.style.borderColor = '#009eff'
        }

        canvas.ondragleave = () => canvas.style.border = '';

        function resizeCanvas(){
            canvas.setAttribute('width', (canvas.getBoundingClientRect().width * 2).toString())
            canvas.setAttribute('height', (canvas.getBoundingClientRect().height * 2).toString())
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas);
    }, [])

    return (<>
        <img className="back" onClick={() => history.go(-1)} src="/assets/back-arrow.png" alt="←"/>
        
        <h1>Simulation de circuit électriques</h1>
        
        <div id="app" className={cableMouse ? 'cable' : ""}>
            <div>
                <div id="components">
                    <div className="componentBox">
                        <img src={cableImg} className={cableMouse ? 'cable' : ""} onClick={() => setCableMouse(cable => ! cable)} draggable="false"/>
                        <span>Câble</span>
                    </div>
                    <ComponentDrag img={ImageBank.GénérateurOff} name={"Générateur"}/>
                    <ComponentDrag img={ImageBank.PileOff} name={"Pile"}/>
                    <ComponentDrag img={ImageBank.LampeOff} name={"Lampe"}/>
                    <ComponentDrag img={ImageBank.InterrupteurOpened} name={"Interrupteur"}/>
                    {/* <ComponentDrag img={Moteur} name={"Moteur"}/> */}
                </div>
    
                <canvas 
                    id="result" 
                    ref={canvasRef} 
                    width="800" 
                    height="400"
                    onDrop={handleDrop}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                ></canvas>
            </div>

            <div>
                <img 
                    src={binImg} 
                    onClick={() => {
                        components.current.splice(components.current.findIndex(c => c.id == selectedComponent.id), 1)
                        setSelectedComponent(null)
                    }}
                    alt="🗑" 
                    id="bin"
                />
                <label htmlFor="range">Taille</label>
                <input 
                    type="range" 
                    min="64" 
                    max="256" 
                    defaultValue={componentSize}
                    onInput={(e) => componentSize = (Number((e.target as HTMLInputElement).value))}
                />

                <div id="properties">
                    <span>{selectedComponent?.name}</span>
                </div>
            </div>
        </div>
    </>)
}

export default ElecSimulate;