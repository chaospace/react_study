import React, { Component } from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute, Link, browserHistory } from "react-router";
import "whatwg-fetch";

class Home extends Component {
    render(){
        return(
            <h1>HOME</h1>
        );
    }
}

class About extends Component{
    render(){
        return(
            <h1>ABOUT</h1>
        );
    }
}


class Repos extends Component {
    constructor(){
        super(...arguments);
        this.state ={
            repositories:[]
        };
    }

    componentDidMount(){
        fetch("https://api.github.com/users/pro-react/repos")
        .then( (response) => response.json() )
        .then( (responseData) => {
            this.setState({repositories:responseData});
        });
    }

    render(){
        let repos = this.state.repositories.map( (repo) => (
            <li key={repo.id}><Link to={"/repos/details/"+repo.name}>{repo.name}</Link></li>
        ));
        return(
            <div>
                <h1>GitHub Repos</h1>
                <ul>
                    {repos}
                </ul>
                {this.props.children}
            </div>
        );
    }
}


class ReposDetails extends Component {
    constructor(){
        super(...arguments);
        this.state={
            repository:{}
        };
    }

    fetchData( repo_name ){
        fetch("https://api.github.com/repos/pro-react/"+repo_name)
        .then((response) => response.json())
        .then((responseData)=>{
            this.setState({repository:responseData});
        });
    }

    componentDidMount(){
        let repo_name = this.props.params.repo_name;
        this.fetchData( repo_name );
    }

    componentWillReceiveProps( nextProps ){
        let repo_name = nextProps.params.repo_name;
        this.fetchData( repo_name );
    }

    render(){
        let stars=[];
        for( var i=0; i<this.state.repository.stargazers_count; i++ ){
            stars.push('★');
        }
        return (
            <div>
                <h2>{this.state.repository.name}</h2>
                <p>{this.state.repository.description}</p>
                <span>{stars}</span>
            </div>
        )
    }

}

class App extends Component{
    render(){
        console.log("this.props.children", this.props.children );
        return(
            <div>
                <header>App</header>
                <menu>
                    <ul>
                        <li><Link to="about">About</Link></li>
                        <li><Link to="repos">Repos</Link></li>
                    </ul>
                </menu>
                {this.props.children}
            </div>
        );
    }
}



render( <Router history={browserHistory} >
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="about" component={About}/>
                <Route path="repos" component={Repos}>
                    <Route path="details/:repo_name" component={ReposDetails} />
                </Route>
            </Route>
        </Router>, document.getElementById('root'));
