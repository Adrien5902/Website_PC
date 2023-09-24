import { Component } from "./components/types"

export default class Connection{
    first: Component
    second: Component
    
    constructor(first, second){
        this.first = first
        this.second = second
    }
}