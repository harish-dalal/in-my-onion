import React , { Component } from 'react'
import Profile from '../../profilePic/ProfilePic'
import './reply.css'

class Comnt extends Component{
    constructor(props){
        super(props)
        // props => data(reply data) , questId , commentId , key(replyId) 
        this.state = {
            showReplies : false,
        }
    }


    componentDidMount(){
    }

    render(){
        const Date = this.props.data.timeStamp.toDate().toString().split(' ')
        console.log(this.props.data.timeStamp.toDate().toString().split(' '))
        return(
            <div className = 'reply-box'>
                <div className = 'profile-box-reply'>
                    <div style = {{height : '18px' , width : '18px'}}><Profile imageUrl = {this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'row'}}>
                        <p>{this.props.data.user.userName}</p>
                        <p className = 'date'><span style = {{fontWeight : 'bold'}}>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3]+' '}<span style = {{fontWeight : 'bold'}}>&#183;</span>{' '+Date[4].split(':')[0] + ':' + Date[4].split(':')[1] }</p>
                    </div>
                </div>
                <p>{this.props.data.reply}</p>
                <div className = 'up-down-reply'>
                    <svg width="18px" height="18px" viewBox="0 0 24 24"><g id="upvote" className="icon_svg-stroke icon_svg-fill" strokeWidth="1.5" stroke="#666" fill="none" fillRule="evenodd" strokeLinejoin="round"><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>23</p>
                    <svg width="18px" height="18px" viewBox="0 0 24 24"><g id="downvote" className="icon_svg-stroke icon_svg-fill" stroke="#666" fill="none" strokeWidth="1.5" fillRule="evenodd" strokeLinejoin="round"><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                </div>
                
                <hr/>
            </div>
        )
    }
}

export default Comnt; 