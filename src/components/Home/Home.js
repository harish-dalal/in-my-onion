import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import Quest from '../Quest/Quest'
import './home.css'

class Home extends Component{
    constructor (){
        super()
        this.state = {
            quest : [],
            isSignedIn : false,
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
            this.setState((prevState) => ({quest : prevState.quest.concat(data)}))
            if(this.state.quest.length === 0){ 
                console.log('need to refresh')
                // window.location.reload()
            }
        })
        .catch(error=> console.log('error in retriveing data from database ' + error))
    }

   

    componentDidMount(){
        this.context.auth.onAuthStateChanged(user=>{
            if(user!=null) this.setState({isSignedIn :  true});
            else this.setState({isSignedIn : false});
        })
        this.getQuest();
        
    }

    render(){
        let len = this.state.quest.length
        return(
            <div className = "home-box">
                {
                len>0?
                <div className = "Home">
                    {this.state.quest.map(qu =>{
                        return(
                            <Quest data = {qu} key = {qu.questId} signed = {this.state.isSignedIn}/>
                        )
                    } )}
                </div>:
                <div className = "Home">
                    Loading... Loading ui 
                </div>
                }
            </div>

        
    )
    }
    
    

}

Home.contextType = FirebaseContext


export default Home;