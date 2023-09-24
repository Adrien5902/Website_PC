import { Component, Pos } from "../types";

export class Moteur implements Component{
    name: string;
    pos: Pos;
    id: number;

    static nom = "Moteur"

    constructor(){

    }

    draw() {
        
    }
    
    isPowerSource = () => true
}