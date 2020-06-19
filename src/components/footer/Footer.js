import React , {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'
import './footer.css'

class Footer extends Component{
    constructor(){
        super()
        this.state = {
            displayFoot : true,
        }
        this.onScroll = this.onScroll.bind(this)
    }

    componentDidMount(){
        window.addEventListener('scroll' , this.onScroll);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll' , this.onScroll);
    }


    onScroll(){
        // console.log(e);
        let st = window.pageYOffset || document.documentElement.scrollTop; 
        if (st > this.lastScrollTop){
            if(this.state.displayFoot){
                this.setState({displayFoot : false})
            }
        } else {
            if(!this.state.displayFoot){
                this.setState({displayFoot : true})
            }
        }
        this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling //done on stackoflw
    }
    
    render(){
        console.log(this.state.pathname)
        return(
            <div className = 'footer-bar noselect' style = {this.state.displayFoot ? {} : {height : 0}}>
                <Link to = './' className = {'home-tab margin-tab' +( this.props.location.pathname === '/' ? ' active-tab' : '') }>Home</Link>
                <Link to = './AskQuest' className = 'my-quest-tab margin-tab'>My quest</Link>
                <Link to = './' className = 'liked-tab margin-tab'>Upvoted</Link>
                <Link to = './' className = 'saved-tab margin-tab'>Saved</Link>
            </div>
        )
    }
}

export default withRouter(Footer)