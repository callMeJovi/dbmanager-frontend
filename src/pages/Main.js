import React from "react";
import { Outlet } from 'react-router-dom'
import Slider from "../layout/Slider";
import Header from "../layout/Header";

class Main extends React.Component {
    constructor(props){
        super(props)
        this.state={menus:[]}
    }
    onRequestMenus=()=>{
        global.service.get('/api/main/menuList').then(data=>{
            this.setState({menus:data.records})
        })
    }
    componentDidMount(){
       this.onRequestMenus()
        window.addEventListener('refreshMenus',()=>{
            this.onRequestMenus()
        })
    }
    render() {
        return <div className="app">
            <div className="m-slide">
                <Slider menus={this.state.menus}/>
            </div>
            <div className="m-content">
                <Header />
                {/* 动态页面 */}
                <Outlet />
            </div>
        </div>
    }
}

export default Main