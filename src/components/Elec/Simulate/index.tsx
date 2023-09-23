// import "./app"
import './style.css'
import React, { useEffect, useState } from "react";
import { Component } from "./components";

import cableImg from './img/cable.png'
import binImg from './img/bin.png'

function ElecSimulate() {
    const [components, setComponents] : [Component[], React.Dispatch<Component[]>] = useState([])
    const [connections, setConnexions] = useState([])
    const [componentSize, setComponentSize] = useState(64)
    const [cableMouse, setCableMouse] = useState(false)
    const frameRate = 15

    useEffect(() => {
        const canvas = document.querySelector('canvas#result') as HTMLCanvasElement
        const ctx = canvas.getContext("2d")

        ctx.lineWidth = componentSize/12;

        function drawCanvas(){
            components.forEach(component => component.draw())
        }

        function resizeCanvas(){
            canvas.setAttribute('width', canvas.getBoundingClientRect().width.toString())
            canvas.setAttribute('height', canvas.getBoundingClientRect().height.toString())
            drawCanvas()
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas);

        setInterval(() => {
            drawCanvas()
        }, frameRate)
    }, [])

    return (<>
        <img className="back" onClick={() => history.go(-1)} src="../../assets/back-arrow.png" alt="←"/>
        
        <h1>Simulation de circuit électriques</h1>
        
        <div id="app" className={cableMouse ? 'cable' : ""}>
            <div>
                <div id="components">
                    <div className="componentBox">
                        <img src={cableImg} onClick={() => setCableMouse(cable => ! cable)} draggable="false" id="toggleCable"/>
                        <span>Câble</span>
                    </div>
                </div>
    
                <canvas id="result" width="800" height="400"></canvas>
            </div>

            <div>
                <img src={binImg} alt="🗑" id="bin"/>
                <label htmlFor="range">Taille</label>
                <input 
                    type="range" 
                    min="30" 
                    max="120" 
                    defaultValue="64"
                    onInput={(e) => setComponentSize(Number((e.target as HTMLInputElement).value))}
                />

                <div id="properties"></div>
            </div>
        </div>
    </>)
}

export default ElecSimulate;