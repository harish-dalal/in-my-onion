import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import Quest from '../Quest/Quest'
import Addquest from '../addQuestion/Addquest'
import FollowAndFeed from '../comingSoon/FollowAndFeed'
import Ghost from '../ghostscreen/GhostScreen'
import MyQuestHome from '../myQuestHome/MyQuestHome'
import './home.css'

class Home extends Component{
    constructor (){
        super()
        this.state = {
            quest : [],
            isSignedIn : false,
            user : {},
            bookmarks : {},
            getmoredata : false,
            lastdoc : '',
            loadingUiBottom : false,
            showMyQuestHome : false,
        }
        this.bottomOfPage = this.bottomOfPage.bind(this)
    }

    bottomOfPage(){
        if ((window.innerHeight + window.scrollY + 100) >= document.body.offsetHeight && this.state.getmoredata && typeof this.state.lastdoc !== 'undefined') {
            this.setState({getmoredata : false , loadingUiBottom : true})
            this.getQuest(true)
        }
        if(typeof this.state.lastdoc === 'undefined') this.setState({loadingUiBottom : false})
    }

    getQuest(scroll){
        let data;
        let ref;
        if(scroll) ref = this.context.db.collection('Quest').startAfter(this.state.lastdoc).limit(5)
        else ref = this.context.db.collection('Quest').limit(5)
        ref.get()
        .then(snap =>{
            data = snap.docs.map(doc => {
                return(
                        {...doc.data() , ...{questId : doc.id}}
                )
            });
            data = this.shuffle(data)
            // this.lastdoc = snap.docs[snap.docs.len]
            this.setState((prevState) => ({quest : prevState.quest.concat(data) , getmoredata : true , lastdoc : snap.docs[snap.docs.length - 1]}))
            if(this.state.quest.length === 0){ 
                console.log('need to refresh')
                alert('reload internet error')
                window.location.reload()
            }
            
        })
        .catch(error=> console.log('error in retriveing data from database ' + error))
    }

    
    gettingBookmarksUser(user){
        if(user === null) return
        this.unsubscribe = this.context.db.collection('Users_pvt_data').doc(user).collection('Quest_bookmark').doc(`bookmark_${user}`)
        .onSnapshot(snap=>{
            let data = snap.data();
            if(typeof data !== 'undefined') this.setState({bookmarks : data.quest})
        })
    }
    
    componentDidMount(){
        window.addEventListener('scroll' , this.bottomOfPage)
        this.unsubscribeAuthChange = this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
                this.gettingBookmarksUser(usr.uid);
            }
                else {
                    this.setState({isSignedIn : false , user : usr});
                }
        })
        this.getQuest(false);
        
    }

    componentWillUnmount(){
        if(this.state.isSignedIn) this.unsubscribe()
        this.unsubscribeAuthChange()
        window.removeEventListener('scroll' , this.bottomOfPage)
    }

     
    shuffle(array){
        let m = array.length, t, i
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        
        return array;
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
                            <Quest data = {qu} key = {qu.questId} signed = {this.state.isSignedIn} bookmarked = {this.state.bookmarks.hasOwnProperty(qu.questId)} funcForBookMarkTab = {()=>console.log(qu.questId)} deleteMyQuest = {false}/>
                        )
                    } )}
                    <div style = {{color:'#929292' , marginTop : '5px'}}>
                        {this.state.loadingUiBottom ?
                            <div>Loading...</div>:
                            <div>That's it add questions to fill the database</div>    
                        }
                    </div>
                </div>:
                <div className = "Home">
                    <Ghost/>
                </div>
                }
                <div className = 'add-question-section'>
                    <Addquest/>
                    <div className = 'show-myquest-toggle' onClick = {()=>this.setState((prevState) => ({showMyQuestHome : !prevState.showMyQuestHome}))}>My questions</div>
                    {this.state.showMyQuestHome ? <MyQuestHome className = 'Myquesthome'/> : null}
                </div>
            </div>

        
    )
    }
    
    

}

Home.contextType = FirebaseContext


export default Home;