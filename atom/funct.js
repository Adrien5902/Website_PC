/////////////////////////////
//Fonctions liées au atomes//
/////////////////////////////

/*
TABLES
*/

//Liste des élements du tableau périodique avec noms, symboles, numéro atomique et masse molaire

const elements = [
    {Z :1, name: "Hydrogène", symbol : "H", M: 1.00794},
    {Z :2, name: "Hélium", symbol : "He", M: 4.002602},
    {Z :3, name: "Lithium", symbol : "Li", M: 6.941},
    {Z :4, name: "Béryllium", symbol : "Be", M: 9.012182},
    {Z :5, name: "Bore", symbol : "B", M: 10.811},
    {Z :6, name: "Carbone", symbol : "C", M: 12.011},
    {Z :7, name: "Azote", symbol : "N", M: 14.00674},
    {Z :8, name: "Oxygène", symbol : "O", M: 15.9994},
    {Z :9, name: "Fluor", symbol : "F", M: 18.9984032},
    {Z :10, name: "Néon", symbol : "Ne", M: 20.1797},
    {Z :11, name: "Sodium", symbol : "Na", M: 22.989768},
    {Z :12, name: "Magnésium", symbol : "Mg", M: 24.305},
    {Z :13, name: "Aluminium", symbol : "Al", M: 26.981539},
    {Z :14, name: "Silicium", symbol : "Si", M: 28.0855},
    {Z :15, name: "Phosphore", symbol : "P", M: 30.973762},
    {Z :16, name: "Soufre", symbol : "S", M: 32.066},
    {Z :17, name: "Chlore", symbol : "Cl", M: 35.4527},
    {Z :18, name: "Argon", symbol : "Ar", M: 39.948},
    {Z :19, name: "Potassium", symbol : "K", M: 39.0983},
    {Z :20, name: "Calcium", symbol : "Ca", M: 40.078},
    {Z :21, name: "Scandium", symbol : "Sc", M: 44.95591},
    {Z :22, name: "Titane", symbol : "Ti", M: 47.88},
    {Z :23, name: "Vanadium", symbol : "V", M: 50.9415},
    {Z :24, name: "Chrome", symbol : "Cr", M: 51.9961},
    {Z :25, name: "Manganèse", symbol : "Mn", M: 54.93805},
    {Z :26, name: "Fer", symbol : "Fe", M: 55.847},
    {Z :27, name: "Cobalt", symbol : "Co", M: 58.9332},
    {Z :28, name: "Nickel", symbol : "Ni", M: 58.69},
    {Z :29, name: "Cuivre", symbol : "Cu", M: 63.546},
    {Z :30, name: "Zinc", symbol : "Zn", M: 65.39},
    {Z :31, name: "Gallium", symbol : "Ga", M: 69.723},
    {Z :32, name: "Germanium", symbol : "Ge", M: 72.61},
    {Z :33, name: "Arsenic", symbol : "As", M: 74.92159},
    {Z :34, name: "Sélénium", symbol : "Se", M: 78.96},
    {Z :35, name: "Brome", symbol : "Br", M: 79.904},
    {Z :36, name: "Krypton", symbol : "Kr", M: 83.8},
    {Z :37, name: "Rubidium", symbol : "Rb", M: 85.4678},
    {Z :38, name: "Strontium", symbol : "Sr", M: 87.62},
    {Z :39, name: "Yttrium", symbol : "Y", M: 88.90585},
    {Z :40, name: "Zirconium", symbol : "Zr", M: 91.224},
    {Z :41, name: "Niobium", symbol : "Nb", M: 92.90638},
    {Z :42, name: "Molybdène", symbol : "Mo", M: 95.94},
    {Z :43, name: "Technétium", symbol : "Tc", M: 98.9063},
    {Z :44, name: "Ruthénium", symbol : "Ru", M: 101.07},
    {Z :45, name: "Rhodium", symbol : "Rh", M: 102.9055},
    {Z :46, name: "Palladium", symbol : "Pd", M: 106.42},
    {Z :47, name: "Argent", symbol : "Ag", M: 107.8682},
    {Z :48, name: "Cadmium", symbol : "Cd", M: 112.411},
    {Z :49, name: "Indium", symbol : "In", M: 114.82},
    {Z :50, name: "Étain", symbol : "Sn", M: 118.71},
    {Z :51, name: "Antimoine", symbol : "Sb", M: 121.75},
    {Z :52, name: "Tellure", symbol : "Te", M: 127.6},
    {Z :53, name: "Iode", symbol : "I", M: 126.90447},
    {Z :54, name: "Xénon", symbol : "Xe", M: 131.29},
    {Z :55, name: "Césium", symbol : "Cs", M: 132.90543},
    {Z :56, name: "Baryum", symbol : "Ba", M: 137.327},
    {Z :57, name: "Lanthane", symbol : "La", M: 138.9055},
    {Z :58, name: "Cérium", symbol : "Ce", M: 140.115},
    {Z :59, name: "Praséodyme", symbol : "Pr", M: 140.90765},
    {Z :60, name: "Néodyme", symbol : "Nd", M: 144.24},
    {Z :61, name: "Prométhium", symbol : "Pm", M: 146.9151},
    {Z :62, name: "Samarium", symbol : "Sm", M: 150.36},
    {Z :63, name: "Europium", symbol : "Eu", M: 151.965},
    {Z :64, name: "Gadolinium", symbol : "Gd", M: 157.25},
    {Z :65, name: "Terbium", symbol : "Tb", M: 158.92534},
    {Z :66, name: "Dysprosium", symbol : "Dy", M: 162.5},
    {Z :67, name: "Holmium", symbol : "Ho", M: 164.93032},
    {Z :68, name: "Erbium", symbol : "Er", M: 167.26},
    {Z :69, name: "Thulium", symbol : "Tm", M: 168.93421},
    {Z :70, name: "Ytterbium", symbol : "Yb", M: 173.04},
    {Z :71, name: "Lutécium", symbol : "Lu", M: 174.967},
    {Z :72, name: "Hafnium", symbol : "Hf", M: 178.49},
    {Z :73, name: "Tantale", symbol : "Ta", M: 180.9479},
    {Z :74, name: "Tungstène", symbol : "W", M: 183.85},
    {Z :75, name: "Rhénium", symbol : "Re", M: 186.207},
    {Z :76, name: "Osmium", symbol : "Os", M: 190.2},
    {Z :77, name: "Iridium", symbol : "Ir", M: 192.22},
    {Z :78, name: "Platine", symbol : "Pt", M: 195.08},
    {Z :79, name: "Or", symbol : "Au", M: 196.96654},
    {Z :80, name: "Mercure", symbol : "Hg", M: 200.59},
    {Z :81, name: "Thallium", symbol : "Tl", M: 204.3833},
    {Z :82, name: "Plomb", symbol : "Pb", M: 207.2},
    {Z :83, name: "Bismuth", symbol : "Bi", M: 208.98037},
    {Z :84, name: "Polonium", symbol : "Po", M: 208.9824},
    {Z :85, name: "Astate", symbol : "At", M: 209.9871},
    {Z :86, name: "Radon", symbol : "Rn", M: 222.0176},
    {Z :87, name: "Francium", symbol : "Fr", M: 223.0197},
    {Z :88, name: "Radium", symbol : "Ra", M: 226.0254},
    {Z :89, name: "Actinium", symbol : "Ac", M: 227.0278},
    {Z :90, name: "Thorium", symbol : "Th", M: 232.0381},
    {Z :91, name: "Protactinium", symbol : "Pa", M: 231.0359},
    {Z :92, name: "Uranium", symbol : "U", M: 238.0289},
    {Z :93, name: "Neptunium", symbol : "Np", M: 237.0482},
    {Z :94, name: "Plutonium", symbol : "Pu", M: 244.0642},
    {Z :95, name: "Américium", symbol : "Am", M: 243.0614},
    {Z :96, name: "Curium", symbol : "Cm", M: 247.0703},
    {Z :97, name: "Berkélium", symbol : "Bk", M: 247.0703},
    {Z :98, name: "Californium", symbol : "Cf", M: 251.0796},
    {Z :99, name: "Einsteinium", symbol : "Es", M: 252.0829},
    {Z :100, name: "Fermium", symbol : "Fm", M: 257.0951},
    {Z :101, name: "Mendélévium", symbol : "Md", M: 258.0986},
    {Z :102, name: "Nobélium", symbol : "No", M: 259.1009},
    {Z :103, name: "Lawrencium", symbol : "Lr", M: 260.1053},
    {Z :104, name: "Rutherfordium", symbol : "Rf", M: 261.1087},
    {Z :105, name: "Dubnium", symbol : "Db", M: 262.1138},
    {Z :106, name: "Seaborgium", symbol : "Sg", M: 263.1182},
    {Z :107, name: "Bohrium", symbol : "Bh", M: 262.1229},
    {Z :108, name: "Hassium", symbol : "Hs", M: 265},
    {Z :109, name: "Meitnérium", symbol : "Mt", M: 266},
    {Z :110, name: "Darmstadtium", symbol : "Ds", M: 269},
    {Z :111, name: "Roentgenium", symbol : "Rg", M: 272},
    {Z :112, name: "Copernicium", symbol : "Cn", M: 277},
    {Z :113, name: "Nihonium", symbol : "Nh", M: 286},
    {Z :114, name: "Flérovium", symbol : "Fl", M: 289},
    {Z :115, name: "Moscovium", symbol : "Mc", M: 289},
    {Z :116, name: "Livermorium", symbol : "Lv", M: 293},
    {Z :117, name: "Tennesse", symbol : "Ts", M: 294},
    {Z :118, name: "Oganesson", symbol : "Og", M: 294},
]

const couchesList = [ //Liste des couches électroniques dans l'odre de remplissage
    "1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"
]

//Liste des gaz nobles (numéros atomiques)
const gazNobles = [2, 10, 18, 36, 54, 86, 118]

const couchesLimit = { //Limites des sous couches
    s : 2,
    p : 6,
    d : 10,
    f : 14,
}

/*
SCRIPT
*/

function isGazNoble(Z = 0){ //Renvoie true si l'atome est un gaz noble et false sinon
    if(gazNobles.indexOf(Z) == -1){
        return false
    }else{
        return true
    }
}

String.prototype.toSearch = function(){  //Retire les majuscules et accents d'un string
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
}

//Classe Atome
class atom {
    //Couches électroniques
    getCouches() {
        let remaining = this.Z //Nombre d'e- à répartir
        let couches = {} //Initialize la variable couches

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
    constructor (Z) { //Z = Numéro atomique
        if(Z < 1 && Z > 118){ //Si le numéro atomique n'est aucun de ceux des éléments
            console.error("Atome inexistant") //Renvoie une erreur dans la console
        }else{
            const i = Z-1
            this.Z = Z //Set numéro atomique
            this.symbol = elements[i].symbol //Set symbole
            this.name = elements[i].name //Set nom de l'atome
            this.M = elements[i].M //Set Masse molaire

            this.couches = this.getCouches() //Récupère les couches électroniques de l'atome

            this.période = Object.keys(this.couches).sort()[Object.keys(this.couches).length - 1][0]
            this.groupe = this.couches[Object.keys(this.couches)[Object.keys(this.couches).length - 1]]
            this.bloc = Object.keys(this.couches)[Object.keys(this.couches).length - 1][1]

            for (let i in gazNobles){ //Récupère le dernier gaz noble avant l'atome
                let Zgaz = gazNobles[i]
                if (this.Z > Zgaz){
                    if(i > 0){
                        let lastGazNoble = new atom(gazNobles[i])
                        this.lastGazNoble = lastGazNoble.Z
                    }
                }else{
                    break
                }
            }
        }
    }

    couchesString(shortened = true /*Raccourcir ou non les couches avec les symboles de gaz nobles*/) { //Renvoie les couches électroniques sous forme de texte
        let str = "" //Initialize le texte

        let lastGazNoble = {} //Initialize la variable pour éviter les erreurs undifinded
        if(shortened){
            if(this.lastGazNoble){
                lastGazNoble.couches = {}
                lastGazNoble = new atom (this.lastGazNoble) //Récupère le dernier gaz noble avant l'élement choisi
                str += '[<a href="view.html?Z=' + lastGazNoble.Z + '" class="cyan unlink tooltip">' + lastGazNoble.symbol + '<span class="tooltip-text">'+ lastGazNoble.couchesString(false) +'</span></a>] '  //L'ajoute au texte
            }
        }

        for(let couche of couchesList){ //Pour chaque couche
            if(this.couches[couche] >= 1){ //Si un électron ou + est présent dans la couche 
                if(!shortened || !lastGazNoble.couches || this.couches[couche] != lastGazNoble.couches[couche]){ 
                    str += "(" + couche + "<sup>" + this.couches[couche] + "</sup>)" //Si on ne doit pas raccourcir le texte ou que le la couche est présente dans le dernier gaz noble ajouter la couhe au texte
                }
            }else{ //Si il n'y pas d'électrons dans la couche
                break //Stopper le script
            }
        }

        return str //Renvoie le texte
    }

    cell(){ //Renvoie une cellule de tableau contenant le symbole et le numéro atomique de l'atome
        let str = '<a href="./view.html?Z=' + this.Z + '" class="atom-cell unlink">' 
        str += this.Z 
        str += '<br>'
        str += '<span style="font-size: 1.4em; font-weight: bold;">' + this.symbol + "</span>"
        str += "</a>"
        return str
    }

    valence(){ //Calcule le nombre d'électron de valence
        let n = 0
        for(let couche of Object.keys(this.couches)){
            if(couche[0] == this.période){
                n += this.couches[couche]
            }
        }
        return n
    }
}