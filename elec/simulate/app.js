//Select HTML elements
let canvas = document.querySelector('canvas#result')
let componentsDiv = document.querySelector('#components')
let properties = document.querySelector('#properties')
let componentsSizeInput = document.querySelector('#componentsSize')

//Constantes
const componentsList = { //Liste des composants électroniques
    Lampe : {defaultProperties: {}},
    Interupteur : {defaultProperties: {open: true}},
    Pile : {defaultProperties: {activated: true}},
    Générateur : {defaultProperties: {activated: false}},
}

//Variables utilisateur
let connections = [] //Liste des cables sur le schéma
let components = [] //Liste de composants sur le schéma
let moving = false
let componentSize = componentsSizeInput.value

//
let ctx = canvas.getContext("2d")
canvas.setAttribute('width', canvas.getBoundingClientRect().width)
canvas.setAttribute('height', canvas.getBoundingClientRect().height)

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
]
let imageBank = document.querySelector("#imageBank")
for(let img of propImgs){
    let image = new Image()
    image.src = "img/"+img+".png"
    image.classList.add(img)
    imageBank.appendChild(image)
}

componentsSizeInput.addEventListener('input', (event) => {
    componentSize = componentsSizeInput.value
    drawCanvas()
})


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

function drawCanvas() {
    ctx.font = componentSize/3 +'px sans-serif';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i in components){
        let component = components[i]

        let image
        if((typeof component.on !== undefined && component.on) || (typeof component.activated !== undefined && component.activated)){
            image = document.querySelector('img.'+ component.type + "_on")
        }else if(typeof component.open !== undefined && component.open){
            image = document.querySelector('img.'+ component.type + "_open")
        }else{
            image = document.querySelector('img.'+ component.type)
        }

        ctx.drawImage(image, component.pos.x - componentSize/2, component.pos.y - componentSize/2, componentSize, componentSize);

        ctx.fillText(component.name, component.pos.x + componentSize/2, component.pos.y + componentSize/2);
    }
}

function updateProperties(id){
    let component = components[id]
    properties.innerHTML = ''
    
    const propertiesList = [
        {id: "name", fr: "Nom", edit: true},
        {id: "type", fr: "Type", edit: false},
        {id: "pos", fr: "Position", edit: true},
        {id: "on", fr: "Allumé", edit: false},
        {id: "activated", fr: "Activé", edit: true},
        {id: "open", fr: "Ouvert", edit: true},
    ]

    for(let property of propertiesList){
        if(typeof component[property.id] != 'undefined'){
            let valueEl
            if(property.id == "pos"){
                valueEl = document.createElement("div")
                for(let axe of Object.keys(component.pos)){
                    valueEl.innerHTML += axe + " : "
                    
                    let input = document.createElement("input")
                    input.setAttribute("type", "number")
                    input.classList.add(axe)
                    input.value = component.pos[axe]
                    input.addEventListener('change', ()=>{
                        component.pos[axe] = input.value
                        drawCanvas()
                    })
                    valueEl.appendChild(input)
                }
            }else if(false){
    
            }else{
                if(!property.edit){
                    valueEl = document.createElement("span")
                    valueEl.innerHTML = component[property.id]
                }else{
                    valueEl = document.createElement('input')
                    if(typeof component[property.id] == "number"){
                        valueEl.setAttribute('type', 'number')
                        valueEl.value = component[property.id]
                    }else if(typeof component[property.id] == "string"){
                        valueEl.setAttribute('type', 'text')
                        valueEl.value = component[property.id]
                    }else if(typeof component[property.id] == "boolean"){
                        valueEl.setAttribute('type', 'checkbox')
                        valueEl.checked = component[property.id]
                    }
                }
            }
            valueEl.id = property.id
            valueEl.addEventListener('input', (event) => {
                if(valueEl.getAttribute("type") == "checkbox"){
                    component[property.id] = valueEl.checked
                }else{
                    component[property.id] = valueEl.value
                }
                drawCanvas()
            })
    
            let propertyDiv = document.createElement('div')
            propertyDiv.id = property.id
            let propertyLabel = document.createElement("span")
            propertyLabel.innerHTML = property.fr + " : "
    
            properties.appendChild(propertyDiv)
            propertyDiv.appendChild(propertyLabel)
            propertyDiv.appendChild(valueEl)
        }
    }
}

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
    component.pos = getMousePos(canvas, event)
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
    let mousePos = getMousePos(canvas, event)
    for(let i in components){
        let component = components[i]
        if((component.pos.x - componentSize/2) <= mousePos.x && mousePos.x <= (component.pos.x + componentSize/2) && (component.pos.y - componentSize/2) <= mousePos.y && mousePos.y <= (component.pos.y + componentSize/2)){
            updateProperties(i)
            moving = i
            break
        }
    }

    if(moving !== false){
    }
})

canvas.addEventListener('mouseup', (event) => {
    moving = false
})

canvas.addEventListener('mousemove', (event) => {
    if(moving !== false){
        components[moving].pos = getMousePos(canvas, event)
        updateProperties(moving)
        drawCanvas()
    }
})