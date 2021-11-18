import React from 'react'
import './profile.css'

const ProfilePic = (props) =>{
    return(
        <div className = "profile" style = {props.imageUrl!==null ? {backgroundImage : 'url('+props.imageUrl+')'} : {}}>
        </div>
    )
}

export default ProfilePic