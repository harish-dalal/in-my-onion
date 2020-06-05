import React , {Component} from 'react'
import { FirebaseContext } from '../../API/firebase'
import AddComment from '../AddComment'
import Comnt from './Comnt'

class Comments extends Component{
    constructor(props){
        super(props) 
        //props => questId
        this.state = {
            comments : []
        }
    }

    componentDidMount(){
        //fetch comments from server
        const ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments')

        this.unsubscribe = ref.onSnapshot(snap=>{
            console.log(snap)
            const data = snap.docs.map(doc=>{
                return({...doc.data() , ...{commentId : doc.id}})
            })
            this.setState(prevState=>({comments : data}))
        })
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        return(
            <div>
                <div>
                    {
                        this.state.comments.map(comment=>{
                            return (<Comnt data = {comment} key={comment.commentId} questId = {this.props.questId}/>)
                        })
                    }
                </div>
            </div>
        )
    }
}

Comments.contextType = FirebaseContext

export default Comments