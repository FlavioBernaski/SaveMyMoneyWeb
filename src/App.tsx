import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import {RequireAuth} from "./contexts/Auth/RequireAuth";


function App() {
    return (
        <Routes>
            <Route path={"/"} element={<RequireAuth><Dashboard/></RequireAuth>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/cadastro"} element={<Cadastro/>}/>
        </Routes>
    );
}

export default App;