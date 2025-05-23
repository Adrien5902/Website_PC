const input = document.getElementById("molInput")
const molName = document.getElementById("molName")
const title = document.getElementById("title")

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = 48
ctx.font = `${size}px sans-serif`;

input.addEventListener("change", (event) => {
    const mol = []
    title.classList.add("hide")
    const value = input.value
    
    let i = 0
    while(i < value.length){
        const letter = value[i]
        if(letter !== " " && letter === letter.toUpperCase()){
            let symbol = letter
            
            let n = 0
            if(i + 1 < value.length){
                if(Number.isNaN(value[i + 1]) && value[i + 1] === value[i + 1].toLowerCase()){
                    symbol += value[i + 1]
                    i++
                }
                
                while(i + 1 < value.length && !Number.isNaN(value[i + 1])){
                    n += value[i + 1]
                    i++
                }
                if(typeof n === "string"){
                    n = Number.parseInt(n)
                }
            }

            if(n === 0){
                n = 1
            }
            mol.push({symbol: symbol, n: n})
        }
        i++
    }

    molName.innerHTML = ""
    title.classList.remove("hide")
    for(const i in mol){
        const piece = mol[i]
        let Z = 0
        for(const i in elements){
            const element = elements[i]
                if(element.symbol === piece.symbol){
                    if(i < 18){
                        Z = element.Z
                    }else{
                        displayError("Le site ne supporte pas encore les atomes avec un numéro atomique supérieur à 18")
                        return false //Exit function
                    }
                    break
                }
        }

        if(Z === 0){
            displayError("Atome innexistant")
            return false //Exit function
        }

        if(Z){
            const atome = new atom(Z)

            molName.innerHTML += atome.symbol
            if(piece.n > 1){
                molName.innerHTML += `<sub>${piece.n}</sub>`
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

    for(const atome of mol){
        const valenceElectronCount = atome.valence()
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.fillText(atome.symbol, centerX-(size/2), centerY-(size/2));

        let angle = 0;
        const step = (2 * Math.PI) / valenceElectronCount;
        const radius = 100
        const electronRadius = 5

        for (let i = 0; i < valenceElectronCount; i++) {
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, electronRadius, 0, 2 * Math.PI);
            ctx.fill();
            angle += step;
        }

        const bondCount = 4; // Example, replace with actual bond count
        const bondAngle = (2 * Math.PI) / valenceElectronCount;
        const bondRadius = 100

        for (let i = 0; i < bondCount; i++) {
            const bondX = centerX + bondRadius * Math.cos(bondAngle * i);
            const bondY = centerY + bondRadius * Math.sin(bondAngle * i);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(bondX, bondY);
            ctx.stroke();
        }
    }
})