import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import {Link} from 'react-router-dom'
import Quest from '../Quest/Quest'
import Signup from '../../pages/signup'
import Ghost from '../ghostscreen/GhostScreen'
import '../Home/home.css'

class MyQuestHome extends Component{
    constructor (){
        super()
        this.state = {
            quest : [],
            isSignedIn : false,
            user : {},
            bookmarks : {},
            myquest : {},
            dataReceived : false,
        }
        this.removeQuestFromBookmark = this.removeQuestFromBookmark.bind(this)
    }

    getQuest(Myquestdata){
        let data = [];
        Myquestdata = Object.keys(Myquestdata)
        if(Myquestdata.length === 0) this.setState({dataReceived : true})
        else Myquestdata.forEach(key=>{
            this.context.db.collection('Quest').doc(key).get()
            .then(snap =>{
                data = data.concat({...snap.data() , ...{questId : snap.id}})
                this.setState({quest : data , dataReceived : true})
                if(this.state.quest.length === 0){ 
                    console.log('need to refresh')
                    // window.location.reload()
                }
            })
            .catch(error=> console.log('error in retriveing data from database ' + error))  
        })
    }

    gettingBookmarksUser(user){
        if(user === null) return
        this.unsubscribe = this.context.db.collection('Users_pvt_data').doc(user).collection('Quest_bookmark').doc(`bookmark_${user}`)
        .onSnapshot(snap=>{
            let data = snap.data();
            if(typeof data !== 'undefined') this.setState({bookmarks : data.quest})
        })
    }
    
    
    gettingMyQuest(user){
        if(user === null) return
        this.unsubscribe = this.context.db.collection('Users_pvt_data').doc(user).collection('Quest').doc(`Quest_${user}`)
        .get().then(snap=>{
            let data = snap.data();
            if(typeof data !== 'undefined'){
                this.setState({Myquest : data.quest})
                this.getQuest(data.quest)
            }
            else this.setState({dataReceived : true})
        })
    }


    componentDidMount(){
        this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
                this.gettingMyQuest(usr.uid)
                this.gettingBookmarksUser(usr.uid);
            }
                else {
                    this.setState({isSignedIn : false , user : usr});
                    // this.unsubscribe()
                }
        })
        
    }

    componentWillUnmount(){
        if(this.state.isSignedIn){
            this.unsubscribe();
        }
    }

    removeQuestFromBookmark = questid => {
        const updatedQuest = this.state.quest.filter(qu => qu.questId !== questid);
        this.setState({ quest : updatedQuest });
    };

    render(){
        if(!this.state.isSignedIn) return(
            <Signup/>
        )
        let len = this.state.quest.length
        if(len === 0 && this.state.dataReceived) return (
            <div>
                <div style = {{color : 'grey'}}>No Quest added</div>
                <Link to='./AskQuest'>Ask Quest</Link>
            </div>
        )
        return(
            <div className = "home-box">
                {/* <div className='feed-home'>
                    <FollowAndFeed/>
                </div> */}
                {
                len>0?
                <div className = "Home">
                    {this.state.quest.map(qu =>{
                        return(
                            <Quest data = {qu} key = {qu.questId} signed = {this.state.isSignedIn} bookmarked = {this.state.bookmarks.hasOwnProperty(qu.questId)}  funcForBookMarkTab = {()=>console.log()} deleteMyQuest = {true} reloadFunc = {()=>{console.log('removed'); this.removeQuestFromBookmark(qu.questId);}}/>
                        )
                    } )}
                </div>:
                <div className = "Home">
                    <Ghost/>
                </div>
                }
                {/* <div className = 'add-question-section'>
                <Addquest/>
                </div> */}
            </div>

        
    )
    }
    
    

}

MyQuestHome.contextType = FirebaseContext


export default MyQuestHome;