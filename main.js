//Liste des élements du tableau périodique
const elements = [
    {Z :1, name: "Hydrogène", symbol : "H"},
    {Z :2, name: "Hélium", symbol : "He"},
    {Z :3, name: "Lithium", symbol : "Li"},
    {Z :4, name: "Béryllium", symbol : "Be"},
    {Z :5, name: "Bore", symbol : "B"},
    {Z :6, name: "Carbone", symbol : "C"},
    {Z :7, name: "Azote", symbol : "N"},
    {Z :8, name: "Oxygène", symbol : "O"},
    {Z :9, name: "Fluor", symbol : "F"},
    {Z :10, name: "Néon", symbol : "Ne"},
    {Z :11, name: "Sodium", symbol : "Na"},
    {Z :12, name: "Magnésium", symbol : "Mg"},
    {Z :13, name: "Aluminium", symbol : "Al"},
    {Z :14, name: "Silicium", symbol : "Si"},
    {Z :15, name: "Phosphore", symbol : "P"},
    {Z :16, name: "Soufre", symbol : "S"},
    {Z :17, name: "Chlore", symbol : "Cl"},
    {Z :18, name: "Argon", symbol : "Ar"},
    {Z :19, name: "Potassium", symbol : "K"},
    {Z :20, name: "Calcium", symbol : "Ca"},
    {Z :21, name: "Scandium", symbol : "Sc"},
    {Z :22, name: "Titane", symbol : "Ti"},
    {Z :23, name: "Vanadium", symbol : "V"},
    {Z :24, name: "Chrome", symbol : "Cr"},
    {Z :25, name: "Manganèse", symbol : "Mn"},
    {Z :26, name: "Fer", symbol : "Fe"},
    {Z :27, name: "Cobalt", symbol : "Co"},
    {Z :28, name: "Nickel", symbol : "Ni"},
    {Z :29, name: "Cuivre", symbol : "Cu"},
    {Z :30, name: "Zinc", symbol : "Zn"},
    {Z :31, name: "Gallium", symbol : "Ga"},
    {Z :32, name: "Germanium", symbol : "Ge"},
    {Z :33, name: "Arsenic", symbol : "As"},
    {Z :34, name: "Sélénium", symbol : "Se"},
    {Z :35, name: "Brome", symbol : "Br"},
    {Z :36, name: "Krypton", symbol : "Kr"},
    {Z :37, name: "Rubidium", symbol : "Rb"},
    {Z :38, name: "Strontium", symbol : "Sr"},
    {Z :39, name: "Yttrium", symbol : "Y"},
    {Z :40, name: "Zirconium", symbol : "Zr"},
    {Z :41, name: "Niobium", symbol : "Nb"},
    {Z :42, name: "Molybdène", symbol : "Mo"},
    {Z :43, name: "Technétium", symbol : "Tc"},
    {Z :44, name: "Ruthénium", symbol : "Ru"},
    {Z :45, name: "Rhodium", symbol : "Rh"},
    {Z :46, name: "Palladium", symbol : "Pd"},
    {Z :47, name: "Argent", symbol : "Ag"},
    {Z :48, name: "Cadmium", symbol : "Cd"},
    {Z :49, name: "Indium", symbol : "In"},
    {Z :50, name: "Étain", symbol : "Sn"},
    {Z :51, name: "Antimoine", symbol : "Sb"},
    {Z :52, name: "Tellure", symbol : "Te"},
    {Z :53, name: "Iode", symbol : "I"},
    {Z :54, name: "Xénon", symbol : "Xe"},
    {Z :55, name: "Césium", symbol : "Cs"},
    {Z :56, name: "Baryum", symbol : "Ba"},
    {Z :57, name: "Lanthane", symbol : "La"},
    {Z :58, name: "Cérium", symbol : "Ce"},
    {Z :59, name: "Praséodyme", symbol : "Pr"},
    {Z :60, name: "Néodyme", symbol : "Nd"},
    {Z :61, name: "Prométhium", symbol : "Pm"},
    {Z :62, name: "Samarium", symbol : "Sm"},
    {Z :63, name: "Europium", symbol : "Eu"},
    {Z :64, name: "Gadolinium", symbol : "Gd"},
    {Z :65, name: "Terbium", symbol : "Tb"},
    {Z :66, name: "Dysprosium", symbol : "Dy"},
    {Z :67, name: "Holmium", symbol : "Ho"},
    {Z :68, name: "Erbium", symbol : "Er"},
    {Z :69, name: "Thulium", symbol : "Tm"},
    {Z :70, name: "Ytterbium", symbol : "Yb"},
    {Z :71, name: "Lutécium", symbol : "Lu"},
    {Z :72, name: "Hafnium", symbol : "Hf"},
    {Z :73, name: "Tantale", symbol : "Ta"},
    {Z :74, name: "Tungstène", symbol : "W"},
    {Z :75, name: "Rhénium", symbol : "Re"},
    {Z :76, name: "Osmium", symbol : "Os"},
    {Z :77, name: "Iridium", symbol : "Ir"},
    {Z :78, name: "Platine", symbol : "Pt"},
    {Z :79, name: "Or", symbol : "Au"},
    {Z :80, name: "Mercure", symbol : "Hg"},
    {Z :81, name: "Thallium", symbol : "Tl"},
    {Z :82, name: "Plomb", symbol : "Pb"},
    {Z :83, name: "Bismuth", symbol : "Bi"},
    {Z :84, name: "Polonium", symbol : "Po"},
    {Z :85, name: "Astate", symbol : "At"},
    {Z :86, name: "Radon", symbol : "Rn"},
    {Z :87, name: "Francium", symbol : "Fr"},
    {Z :88, name: "Radium", symbol : "Ra"},
    {Z :89, name: "Actinium", symbol : "Ac"},
    {Z :90, name: "Thorium", symbol : "Th"},
    {Z :91, name: "Protactinium", symbol : "Pa"},
    {Z :92, name: "Uranium", symbol : "U"},
    {Z :93, name: "Neptunium", symbol : "Np"},
    {Z :94, name: "Plutonium", symbol : "Pu"},
    {Z :95, name: "Américium", symbol : "Am"},
    {Z :96, name: "Curium", symbol : "Cm"},
    {Z :97, name: "Berkélium", symbol : "Bk"},
    {Z :98, name: "Californium", symbol : "Cf"},
    {Z :99, name: "Einsteinium", symbol : "Es"},
    {Z :100, name: "Fermium", symbol : "Fm"},
    {Z :101, name: "Mendélévium", symbol : "Md"},
    {Z :102, name: "Nobélium", symbol : "No"},
    {Z :103, name: "Lawrencium", symbol : "Lr"},
    {Z :104, name: "Rutherfordium", symbol : "Rf"},
    {Z :105, name: "Dubnium", symbol : "Db"},
    {Z :106, name: "Seaborgium", symbol : "Sg"},
    {Z :107, name: "Bohrium", symbol : "Bh"},
    {Z :108, name: "Hassium", symbol : "Hs"},
    {Z :109, name: "Meitnérium", symbol : "Mt"},
    {Z :110, name: "Darmstadtium", symbol : "Ds"},
    {Z :111, name: "Roentgenium", symbol : "Rg"},
    {Z :112, name: "Copernicium", symbol : "Cn"},
    {Z :113, name: "Nihonium", symbol : "Nh"},
    {Z :114, name: "Flérovium", symbol : "Fl"},
    {Z :115, name: "Moscovium", symbol : "Mc"},
    {Z :116, name: "Livermorium", symbol : "Lv"},
    {Z :117, name: "Tennesse", symbol : "Ts"},
    {Z :118, name: "Oganesson", symbol : "Og"},
]

const couchesList = [ //Liste des couches électroniques dans l'odre de remplissage
    "1s","2s","2p","3s","3p","4s","3d","4p","5s","4d","5p","6s","4f","5d","6p","7s","5f","6d","7p"
]

String.prototype.toSearch = function(){  //Retire les majuscules et accents d'un string
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
}

let gazNobles = [2, 10, 18, 36, 54, 86, 118]

//Class Atome
class atom {
    //Couches électroniques
    getCouches() {
        const limit = {
            s : 2,
            p : 6,
            d : 10,
            f : 14,
            g : 18,
        }
        
        let remaining = this.Z //Nombre d'e- à répartir
        let couches = {} //Initialize la variable couches

        let i = 0 //Initialize la variable couches
        while (remaining > 0){ //tant qu'il y a des e- a répartir
            let couche = couchesList[i] //Définit la couche sur laqulle on va répartir les e-

            const limiteSousCouche = limit[couche[1]] //limite sous couche  ex : 2 (pour s), 6 (pour d)...

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
            this.Z = Z //Set numéro atomique
            this.symbol = elements[Z-1].symbol //Set symbole
            this.name = elements[Z-1].name //Set nom de l'atome

            this.couches = this.getCouches() //Récupère les couches électroniques de l'atome

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
                lastGazNoble = new atom (this.lastGazNoble) //Récupère le dernier gaz noble avant l'élement choisi
                str += "[" + lastGazNoble.symbol + "] "  //L'ajoute au texte
            }
        }

        for(let couche of couchesList){ //Pour chaque couche
            if(this.couches[couche] >= 1){ //Si un électron ou + est présent dans la couche 
                if(!shortened || (lastGazNoble.couches && this.couches[couche] != lastGazNoble.couches[couche])){ 
                    str += "(" + couche + "<sup>" + this.couches[couche] + "</sup>)" //Si on ne doit pas raccourcir le texte ou que le la couche est présente dans le dernier gaz noble ajouter la couhe au texte
                }
            }else{ //Si il n'y pas d'électrons dans la couche
                break //Stopper le script
            }
        }

        return str //Renvoie le texte
    }

    cell(){ //Renvoie une cellule de tableau contenant le symbole et le numéro atomique de l'atome
        return '<div class="atom-cell">' + this.Z + '<br><span style="font-size: 1.4em; font-weight: bold;">' + this.symbol + "</span></div>"
    }
}
