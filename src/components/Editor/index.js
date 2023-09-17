import React from "react";
import E from 'wangeditor'

export default class extends React.Component{
    ref=React.createRef()
    componentDidMount(){
        const editor=new E(this.ref.current)
        editor.config.excludeMenus=['emoticon','video']
        editor.config.showLinkImg=false
        editor.config.onchange=(html)=>{
            this.props.onChange&&this.props.onChange(html)
        }
        editor.config.customUploadImg=function(resultFiles,insertImgFn){
            const form =new FormData()
            form.append('file',resultFiles[0])
            global.service.post('/api/upload',form).then(({file})=>{
                insertImgFn(file.url)
            })
        }
        editor.create()
        this.props.defaultValue&&editor.txt.html(this.props.defaultValue)
    }
    render(){
        return <div ref={this.ref}></div>
    }
}