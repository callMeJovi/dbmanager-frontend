/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from "./pages/Main";
import imgUrl from './assets/imgs/welcome.gif'
import MenuPage from "./pages/Setting/Menu";
import UserPage from "./pages/Setting/User";
import LoginPage from "./pages/Login";
import ProductPage from "./pages/Business/Product";
import OverViewPage from "./pages/Business/OverView";

export default (
    <Router>
        <Routes>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/' element={<Main />}>
                <Route index element={<img  src={imgUrl} style={{ width: '100%' }} />} />
                <Route path='/setting/menu' element={<MenuPage/>} />
                <Route path='/setting/user' element={<UserPage/>} />
                <Route path='/business/product' element={<ProductPage/>} />
                <Route path='/business/overview' element={<OverViewPage/>} />
            </Route>
        </Routes>

    </Router>
)