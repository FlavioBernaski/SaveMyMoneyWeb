import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cadastro from "./pages/CadastroUsuario";
import {RequireAuth} from "./contexts/Auth/RequireAuth";
import Cartoes from "./pages/Cartoes";
import Contas from "./pages/Contas";


function App() {
    return (
        <Routes>
            <Route path={"/"} element={<RequireAuth><Dashboard/></RequireAuth>}/>
            <Route path={"/cartoes"} element={<RequireAuth><Cartoes/></RequireAuth>}/>
            <Route path={"/contas"} element={<RequireAuth><Contas/></RequireAuth>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/cadastro"} element={<Cadastro/>}/>
        </Routes>
    );
}

export default App;