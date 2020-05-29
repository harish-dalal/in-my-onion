import React , { Component } from 'react'
import { FirebaseContext } from '../API/firebase'
import Quest from '../Quest/Quest'
import './Home.css'

class Home extends Component{
    constructor (){
        super()
        this.state = {
            quest : [
                {
                    questId : 'sffsdnnal',
                    title : 'this is title 1',
                    options : {
                        op1 : 'op1',
                        op2 : 'op2',
                        op3 : 'op3',
                        op4 : 'op4'
                    },
                    upvotes : 23,
                    downvotes : 11,
                    isAnonymous : false,
                    userData : {
                        userid : "sdfsdfsdf",
                        username: "Harish Dalal"
                    },
                    shares : 23,
                },
                {
                    questId : 'kjskfjsdf',
                    title : 'this is title 2',
                    options : {
                        op1 : 'op1',
                        op2 : 'op2',
                        op3 : 'op3',
                        op4 : 'op4'
                    },
                    upvotes : 223,
                    downvotes : 11,
                    isAnonymous : true,
                    userData : {
                        userid : "sdfsdfsdf",
                        username: ""
                    },
                    shares : 233,
                }
            ]
        }
    }

    getQuest(){
        let data;
        this.context.db.collection('quest').get()
        .then(snap =>{
            data = snap.docs.map(doc => doc.data());
            this.setState({quest : data})
            console.log(this.state.quest)
        }).catch(error=>{
            console.log("error in loading the data ")
            console.log(error)
        })
    }

    componentDidMount(){
        // this.getQuest();
    }

    render(){
        if(this.state.quest.length>0){
            return(
                <div className = "Home">
                    {this.state.quest.map(qu => <Quest data = {qu} key = {qu.questId}/>)}
                </div>
            )
        }
        else{
            return(
                <div className = "Home">
                    Loading...
                </div>
            )
        }
    }


}

Home.contextType = FirebaseContext


export default Home;