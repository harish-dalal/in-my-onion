import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import Quest from '../Quest/Quest'
import Addquest from '../addQuestion/Addquest'
import FollowAndFeed from '../comingSoon/FollowAndFeed'
import Ghost from '../ghostscreen/GhostScreen'
import './home.css'

class Home extends Component{
    constructor (){
        super()
        this.state = {
            quest : [],
            isSignedIn : false,
            user : {},
            bookmarks : {},
        }
    }

    getQuest(){
        let data;
        this.context.db.collection('Quest').get()
        .then(snap =>{
            data = snap.docs.map(doc => {
                return(
                        {...doc.data() , ...{questId : doc.id}}
                )
            });
            data = this.shuffle(data)
            this.setState((prevState) => ({quest : prevState.quest.concat(data)}))
            if(this.state.quest.length === 0){ 
                console.log('need to refresh')
                window.location.reload()
            }
        })
        .catch(error=> console.log('error in retriveing data from database ' + error))
    }


    componentDidMount(){
        this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
                this.gettingBookmarksUser(usr.uid);
            }
                else this.setState({isSignedIn : false , user : usr});
        })
        this.getQuest();
        
    }

     
    shuffle(array){
        let m = array.length, t, i;
        
        // While there remain elements to shuffle…
        while (m) {
        
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
        
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        
        return array;
    }

    gettingBookmarksUser(user){
        if(user === null) return
        let ref = this.context.db.collection('Users_pvt_data').doc(user).collection('Quest_bookmark').doc(`bookmark_${user}`)
        .onSnapshot(snap=>{
            let data = snap.data();
            this.setState({bookmarks : data.quest})
        })
    }

    render(){
        let len = this.state.quest.length
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
                            <Quest data = {qu} key = {qu.questId} signed = {this.state.isSignedIn} bookmarked = {this.state.bookmarks.hasOwnProperty(qu.questId)}/>
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

Home.contextType = FirebaseContext


export default Home;