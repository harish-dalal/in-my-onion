import React from 'react'
import {withRouter} from 'react-router-dom'
import Home from '../Home/Home'

const QuestView = (props)=>{
    let url = props.location.pathname.replace('/Quest/','')
    return(
        <div>
            <Home URL = {url.toString().trim().length ? url : null}/>
        </div>
    )
}


export default withRouter(QuestView);