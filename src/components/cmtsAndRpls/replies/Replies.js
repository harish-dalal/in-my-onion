import React , {Component} from 'react'
import { FirebaseContext } from '../../API/firebase'
import Reply from './Reply'
import './replies.css'

class Replies extends Component{
    constructor(props){
        super(props)
        // props => questId , commentId
        this.state = {
            replies : [],
        }
    }

    componentDidMount(){
        //fetch comments from server
        const ref = this.context.db.collection('Quest').doc(this.props.questId)
        .collection('Comments').doc(this.props.commentId)
        .collection('Replies')

        this.unsubscribe = ref.onSnapshot(snap=>{
            console.log(snap)
            const data = snap.docs.map(doc=>{
                return({...doc.data() , ...{replyId : doc.id}})
            })
            this.setState(prevState=>({replies : data}))
        })
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        return(
            <div>
                <div className = 'single-reply-box'>
                    {
                        this.state.replies.map(reply=>{
                            return (<Reply data = {reply} key={reply.replyId} questId = {this.props.questId} commentId = {this.props.commentId}/>)
                        })
                    }
                </div>
            </div>
        )
    }

}

Replies.contextType = FirebaseContext
export default Replies