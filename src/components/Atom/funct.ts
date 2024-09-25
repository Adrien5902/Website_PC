/////////////////////////////
//Fonctions liées au atomes//
/////////////////////////////

/*
TABLES
*/

import elements from "./elements.json";

export const couchesList = [
	//Liste des couches électroniques dans l'odre de remplissage
	"1s",
	"2s",
	"2p",
	"3s",
	"3p",
	"4s",
	"3d",
	"4p",
	"5s",
	"4d",
	"5p",
	"6s",
	"4f",
	"5d",
	"6p",
	"7s",
	"5f",
	"6d",
	"7p",
] as const;

//Liste des gaz nobles (numéros atomiques)
export const gazNobles = [2, 10, 18, 36, 54, 86, 118];

export const couchesLimit = {
	//Limites des sous couches
	s: 2,
	p: 6,
	d: 10,
	f: 14,
};

/**
 * TYPES
 */

export type Bloc = keyof typeof couchesLimit;
export type Couches = Partial<Record<(typeof couchesList)[number], number>>;

/*
SCRIPT
*/

export function isGazNoble(Z = 0) {
	//Renvoie true si l'atome est un gaz noble et false sinon
	if (gazNobles.indexOf(Z) === -1) {
		return false;
	}
	return true;
}

//Classe Atome
export class Atome {
	Z: number;
	symbol: string;
	name: string;
	M: number;
	electronegativite: number;
	période: number;
	bloc: Bloc;
	groupe: string;
	lastGazNoble?: Atome;
	couches: Couches;
	family: string;

	//Couches électroniques
	getCouches() {
		let remaining = this.Z; //Nombre d'e- à répartir
		const couches = {}; //Initialize la variable couches

		let i = 0; //Initialize la variable couches
		while (remaining > 0) {
			//tant qu'il y a des e- a répartir
			const couche = couchesList[i]; //Définit la couche sur laqulle on va répartir les e-

			const limiteSousCouche = couchesLimit[couche[1]]; //limite sous couche  ex : 2 (pour s), 6 (pour d)...

			couches[couche] = limiteSousCouche; //Sature la couche
			remaining -= limiteSousCouche; //soustrait le nombre d'e- à répartis au nombre d'e- à répartir

			if (remaining < 1) {
				//Si il n'y a plus d'e- à répartir
				couches[couche] += remaining; //Retire des e- dans la couche si la couche a été saturée alors qu'elle n'aurait pas du l'être
				break; //Stopper le script
			}

			i++; //Passe a la prochaine couche
		}

		return couches; //Renvoie les couches électroniques
	}

	//Constructeur Atom
	constructor(Z: number) {
		//Z = Numéro atomique
		if (Z < 1 || Z > 118) {
			//Si le numéro atomique n'est aucun de ceux des éléments
			throw "Atome inexistant"; //Renvoie une erreur dans la console
		}
		const i = Z - 1;
		this.Z = Z; //Set numéro atomique
		this.symbol = elements[i].symbol; //Set symbole
		this.name = elements[i].name; //Set nom de l'atome
		this.M = elements[i].M; //Set Masse molaire
		this.family = elements[i].family;
		this.electronegativite = elements[i].electronegativite;

		this.couches = this.getCouches(); //Récupère les couches électroniques de l'atome

		this.période = Number(
			Object.keys(this.couches).sort()[Object.keys(this.couches).length - 1][0],
		);
		this.groupe =
			this.couches[
			Object.keys(this.couches)[Object.keys(this.couches).length - 1]
			];
		this.bloc = Object.keys(this.couches)[
			Object.keys(this.couches).length - 1
		][1] as Bloc;

		const lastGazNobleIndex = [...gazNobles]
			.sort((a, b) => b - a)
			.find((gazNobleZ) => gazNobleZ < this.Z);
		this.lastGazNoble = lastGazNobleIndex ? new Atome(lastGazNobleIndex) : null;
	}

	valence() {
		//Calcule le nombre d'électron de valence
		let n = 0;
		for (const couche of Object.keys(this.couches)) {
			if (couche[0] === this.période.toString()) {
				n += this.couches[couche];
			}
		}
		return n;
	}

	getElectronsInCouche(period: number) {
		return Object.keys(this.couches)
			.filter((c) => c[0] === period.toString())
			.map((c) => this.couches[c])
			.reduce((a, b) => a + b, 0);
	}
}

export const atomes = elements.map((element) => new Atome(element.Z));


export function getColorByElectronegativite(e: number | null) {
	if (!e) {
		return "var(--gray)"
	}
	return `hsl(${-e * 230 / atomes[9 - 1].electronegativite - 140}, 100%, 50%)`;
}

export function colorByBloc(bloc: Bloc, period: number) {
	//Change la couleur de la cellule en fcnt de la période et du bloc de l'atome
	let rgb: string = null;
	let color: number;

	if (bloc === "s") {
		//Bloc S
		color = 255 - (period + 1) ** 1.3 * 16;
		rgb = `rgb(${color}, ${color}, 255)`;
	} else if (bloc === "p") {
		//Bloc P
		color = 255 - period ** 2.2 * 3;
		rgb = `rgb(${color}, 255, ${color})`;
	} else if (bloc === "d") {
		//Bloc D
		color = 255 - period ** 3 / 1.8;
		rgb = `rgb(255 , 255, ${color})`;
	} else if (bloc === "f") {
		//Bloc F
		color = 255 - period ** 2.9 + 100;
		rgb = `rgb(255, ${color}, ${color})`;
	}

	return rgb;
}
