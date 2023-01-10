let input = document.getElementById("molInput")
let molName = document.getElementById("molName")
let title = document.getElementById("title")

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

                if(n == 0){
                    n = 1
                }
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

            let elecDeValence = atome.valence()
            mol[i].duets = {liants: 0, nonLiants: 0}
            if(atome.Z === 1){
                
            }

            if(isGazNoble(Z)){
                displayError("Les gaz nobles ne forment pas de molécules!")
                return false //Exit function
            }
        }else{
            displayError("Oops! Une erreur est survenue :(  Vérifiez la molécule.")
            return false //Exit function
        }
    }
})