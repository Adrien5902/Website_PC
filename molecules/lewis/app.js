let input = document.getElementById("molInput")

input.addEventListener("change", (event) => {
    let mol = []

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

    for(let piece of mol){
        let Z = 0
        for(let element of elements){
            if(Z <= 18){
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