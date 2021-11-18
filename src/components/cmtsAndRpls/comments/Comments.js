import React , {Component} from 'react'
import { FirebaseContext } from '../../API/firebase'
import Comnt from './Comnt'

class Comments extends Component{
    constructor(props){
        super(props) 
        //props => questId
        this.state = {
            comments : [],
            userComments : [],
            isSignedIn : false,
            user : {},
            loadingDiv : true,
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
                    data.push({...doc.data() , ...{commentId : doc.id}})
                }
            })
            // console.log(data)
            this.setState(prevState=>({...{comments : data} , ...{userComments : userdata} , ...{loadingDiv : false}}))
        })

        this.unsubscribeAuthChange = this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
            }
            else {
                this.setState({isSignedIn : false , user : usr});
            }
        })
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        return(
            this.state.loadingDiv ?
            <div style={{width : '100%' , textAlign : 'center'}}>Loading...</div>
            :<div>
                <div>
                    {
                        this.state.userComments.map(comment=>{
                            return (<Comnt data = {comment} key={comment.commentId} questId = {this.props.questId} signed = {this.state.isSignedIn}/>)
                        })
                    }
                </div>
                <div>
                    {
                        this.state.comments.map(comment=>{
                            return (<Comnt data = {comment} key={comment.commentId} questId = {this.props.questId} signed = {this.state.isSignedIn}/>)
                        })
                    }
                </div>
            </div>
        )
    }
}

Comments.contextType = FirebaseContext

export default Comments