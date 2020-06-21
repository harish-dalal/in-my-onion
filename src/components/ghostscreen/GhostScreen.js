import React  from 'react'
import './ghostscreen.css'

const display=()=>{
    return(
        <div className = 'ghost-box'>
            <div style = {{display : 'flex' , flexDirection : 'row'}}>
                <div className = 'ghost-profile'/>
                <div className = 'ghost-profile-txt'>
                    <div className = 'ghost-name'/>
                    <div className = 'ghost-date'/>
                </div>
            </div>
            <div className = 'ghost-title'/>
            <div>
                <div className = 'ghost-option'/>
                <div className = 'ghost-option'/>
                <div className = 'ghost-option'/>
                <div className = 'ghost-option'/>
            </div>
            <div style ={{display : 'flex' , flexDirection : 'row' , marginTop : '20px' , marginBottom : '10px'}}>
                <div className = 'ghost-show-comment'/>
                <div className = 'ghost-add-comment'/>
            </div>
        </div>
    )
}

const Ghost = () =>{
    return(
        <div>
            {
                display()
            }
            {
                display()
            }
        </div>
    )
}

export default Ghost