import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import {Link} from 'react-router-dom'
import Quest from '../Quest/Quest'
import Addquest from '../addQuestion/Addquest'
import FollowAndFeed from '../comingSoon/FollowAndFeed'
import Signup from '../../pages/signup'
import Ghost from '../ghostscreen/GhostScreen'
import '../Home/home.css'

class BookmarkHome extends Component{
    constructor (){
        super()
        this.state = {
            quest : [],
            isSignedIn : false,
            user : {},
            bookmarks : {},
        }
        this.removeQuestFromBookmark = this.removeQuestFromBookmark.bind(this)
    }

    getQuest(bookmarkData){
        let data = [];
        Object.keys(bookmarkData).forEach(key=>{
            console.log(key)
            this.context.db.collection('Quest').doc(key).get()
            .then(snap =>{
                if(typeof snap.data() === 'undefined') return
                // console.log(snap.data())
                data = data.concat({...snap.data() , ...{questId : snap.id}})
                this.setState({quest : data})
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
        this.context.db.collection('Users_pvt_data').doc(user).collection('Quest_bookmark').doc(`bookmark_${user}`)
        .get().then(snap=>{
            let data = snap.data();
            console.log(data)
            if(typeof data !== 'undefined'){
                this.setState({bookmarks : data.quest})
                this.getQuest(data.quest)
            }
        })
    }


    componentDidMount(){
        this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
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
            // this.unsubscribe();
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
        if(this.state.quest.every(e=>{
            return typeof e === 'undefined'
        })){
            return(
                <div>
                    <div>No Saved</div>
                    <Link to='./'>Return Home</Link>
                </div>
            )
        }
        return(
        <div className = "home-box">
            <div className='feed-home'>
                <FollowAndFeed/>
            </div>
            {
            len>0?
            <div className = "Home">
                {this.state.quest.map(qu =>{
                    return(
                        <Quest data = {qu} key = {qu.questId} signed = {this.state.isSignedIn} bookmarked = {this.state.bookmarks.hasOwnProperty(qu.questId)}  funcForBookMarkTab = {()=>this.removeQuestFromBookmark(qu.questId)} deleteMyQuest = {false}/>
                    )
                } )}
            </div>:
            <div className = "Home">
                <Ghost/>
            </div>
            }
            <div className = 'add-question-section'>
            <Addquest/>
            </div>
        </div>
        )
    }
    
    

}

BookmarkHome.contextType = FirebaseContext


export default BookmarkHome;