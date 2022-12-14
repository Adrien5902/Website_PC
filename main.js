class atom {
    constructor (Z) {
        this.Z = Z
    }

    getCouches() {
        const limit = {
            s : 2,
            p : 6,
            d : 10
        }

        const couchesList = {
            1 : "s",
            2 : "sp",
            3 : "spd"
        }

        let remaining = this.Z
        let couches = {}

        for(let couche in couchesList){
            const couches[couche] = {}

            const sousCouches = couchesList[couche] //liste des sous couches dans la couche

            for(let j = 0; j < sousCouches.length; j++){                        
                const sousCouche = sousCouches[j] //lettre sous couche  ex : s, p, d...
                const limiteSousCouche = limit[sousCouche] //limite sous couche  ex : 2 (pour s), 6 (pour d)...

                couches[couche][sousCouche] = limiteSousCouche
                remaining -= limiteSousCouche
                
                if(remaining < 1){
                    couches[couche][sousCouche] += remaining
                    break
                }
            }
                
            if(remaining < 1){
                break
            }
        }
        return couches
    }

    couchesString() {
        let str = ""
        for(let couche in this.getCouches()){
            for(let sousCouche in couches[couche]){
                str += "(" + couche+sousCouche+ "<sup>" + couches[couche][sousCouche] + "</sup>)"
            }
        }
        return str
    }
}