import { Link, Route, Routes } from "react-router-dom";
import TableauAvancement from "./TableauAvancement";

export default function ReactionsChimique({}) {
    return (<>
        <Routes>
            <Route path="/" element={
                <>
                <Link className="cyan" to={"tableau-avancement"}>Tableau d'avancement</Link>
                </>
            }/>
            <Route path="tableau-avancement" element={<TableauAvancement/>}></Route>
        </Routes>
    </>);
}