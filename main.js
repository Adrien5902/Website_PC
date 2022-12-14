class atom {
    getCouches() {
        const limit = {
            s : 2,
            p : 6,
            d : 10,
            f : 14,
            g : 18,
        }

        const couchesList = [
            "1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"
        ] 
        
        let remaining = this.Z
        let couches = {}

        let i = 0;
        while (remaining >= 1){ //tant qu'il y a des e- a répartir
            let couche = couchesList[i]

            const limiteSousCouche = limit[couche[1]] //limite sous couche  ex : 2 (pour s), 6 (pour d)...

            couches[couche] = limiteSousCouche
            remaining -= limiteSousCouche
            
            if(remaining < 1){
                couches[couche] += remaining
                break
            }
            i++
        }
        return couches
    }

    constructor (Z) {
        if(Z < 1 && Z > 118){
            console.error("Atome inexistant")
        }else{
            this.Z = Z
            this.couches = this.getCouches()
        }
    }

    couchesString() {
        let str = ""
        let couches = this.couches
        for(let couche in couches){
            str += "(" + couche + "<sup>" + couches[couche] + "</sup>)"
        }
        return str
    }
}
