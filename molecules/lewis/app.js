let input = document.getElementById("molInput")
let molName = document.getElementById("molName")
let title = document.getElementById("title")

const sides = {
    bottom: {opposite: "top", x: 0, y: -1},
    top: {opposite: "bottom", x: 0, y: 1},
    left: {opposite: "right", x: -1, y: 0},
    right: {opposite: "left", x: 1, y: 0},
}

input.addEventListener("change", (event) => {
    let mol = []
    title.classList.add("hide")
    const value = input.value
    
    let i = 0
    while(i < value.length){
        const letter = value[i]
        if(letter != " " && letter == letter.toUpperCase()){
            let symbol = letter
            
            let n = 0
            if(i + 1 < value.length){
                if(isNaN(value[i + 1]) && value[i + 1] == value[i + 1].toLowerCase()){
                    symbol += value[i + 1]
                    i++
                }
                
                while(i + 1 < value.length && !isNaN(value[i + 1])){
                    n += value[i + 1]
                    i++
                }
                if(typeof n == "string"){
                    n = parseInt(n)
                }
            }

            if(n == 0){
                n = 1
            }
            mol.push({symbol: symbol, n: n})
        }
        i++
    }

    molName.innerHTML = ""
    title.classList.remove("hide")
    for(let i in mol){
        let piece = mol[i]
        let Z = 0
        for(let i in elements){
            let element = elements[i]
            if(i < 18){
                if(element.symbol == piece.symbol){
                    Z = element.Z
                    break
                }
            }else{
                displayError("Le site ne supporte pas encore les atomes avec un numéro atomique supérieur à 18")
                return false //Exit function
            }
        }

        if(Z){
            let atome = new atom(Z)

            molName.innerHTML += atome.symbol
            if(piece.n > 1){
                molName.innerHTML += "<sub>" + piece.n + "</sub>"
            }

            mol[i].doublets = atome.doublets()

            mol[i].atom = atome

            if(isGazNoble(Z)){
                displayError("Les gaz nobles ne forment pas de molécules!")
                return false //Exit function
            }
        }else{
            displayError("Oops! Une erreur est survenue :(  Vérifiez la molécule.")
            return false //Exit function
        }
    }

    let schema = []
    for(let conns = 4; conns > 0; conns--){
        for(let i in mol){
            let atome = mol[i]
            if(atome.doublets.liants == conns){ //Commencer par les atomes avec le + de doublets liants
                for(let n = atome.n; n > 0; n--){
                    let obj = {}
                    obj.symbol = atome.symbol
                    obj.doublets = atome.doublets
                    obj.pos = {x: 0, y: 0}
                    obj.conns = {bottom: false, top: false, left: false, right: false}
                    let nonLiants = atome.doublets.nonLiants
                    while(nonLiants > 0){
                        obj.conns[Object.keys(obj.conns)[nonLiants - 1]] = "non-liant"
                        nonLiants--
                    }
    
                    for(let j in schema){
                        let piece = schema[j]

                        if(piece.symbol != "H"){
                            for(let side of Object.keys(piece.conns)){
                                if(piece.conns[side] === false){
                                    obj.conns[sides[side].opposite] = parseInt(j)
                                    schema[j].conns[side] = schema.length
                                    break
                                }
                            }
                        }
                    }
                    schema.push(obj)
                }
            }
        }
    }

    console.log(mol, schema)
})