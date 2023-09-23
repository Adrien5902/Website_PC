import { useState } from 'react';
import * as React from 'react';
import { atomes } from '../funct';
import AtomSearchResult from './result';

function SearchAtom({setSelectedAtomZ}) {
    const [search, setSearch] = useState("")
    const stringtoSearch = (s :string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    
    function handleInput(e : React.FormEvent<HTMLInputElement>){
        const input = (e.target as HTMLInputElement).value;
        setSearch(stringtoSearch(input))
    }

    return ( 
        <div id="search">
            <label htmlFor="search-input">Rechercher un atome : </label>
            <input 
                id="search-input" 
                style={{fontSize: "1em", width: "40vw"}} 
                type="text" 
                placeholder="par nom, par symbole ou par numéro atomique..."
                onInput={handleInput}
            />

            <div id="search-result">
                {
                    search ? 
                        atomes.filter(atome => {
                            const name = stringtoSearch(atome.name).includes(search),
                                symbol = stringtoSearch(atome.symbol) == search,
                                Z = atome.Z == Number(search)
                            return Z || name || symbol
                        })
                        .sort(atome => stringtoSearch(atome.symbol) == search ? -1 : 1)
                        .map((atome, i) => <AtomSearchResult setSelectedAtomZ={setSelectedAtomZ} key={i} atome={atome}/>).slice(0, 3)
                    : ""
                }
            </div>
        </div>
    );
}

export default SearchAtom;