import { Route, Routes } from 'react-router-dom';
import SearchAtom from './Search';
import TableauPeriodique from './Table';
import './style.css'
import ViewAtom from './View';
import { useState } from 'react';

function Atom() {
    const [selectedAtomZ, setSelectedAtomZ] : [number | null, React.Dispatch<number>] = useState(null)

    return ( <>
        <Routes>
            <Route
                path='/view'
                element={<ViewAtom/>}
            ></Route>
            
            <Route
                path='/'
                element={<>
                    <SearchAtom setSelectedAtomZ={setSelectedAtomZ}></SearchAtom>
                    <TableauPeriodique selectedAtomZ={selectedAtomZ}></TableauPeriodique>
                </>}
            ></Route>
        </Routes>
    </> );
}

export default Atom;