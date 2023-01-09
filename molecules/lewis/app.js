let input = document.getElementById("molInput")

input.addEventListener("change", (event) => {
    let mol = []

    const value = input.value
    
    let i = 0
    while(i < value.length){
        const letter = value[i]
        if(letter != " " && letter == letter.toUpperCase()){
            let symbol = letter
            
            let n = 1
            if(i + 1 < value.length){
                const nextLetter = value[i + 1]
                if(!isNaN(nextLetter)){
                    n = parseInt(nextLetter)
                    i++
                }else if(nextLetter == nextLetter.toLowerCase()){
                    symbol += nextLetter
                    if(i + 2 < value.length && !isNaN(value[i + 2]) != NaN){
                        n = value[i + 2]
                    }
                    i++
                }
            }
            i++
            mol.push({symbol: symbol, n: n})
        }
    }
    
    console.log(mol)
})