import React from 'react'
import './onion.css'

const Onion = (props)=>{
    let wid = "0%";
    let grad;
    if(props.allAns.answers.length > 0){
        let temp = (props.allAns.answers[props.ind])/(props.allAns.totalAnswers)
        temp*=100;
        wid = (String(temp) + "%");
        // let temp2 = (props.ans.female[props.ind])/(p)
    }

    return(
        <div className = "onion-box" style = {props.ind === props.ans ? {borderColor : '#8a0707', borderWidth : '2px'} : {borderColor : 'rgb(82, 81, 81)'}} onClick = {()=>props.setOnion(props.ind)}>
            <div className = 'color-box' style = {{width : wid}}></div>
            <p className = 'noselect'>{props.onion}</p>
        </div>
    )
}

export default Onion