import { Route, Routes } from "react-router-dom";
import TableauAvancement from "./TableauAvancement";
import Page from "../Page";

export default function ReactionsChimique({ }) {
    return (<>
        <Routes>
            <Route path="/" element={
                <div id="pages">
                    <Page href="/reactions/tableau-avancement" img="./assets/pages/tableau_avancement.png" text="Tableau d'Avancement"></Page>
                </div >
            } />
            <Route path="tableau-avancement" element={< TableauAvancement />} />
        </Routes >
    </>);
}