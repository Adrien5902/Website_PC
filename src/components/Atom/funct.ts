/////////////////////////////
//Fonctions liées au atomes//
/////////////////////////////

/*
TABLES
*/

//Liste des élements du tableau périodique avec noms, symboles, numéro atomique et masse molaire
export const elements = [
    {Z :1, name: "Hydrogène", symbol : "H", M: 1.00794, family: "Non-métal"},
    {Z :2, name: "Hélium", symbol : "He", M: 4.002602, family: "Gaz noble"},
    {Z :3, name: "Lithium", symbol : "Li", M: 6.941, family: "Métal alcalin"},
    {Z :4, name: "Béryllium", symbol : "Be", M: 9.012182, family: "Métal alcalino-terreux"},
    {Z :5, name: "Bore", symbol : "B", M: 10.811, family: "Métalloïde"},
    {Z :6, name: "Carbone", symbol : "C", M: 12.011, family: "Non-métal"},
    {Z :7, name: "Azote", symbol : "N", M: 14.00674, family: "Non-métal"},
    {Z :8, name: "Oxygène", symbol : "O", M: 15.9994, family: "Non-métal"},
    {Z :9, name: "Fluor", symbol : "F", M: 18.9984032, family: "Halogène"},
    {Z :10, name: "Néon", symbol : "Ne", M: 20.1797, family: "Gaz noble"},
    {Z :11, name: "Sodium", symbol : "Na", M: 22.989768, family: "Métal alcalin"},
    {Z :12, name: "Magnésium", symbol : "Mg", M: 24.305, family: "Métal alcalino-terreux"},
    {Z :13, name: "Aluminium", symbol : "Al", M: 26.981539, family: "Métal pauvre"},
    {Z :14, name: "Silicium", symbol : "Si", M: 28.0855, family: "Métalloïde"},
    {Z :15, name: "Phosphore", symbol : "P", M: 30.973762, family: "Non-métal"},
    {Z :16, name: "Soufre", symbol : "S", M: 32.066, family: "Non-métal"},
    {Z :17, name: "Chlore", symbol : "Cl", M: 35.4527, family: "Halogène"},
    {Z :18, name: "Argon", symbol : "Ar", M: 39.948, family: "Gaz noble"},
    {Z :19, name: "Potassium", symbol : "K", M: 39.0983, family: "Métal alcalin"},
    {Z :20, name: "Calcium", symbol : "Ca", M: 40.078, family: "Métal alcalino-terreux"},
    {Z :21, name: "Scandium", symbol : "Sc", M: 44.95591, family: "Métal de transition"},
    {Z :22, name: "Titane", symbol : "Ti", M: 47.88, family: "Métal de transition"},
    {Z :23, name: "Vanadium", symbol : "V", M: 50.9415, family: "Métal de transition"},
    {Z :24, name: "Chrome", symbol : "Cr", M: 51.9961, family: "Métal de transition"},
    {Z :25, name: "Manganèse", symbol : "Mn", M: 54.93805, family: "Métal de transition"},
    {Z :26, name: "Fer", symbol : "Fe", M: 55.847, family: "Métal de transition"},
    {Z :27, name: "Cobalt", symbol : "Co", M: 58.9332, family: "Métal de transition"},
    {Z :28, name: "Nickel", symbol : "Ni", M: 58.69, family: "Métal de transition"},
    {Z :29, name: "Cuivre", symbol : "Cu", M: 63.546, family: "Métal de transition"},
    {Z :30, name: "Zinc", symbol : "Zn", M: 65.39, family: "Métal pauvre"},
    {Z :31, name: "Gallium", symbol : "Ga", M: 69.723, family: "Métal pauvre"},
    {Z :32, name: "Germanium", symbol : "Ge", M: 72.61, family: "Métalloïde"},
    {Z :33, name: "Arsenic", symbol : "As", M: 74.92159, family: "Métalloïde"},
    {Z :34, name: "Sélénium", symbol : "Se", M: 78.96, family: "Non-métal"},
    {Z :35, name: "Brome", symbol : "Br", M: 79.904, family: "Halogène"},
    {Z :36, name: "Krypton", symbol : "Kr", M: 83.8, family: "gaz rare"},
    {Z :37, name: "Rubidium", symbol : "Rb", M: 85.4678, family: "Métal alcalin"},
    {Z :38, name: "Strontium", symbol : "Sr", M: 87.62, family: "Métal alcalino-terreux"},
    {Z :39, name: "Yttrium", symbol : "Y", M: 88.90585, family: "Métal de transition"},
    {Z :40, name: "Zirconium", symbol : "Zr", M: 91.224, family: "Métal de transition"},
    {Z :41, name: "Niobium", symbol : "Nb", M: 92.90638, family: "Métal de transition"},
    {Z :42, name: "Molybdène", symbol : "Mo", M: 95.94, family: "Métal de transition"},
    {Z :43, name: "Technétium", symbol : "Tc", M: 98.9063, family: "Métal de transition"},
    {Z :44, name: "Ruthénium", symbol : "Ru", M: 101.07, family: "Métal de transition"},
    {Z :45, name: "Rhodium", symbol : "Rh", M: 102.9055, family: "Métal de transition"},
    {Z :46, name: "Palladium", symbol : "Pd", M: 106.42, family: "Métal de transition"},
    {Z :47, name: "Argent", symbol : "Ag", M: 107.8682, family: "Métal de transition"},
    {Z :48, name: "Cadmium", symbol : "Cd", M: 112.411, family: "Métal pauvre"},
    {Z :49, name: "Indium", symbol : "In", M: 114.82, family: "Métal pauvre"},
    {Z :50, name: "Étain", symbol : "Sn", M: 118.71, family: "Métal pauvre"},
    {Z :51, name: "Antimoine", symbol : "Sb", M: 121.75, family: "Métalloïde"},
    {Z :52, name: "Tellure", symbol : "Te", M: 127.6, family: "Métalloïde"},
    {Z :53, name: "Iode", symbol : "I", M: 126.90447, family: "Halogène"},
    {Z :54, name: "Xénon", symbol : "Xe", M: 131.29, family: "gaz rare"},
    {Z :55, name: "Césium", symbol : "Cs", M: 132.90543, family: "Métal alcalin"},
    {Z :56, name: "Baryum", symbol : "Ba", M: 137.327, family: "Métal alcalino-terreux"},
    {Z :57, name: "Lanthane", symbol : "La", M: 138.9055, family: "Lanthanide"},
    {Z :58, name: "Cérium", symbol : "Ce", M: 140.115, family: "Lanthanide"},
    {Z :59, name: "Praséodyme", symbol : "Pr", M: 140.90765, family: "Lanthanide"},
    {Z :60, name: "Néodyme", symbol : "Nd", M: 144.24, family: "Lanthanide"},
    {Z :61, name: "Prométhium", symbol : "Pm", M: 146.9151, family: "Lanthanide"},
    {Z :62, name: "Samarium", symbol : "Sm", M: 150.36, family: "Lanthanide"},
    {Z :63, name: "Europium", symbol : "Eu", M: 151.965, family: "Lanthanide"},
    {Z :64, name: "Gadolinium", symbol : "Gd", M: 157.25, family: "Lanthanide"},
    {Z :65, name: "Terbium", symbol : "Tb", M: 158.92534, family: "Lanthanide"},
    {Z :66, name: "Dysprosium", symbol : "Dy", M: 162.5, family: "Lanthanide"},
    {Z :67, name: "Holmium", symbol : "Ho", M: 164.93032, family: "Lanthanide"},
    {Z :68, name: "Erbium", symbol : "Er", M: 167.26, family: "Lanthanide"},
    {Z :69, name: "Thulium", symbol : "Tm", M: 168.93421, family: "Lanthanide"},
    {Z :70, name: "Ytterbium", symbol : "Yb", M: 173.04, family: "Lanthanide"},
    {Z :71, name: "Lutécium", symbol : "Lu", M: 174.967, family: "Lanthanide"},
    {Z :72, name: "Hafnium", symbol : "Hf", M: 178.49, family: "Métal de transition"},
    {Z :73, name: "Tantale", symbol : "Ta", M: 180.9479, family: "Métal de transition"},
    {Z :74, name: "Tungstène", symbol : "W", M: 183.85, family: "Métal de transition"},
    {Z :75, name: "Rhénium", symbol : "Re", M: 186.207, family: "Métal de transition"},
    {Z :76, name: "Osmium", symbol : "Os", M: 190.2, family: "Métal de transition"},
    {Z :77, name: "Iridium", symbol : "Ir", M: 192.22, family: "Métal de transition"},
    {Z :78, name: "Platine", symbol : "Pt", M: 195.08, family: "Métal de transition"},
    {Z :79, name: "Or", symbol : "Au", M: 196.96654, family: "Métal de transition"},
    {Z :80, name: "Mercure", symbol : "Hg", M: 200.59, family: "Métal pauvre"},
    {Z :81, name: "Thallium", symbol : "Tl", M: 204.3833, family: "Métal pauvre"},
    {Z :82, name: "Plomb", symbol : "Pb", M: 207.2, family: "Métal pauvre"},
    {Z :83, name: "Bismuth", symbol : "Bi", M: 208.98037, family: "Métal pauvre"},
    {Z :84, name: "Polonium", symbol : "Po", M: 208.9824, family: "Métal pauvre"},
    {Z :85, name: "Astate", symbol : "At", M: 209.9871, family: "Métalloïde"},
    {Z :86, name: "Radon", symbol : "Rn", M: 222.0176, family: "Gaz noble"},
    {Z :87, name: "Francium", symbol : "Fr", M: 223.0197, family: "Métal alcalin"},
    {Z :88, name: "Radium", symbol : "Ra", M: 226.0254, family: "Métal alcalino-terreux"},
    {Z :89, name: "Actinium", symbol : "Ac", M: 227.0278, family: "Actinide"},
    {Z :90, name: "Thorium", symbol : "Th", M: 232.0381, family: "Actinide"},
    {Z :91, name: "Protactinium", symbol : "Pa", M: 231.0359, family: "Actinide"},
    {Z :92, name: "Uranium", symbol : "U", M: 238.0289, family: "Actinide"},
    {Z :93, name: "Neptunium", symbol : "Np", M: 237.0482, family: "Actinide"},
    {Z :94, name: "Plutonium", symbol : "Pu", M: 244.0642, family: "Actinide"},
    {Z :95, name: "Américium", symbol : "Am", M: 243.0614, family: "Actinide"},
    {Z :96, name: "Curium", symbol : "Cm", M: 247.0703, family: "Actinide"},
    {Z :97, name: "Berkélium", symbol : "Bk", M: 247.0703, family: "Actinide"},
    {Z :98, name: "Californium", symbol : "Cf", M: 251.0796, family: "Actinide"},
    {Z :99, name: "Einsteinium", symbol : "Es", M: 252.0829, family: "Actinide"},
    {Z :100, name: "Fermium", symbol : "Fm", M: 257.0951, family: "Actinide"},
    {Z :101, name: "Mendélévium", symbol : "Md", M: 258.0986, family: "Actinide"},
    {Z :102, name: "Nobélium", symbol : "No", M: 259.1009, family: "Actinide"},
    {Z :103, name: "Lawrencium", symbol : "Lr", M: 260.1053, family: "Actinide"},
    {Z :104, name: "Rutherfordium", symbol : "Rf", M: 261.1087, family: "Métal de transition"},
    {Z :105, name: "Dubnium", symbol : "Db", M: 262.1138, family: "Métal de transition"},
    {Z :106, name: "Seaborgium", symbol : "Sg", M: 263.1182, family: "Métal de transition"},
    {Z :107, name: "Bohrium", symbol : "Bh", M: 262.1229, family: "Métal de transition"},
    {Z :108, name: "Hassium", symbol : "Hs", M: 265, family: "Métal de transition"},
    {Z :109, name: "Meitnérium", symbol : "Mt", M: 266, family: "Indéfinie"},
    {Z :110, name: "Darmstadtium", symbol : "Ds", M: 269, family: "Indéfinie"},
    {Z :111, name: "Roentgenium", symbol : "Rg", M: 272, family: "Indéfinie"},
    {Z :112, name: "Copernicium", symbol : "Cn", M: 277, family: "Métal de transition"},
    {Z :113, name: "Nihonium", symbol : "Nh", M: 286, family: "Indéfinie"},
    {Z :114, name: "Flérovium", symbol : "Fl", M: 289, family: "Indéfinie"},
    {Z :115, name: "Moscovium", symbol : "Mc", M: 289, family: "Indéfinie"},
    {Z :116, name: "Livermorium", symbol : "Lv", M: 293, family: "Indéfinie"},
    {Z :117, name: "Tennesse", symbol : "Ts", M: 294, family: "Indéfinie"},
    {Z :118, name: "Oganesson", symbol : "Og", M: 294, family: "Indéfinie"},
]

export const couchesList = [ //Liste des couches électroniques dans l'odre de remplissage
    "1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"
]

//Liste des gaz nobles (numéros atomiques)
export const gazNobles = [2, 10, 18, 36, 54, 86, 118]

export const couchesLimit = { //Limites des sous couches
    s : 2,
    p : 6,
    d : 10,
    f : 14,
}

/**
* TYPES
*/

export type Bloc = "s" | "p" | "d" | "f"

export type Couches = {
    "1s"?: number,"2s"?: number,"2p"?: number,"3s"?: number,"3p"?: number,"4s"?: number,"3d"?: number,
    "4p"?: number,"5s"?: number,"4d"?: number,"5p"?: number,"6s"?: number,"4f"?: number,"5d"?: number,
    "6p"?: number,"7s"?: number,"5f"?: number,"6d"?: number,"7p"?: number
}


/*
SCRIPT
*/

export function isGazNoble(Z = 0){ //Renvoie true si l'atome est un gaz noble et false sinon
    if(gazNobles.indexOf(Z) == -1){
        return false
    }else{
        return true
    }
}

//Classe Atome
export class atom {
    Z: number
    symbol: string
    name: string
    M: number
    période: number
    bloc: Bloc
    groupe: string
    lastGazNoble?: atom
    couches: Couches

    //Couches électroniques
    getCouches() {
        let remaining = this.Z //Nombre d'e- à répartir
        const couches = {} //Initialize la variable couches

        let i = 0 //Initialize la variable couches
        while (remaining > 0){ //tant qu'il y a des e- a répartir
            let couche = couchesList[i] //Définit la couche sur laqulle on va répartir les e-

            const limiteSousCouche = couchesLimit[couche[1]] //limite sous couche  ex : 2 (pour s), 6 (pour d)...

            couches[couche] = limiteSousCouche //Sature la couche
            remaining -= limiteSousCouche //soustrait le nombre d'e- à répartis au nombre d'e- à répartir
            
            if(remaining < 1){ //Si il n'y a plus d'e- à répartir
                couches[couche] += remaining //Retire des e- dans la couche si la couche a été saturée alors qu'elle n'aurait pas du l'être
                break //Stopper le script
            }

            i++ //Passe a la prochaine couche
        }

        return couches //Renvoie les couches électroniques
    }

    //Constructeur Atom
    constructor (Z: number) { //Z = Numéro atomique
        if(Z < 1 || Z > 118){ //Si le numéro atomique n'est aucun de ceux des éléments
            console.error("Atome inexistant") //Renvoie une erreur dans la console
        }else{
            const i = Z-1
            this.Z = Z //Set numéro atomique
            this.symbol = elements[i].symbol //Set symbole
            this.name = elements[i].name //Set nom de l'atome
            this.M = elements[i].M //Set Masse molaire

            this.couches = this.getCouches() //Récupère les couches électroniques de l'atome

            this.période = Number(Object.keys(this.couches).sort()[Object.keys(this.couches).length - 1][0])
            this.groupe = this.couches[Object.keys(this.couches)[Object.keys(this.couches).length - 1]]
            this.bloc = Object.keys(this.couches)[Object.keys(this.couches).length - 1][1] as Bloc

            const lastGazNobleIndex = [...gazNobles].sort((a, b) => b - a).find(gazNobleZ => gazNobleZ < this.Z)
            this.lastGazNoble = lastGazNobleIndex ? new atom(lastGazNobleIndex) : null
        }
    }

    valence(){ //Calcule le nombre d'électron de valence
        let n = 0
        for(let couche of Object.keys(this.couches)){
            if(couche[0] == this.période.toString()){
                n += this.couches[couche]
            }
        }
        return n
    }
}

export const atomes = elements.map(element => new atom(element.Z))