import React from 'react'
import './onion.css'

const Onion = (props)=>{
    let wid = "0%";
    let disPercent = 0;
    if(props.allAns.answers.length > 0){
        let temp = (props.allAns.answers[props.ind])/(props.allAns.totalAnswers)
        temp*=100;
        disPercent = Math.trunc(temp)
        wid = (String(temp) + "%");
        if(temp === NaN) temp = 0;
    }

    return(
        <div className = "onion-box" style = {props.ind === props.ans ? {borderColor : '#8a0707', borderWidth : '2px'} : {borderColor : 'rgb(82, 81, 81)'}} onClick = {()=>props.setOnion(props.ind)}>
            <div className = 'color-box' style = {wid === '100%' ? {borderTopRightRadius : '7px' , borderBottomRightRadius : '7px' , width : wid} : {width : wid}}></div>
            <p className = 'noselect'>{props.onion}</p>
            <p className = 'display-percent' style = {props.signed ? {} : {display : 'none'}}>{disPercent + '%'}</p>
        </div>
    )
}

export default Onion