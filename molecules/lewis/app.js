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
})