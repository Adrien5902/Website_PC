//Select HTML elements
let canvas = document.querySelector('canvas#result')
let componentsDiv = document.querySelector('#components')
let properties = document.querySelector('#properties')
let componentsSizeInput = document.querySelector('#componentsSize')
let bin = document.getElementById('bin')

//Constantes
const componentsList = { //Liste des composants électroniques
    Pile : {defaultProperties: {activated: true}},
    Générateur : {defaultProperties: {activated: false}},
    Interupteur : {defaultProperties: {open: true}},
    Lampe : {defaultProperties: {on: false}},
    Moteur : {defaultProperties: {on: false, frame: 0}},
}

//Variables utilisateur
let connections = [] //Liste des cables sur le schéma
let components = [] //Liste de composants sur le schéma
let moving = false
let componentSize = componentsSizeInput.value
let cable = false

//
let ctx = canvas.getContext("2d")
canvas.setAttribute('width', canvas.getBoundingClientRect().width)
canvas.setAttribute('height', canvas.getBoundingClientRect().height)
ctx.lineWidth = componentSize/12;

//Création de la barre de récupérations des composants
for(let type of Object.keys(componentsList)){
    let el = document.createElement('div')
    componentsDiv.appendChild(el)
    el.classList.add('componentBox')

    let dragEL = document.createElement('div')
    dragEL.classList.add('component')
    dragEL.setAttribute('draggable', 'true')

    let img = document.createElement('img')
    img.src = 'img/' + type + '.png'
    img.classList.add(type)
    
    el.appendChild(dragEL)
    dragEL.appendChild(img)
    
    let label = document.createElement('span')
    label.innerHTML = type
    el.appendChild(label)

    
    dragEL.addEventListener('dragenter', (event) => {
        event.preventDefault()
    })

    dragEL.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData("text/plain", type);
    })
}

//Image bank (charge les images en avance)
const propImgs = [
    "Interupteur_open",
    "Générateur_on",
    "Lampe_on",
    "Pile_on",
    "Moteur/0",
    "Moteur/1",
    "Moteur/2",
    "Moteur/3",
]
let imageBank = document.querySelector("#imageBank")
for(let img of propImgs){
    let image = new Image()
    image.src = "img/"+img+".png"
    image.classList.add(img)
    imageBank.appendChild(image)
}

function isset(obj){
    if(typeof obj === "undefined"){
        return false
    }else{
        return true
    }
}

function selectComponent(mousePos){
    let selected = false
    let side = null
    for(let i in components){
        if(isset(components[i])){
            let component = components[i]
            if((component.pos.x - componentSize/2) <= mousePos.x && mousePos.x <= (component.pos.x + componentSize/2) && (component.pos.y - componentSize/2) <= mousePos.y && mousePos.y <= (component.pos.y + componentSize/2)){
                selected = i
                let x = Math.round(mousePos.x) - component.pos.x
                let y = Math.round(mousePos.y) - component.pos.y
                if(x>=y && -x>=y && !(x>=-y)){
                    side = "up"
                }else if(!(x>=y) && -x>=y && !(x>=-y)){
                    side = "left"
                }else if(!(x>=y) && !(-x>=y) && x>=-y){
                    side = "down"
                }else if(x>y && !(-x>=y) && x>=-y){
                    side = "right"
                }else if(x>=0){
                    side = "right"
                }else{
                    side = "left"
                }
                break
            }
        }
    }

    return {id: selected, component: components[selected], side: side}
}

function dropLeave(event){ //Retire la bordure
    canvas.style.border = ''
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function sidePos(side, pos = {x: 0, y:0}){
    let sides = {
        left: {x: -componentSize/2, y:0},
        right: {x: componentSize/2, y:0},
        up: {y: -componentSize/2, x:0},
        down: {y: componentSize/2, x:0},
    }

    return {
        x: pos.x + sides[side].x,
        y: pos.y + sides[side].y,
    }
}

function drawDot(pos = {x: 0, y:0}){
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawLine(from, to){
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function callNext(connection, on, firstConn){
    numberOfCalls++
    if(numberOfCalls < limit){
        if(connection.second.id != firstConn.first.id){
            for(let id in components){
                if(isset(components[id])){
                    let component = components[id]
                    if(connection.second.id == id){
                        toTrunOn.push(id)
                        let newConns = []
                        for(let conn of connections){
                            if(isset(conn) && conn.first.id == id && conn.first.side != connection.second.side){
                                newConns.push(conn)
                            }
                        }
    
                        if((on && !isset(newConns[0])) || (component.type == "Interupteur" && component.open == true)){
                            broke = true
                        }
    
                        for(let conn of newConns){
                            callNext(conn, on, firstConn)
                        }
                    }
                }
            }
        }
    }else{
        console.error("Oops une erueur est survenue :(")
    }
}


let animDelay = 100
let animated = []
function anim(){
    if(isset(animated[0])){
        for(let id of animated){
            if(components[id].frame >= 3){
                components[id].frame = 0
            }else{
                components[id].frame++
            }
        }
        drawCanvas()
        setTimeout(anim(), animDelay)
    }
}

let toTrunOn = []
let broke = true
let limit = 25
let numberOfCalls = 0
function drawCanvas() {
    for(let i in components){
        if(isset(components[i])){
            let component = components[i]

            //Circuit
            if((component.type == "Pile" || component.type == "Générateur")){
                for(let connection of connections){
                    if(isset(connection)){
                        for(let el of ['first', 'second']){
                            if(connection[el].side == "right" && connection[el].id == i){
                                toTrunOn = []
                                numberOfCalls = 0
                                broke = !component.activated
                                callNext(connection, component.activated, connection)
                                for(let id of toTrunOn){
                                    component = components[id]
                                    if(component.type == "Lampe" || component.type == "Moteur"){
                                        component.on = !broke
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if(component.type == "Moteur"){
                const index = animated.indexOf(i);
                console.log(component.on, index, i, component.type)
                if(component.on && index < 0){
                    animated.push(i)
                }else if(!component.on && index >= 0){
                    animated.splice(index, 1); 
                }
            }
        }
    }

    ctx.font = componentSize/3 +'px sans-serif';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i in components){
        if(isset(components[i])){
            let component = components[i]

            let image
            if((isset(component.on) && component.on && component.type != "Moteur") || (isset(component.activated) && component.activated)){
                image = document.querySelector('img.'+ component.type + "_on")
            }else if(component.type == "Moteur" && isset(component.on) && component.on){
                image = document.getElementsByClassName(component.type + "/" + component.frame)[0]
            }else if(isset(component.open) && component.open){
                image = document.querySelector('img.'+ component.type + "_open")
            }else{
                image = document.querySelector('img.'+ component.type)
            }

            if(component.type == "Pile" || component.type == "Générateur"){
                ctx.fillText("+", component.pos.x + componentSize/2, component.pos.y - componentSize/2);
                ctx.fillText("-", component.pos.x - componentSize/2, component.pos.y - componentSize/2);
            }
    
            ctx.drawImage(image, component.pos.x - componentSize/2, component.pos.y - componentSize/2, componentSize, componentSize);
    
            ctx.fillText(component.name, component.pos.x + componentSize/2, component.pos.y + componentSize/2);
        }
    }

    for(let connection of connections){
        if(isset(connection)){
            let positions = {}
            for(let el of ['first', 'second']){
                let component = components[connection[el].id]
                let posSide = sidePos(connection[el].side, {x: component.pos.x, y: component.pos.y})
                drawDot(posSide)
                positions[el] = posSide
            }

            drawLine(positions.first, positions.second)
        }
    }
}

function updateProperties(id){
    if(isset(components[id])){
        let component = components[id]
        properties.innerHTML = ''
        
        const propertiesList = [
            {id: "name", fr: "Nom", edit: true},
            {id: "type", fr: "Type", edit: false},
            //{id: "pos", fr: "Position", edit: true},
            {id: "on", fr: "Allumé", edit: false},
            {id: "activated", fr: "Activé", edit: true},
            {id: "open", fr: "Ouvert", edit: true},
        ]
    
        for(let property of propertiesList){
            if(isset(component[property.id])){
                let valueEl
                if(property.id == "pos"){
                    /*valueEl = document.createElement("div")
                    for(let axe of ['x', 'y']){
                        
                        let input = document.createElement("input")
                        input.type = "number"
                        input.classList.add(axe)
                        valueEl.appendChild(input)
                        input.value = component.pos[axe]
                        
                        console.log(axe, component.pos[axe], input)
                        input.addEventListener('input', (event) => {
                            component.pos[axe] = parseInt(input.value)
                            drawCanvas()
                        })
    
                        valueEl.innerHTML += axe + " : "
                    }*/
                }else{
                    if(!property.edit){
                        valueEl = document.createElement("span")
                        valueEl.innerHTML = component[property.id]
                    }else{
                        valueEl = document.createElement('input')
                        if(typeof component[property.id] == "number"){
                            valueEl.type = 'number'
                            valueEl.value = component[property.id]
                        }else if(typeof component[property.id] == "string"){
                            valueEl.type = 'text'
                            valueEl.value = component[property.id]
                        }else if(typeof component[property.id] == "boolean"){
                            valueEl.type = 'checkbox'
                            valueEl.checked = component[property.id]
                        }
                    }
                    valueEl.addEventListener('input', (event) => {
                        if(valueEl.getAttribute("type") == "checkbox"){
                            component[property.id] = valueEl.checked
                        }else{
                            component[property.id] = valueEl.value
                        }
                        drawCanvas()
                    })
                }
                valueEl.id = property.id
        
                let propertyDiv = document.createElement('div')
                propertyDiv.id = property.id
                let propertyLabel = document.createElement("span")
                propertyLabel.innerHTML = property.fr + " : "
        
                properties.appendChild(propertyDiv)
                propertyDiv.appendChild(propertyLabel)
                propertyDiv.appendChild(valueEl)
            }
        }

        //Bin
        bin.setAttribute("onclick","destroy("+id+")")
    }else{
        properties.innerHTML = "Sélectionnez d'abord un composant"
    }
}

componentsSizeInput.addEventListener('input', (event) => {
    componentSize = componentsSizeInput.value
    ctx.lineWidth = componentSize/12;
    drawCanvas()
})

canvas.addEventListener('dragover', (event) => { //Quand un composant survole la zone de dépot
    event.preventDefault() //Permet de le déposer
    canvas.style.borderStyle = 'dashed' //Change la bordure en pointilés
    canvas.style.borderColor = '#009eff' //Et change la couleur en bleu
})

canvas.addEventListener('dragleave', dropLeave) //Retire la bordure quand le composant sort de la zone

canvas.addEventListener('drop', (event) => {
    dropLeave(event) //Retire la bordure

    let component = {}

    component.type = event.dataTransfer.getData("text/plain") //Récupère le type du composant
    component.pos = {}
    let mousePos = getMousePos(canvas, event)
    component.pos.x = Math.round(mousePos.x)
    component.pos.y = Math.round(mousePos.y)
    component.name = component.type
    
    for(let property of Object.keys(componentsList[component.type].defaultProperties)){
        component[property] = componentsList[component.type].defaultProperties[property]
    }

    components.push(component)

    updateProperties(components.length - 1)

    setTimeout(()=>{
        drawCanvas()
    }, 1)
})

canvas.addEventListener('mousedown', (event) => {
    let selected = selectComponent(getMousePos(canvas, event))
    if(selected.id !== false){
        updateProperties(selected.id)
        if(cable){
            if(!cable.first.id){
                cable.first.id = selected.id
                cable.first.side = selected.side
            }
        }else{
            moving = selected.id
        }
    }
})

canvas.addEventListener('mouseup', (event) => {
    moving = false
    if(cable){
        if(cable.first.id){
            let selected = selectComponent(getMousePos(canvas, event))
            if(selected.id !== false && selected.id != cable.first.id){
                cable.second.id = selected.id
                cable.second.side = selected.side
                
                connections.push(cable)
            }
        }
        cable = {first:{id: false, side: false}, second:{id: false, side: false}}
        drawCanvas()
    }
})

canvas.addEventListener('mousemove', (event) => {
    let mousePos = getMousePos(canvas, event)

    if(cable){
        drawCanvas()

        let selected = selectComponent(getMousePos(canvas, event))
        if(selected.id !== false){
            let posSide = sidePos(selected.side, selected.component.pos)
            drawDot(posSide)
        }

        if(cable.first.id && isset(components[cable.first.id])){
            let component = components[cable.first.id]
            let posSide = sidePos(cable.first.side, component.pos)
            drawDot(posSide)
            drawLine({x: posSide.x, y: posSide.y}, {x: mousePos.x, y :mousePos.y})
        }
    }else if(moving !== false){
        components[moving].pos.x = Math.round(mousePos.x)
        components[moving].pos.y = Math.round(mousePos.y)
        updateProperties(moving)
        drawCanvas()
    }
})

//Toggle Cable
let toggleCableButton = document.getElementById('toggleCable')
toggleCableButton.addEventListener("click", ()=>{toggleCable()})
function toggleCable(){
    cable = !cable
    
    document.body.classList.toggle("cable", cable)
    if(cable){
        cable = {first:{id: false, side: false}, second:{id: false, side: false}}
    }
}

//Bin
function destroy(id){
    for(let component of components){
        if(isset(component)){
            if(component.type == "Lampe" || component.type == "Moteur"){
                component.on = false
            }
        }
    }

    for(let i in connections){
        if(isset(connections[i]) && (connections[i].first.id == id || connections[i].second.id == id)){
            connections[i] = undefined
        }
    }
    
    components[id] = undefined

    drawCanvas()
    updateProperties(-1)
}

updateProperties(-1)