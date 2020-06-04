import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import Profile from '../profilePic/ProfilePic'
import './comnt.css'

class Comnt extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount(){
        //fetch replies if asked
    }

    render(){
        const Date = this.props.data.timeStamp.toDate().toString().split(' ')
        console.log(this.props.data.timeStamp.toDate().toString().split(' '))
        return(
            <div className = 'comment-box'>
                <div className = 'profile-box-comment'>
                    <div style = {{height : '20px' , width : '20px'}}><Profile imageUrl = {this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'column'}}>
                        <p>{this.props.data.user.userName}</p>
                        <p className = 'date'><span style = {{fontWeight : 'bold'}}>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3]+' '}<span style = {{fontWeight : 'bold'}}>&#183;</span>{' '+Date[4].split(':')[0] + ':' + Date[4].split(':')[1] }</p>
                    </div>
                </div>
                <p>{this.props.data.comment}</p>
                <hr/>
            </div>
        )
    }
}

Comnt.contextType = FirebaseContext
export default Comnt; 