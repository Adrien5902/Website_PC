let input = document.getElementById("molInput")
let molName = document.getElementById("molName")
let title = document.getElementById("title")

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let size = 48
ctx.font = size+'px sans-serif';

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
                if(element.symbol == piece.symbol){
                    if(i < 18){
                        Z = element.Z
                    }else{
                        displayError("Le site ne supporte pas encore les atomes avec un numéro atomique supérieur à 18")
                        return false //Exit function
                    }
                    break
                }
        }

        if(Z == 0){
            displayError("Atome innexistant")
            return false //Exit function
        }

        if(Z){
            let atome = new atom(Z)

            molName.innerHTML += atome.symbol
            if(piece.n > 1){
                molName.innerHTML += "<sub>" + piece.n + "</sub>"
            }

            mol[i] = atome

            if(isGazNoble(Z)){
                displayError("Les gaz nobles ne forment pas de molécules!")
                return false //Exit function
            }
        }else{
            displayError("Oops! Une erreur est survenue :(  Vérifiez la molécule.")
            return false //Exit function
        }
    }

    for(let atome of mol){
        let valenceElectronCount = atome.valence()
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        ctx.fillText(atome.symbol, centerX-(size/2), centerY-(size/2));

        let angle = 0;
        let step = (2 * Math.PI) / valenceElectronCount;
        let radius = 100
        let electronRadius = 5

        for (let i = 0; i < valenceElectronCount; i++) {
            let x = centerX + radius * Math.cos(angle);
            let y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, electronRadius, 0, 2 * Math.PI);
            ctx.fill();
            angle += step;
        }

        let bondCount = 4; // Example, replace with actual bond count
        let bondAngle = (2 * Math.PI) / valenceElectronCount;
        let bondRadius = 100

        for (let i = 0; i < bondCount; i++) {
            let bondX = centerX + bondRadius * Math.cos(bondAngle * i);
            let bondY = centerY + bondRadius * Math.sin(bondAngle * i);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(bondX, bondY);
            ctx.stroke();
        }
    }
})