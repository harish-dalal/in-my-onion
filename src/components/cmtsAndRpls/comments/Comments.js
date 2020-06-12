import React , {Component} from 'react'
import { FirebaseContext } from '../../API/firebase'
import AddComment from '../AddComment'
import Comnt from './Comnt'

class Comments extends Component{
    constructor(props){
        super(props) 
        //props => questId
        this.state = {
            comments : [],
            userComments : [],
        }
    }

    componentDidMount(){
        //fetch comments from server
        const ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments')

        this.unsubscribe = ref.onSnapshot(snap=>{
            // console.log(snap)
            let data = []
            let userdata = []
            snap.docs.forEach(doc=>{
                
                if(this.context.auth.currentUser && doc.data().user.userId === this.context.auth.currentUser.uid){

                    userdata.push({...doc.data() , ...{commentId : doc.id}})
                }
                else {
                    console.log('non-user')
                    data.push({...doc.data() , ...{commentId : doc.id}})
                }
            })
            // console.log(data)
            this.setState(prevState=>({...{comments : data} , ...{userComments : userdata}}))
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
                        this.state.userComments.map(comment=>{
                            return (<Comnt data = {comment} key={comment.commentId} questId = {this.props.questId} />)
                        })
                    }
                </div>
                <div>
                    {
                        this.state.comments.map(comment=>{
                            return (<Comnt data = {comment} key={comment.commentId} questId = {this.props.questId} />)
                        })
                    }
                </div>
            </div>
        )
    }
}

Comments.contextType = FirebaseContext

export default Comments