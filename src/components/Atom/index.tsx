import { Route, Routes } from 'react-router-dom';
import SearchAtom from './Search';
import TableauPeriodique from './Table';
import './style.css'
import ViewAtom from './View';
import { useState } from 'react';

function Atom() {
    const [selectedAtomZ, setSelectedAtomZ] = useState<number>(null)
    const [search, setSearch] = useState<string>("")

    return ( <>
        <Routes>
            <Route
                path='/view'
                element={<ViewAtom/>}
            ></Route>
            
            <Route
                path='/'
                element={<>
                    <SearchAtom search={search} setSearch={setSearch} setSelectedAtomZ={setSelectedAtomZ}></SearchAtom>
                    <TableauPeriodique selectedAtomZ={selectedAtomZ}></TableauPeriodique>
                </>}
            ></Route>
        </Routes>
    </> );
}

export default Atom;