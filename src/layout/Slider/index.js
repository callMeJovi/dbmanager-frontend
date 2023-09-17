import React from "react";
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { icons } from '../../components'
import _ from 'lodash'

class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menus: props.menus || []
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ menus: nextProps.menus })
    }
    onRenderMenu = (menus) => {
        return menus.map(menu => {
            if (menu.children && menu.children.length) {
                return <Menu.SubMenu key={menu.id} title={menu.name}
                    icon={React.createElement((_.find(icons, (item) => item.name == menu.icon) || {}).renderFn || 'span')}
                >{this.onRenderMenu(menu.children)}</Menu.SubMenu>
            }
            return <Menu.Item key={menu.id} icon={React.createElement((_.find(icons, (item) => item.name == menu.icon) || {}).renderFn || 'span')}>
               {menu.openType==1?<Link to={menu.linkUrl}>{menu.name}</Link>:
               <a onClick={()=>window.open(menu.linkUrl)}>{menu.name}</a>} 
            </Menu.Item>
        })

    }
    render() {
        return <Menu theme="dark" mode="inline">
            {this.onRenderMenu(this.state.menus)}
        </Menu>
    }
}

export default Slider