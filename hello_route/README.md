## React JS Route사용하기##  
Route 이용하기
    사용을 위한 플러그인 설치
```javascript
 npm install --save react-router;
```

Route를 적용하면 런더링 시 컴포넌트가 아니라 Router를 넘긴다.  
React를 사용하며 동적인 데이터를 어떻게 표현하면 좋을까 싶었는데  
Route를 이용하는게 답일 듯싶다.
```javascript
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
        // Repo메뉴는 상세내역을 보여주기 위해 Route가 보내주는 this.props.children을 이용
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

class App extends Component{
    render(){
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

// Router가 conpoment로 연결된 객체를 가져다가 매핑하여 뿌려주는 듯
// Router에 history를 설정하기 않으면 초기 값으로 못찾아 에러가 발생
render( <Router history={browserHistory} >
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="about" component={About}/>
                <Route path="repos" component={Repos}>
                    <Route path="details/:repo_name" component={ReposDetails} />
                </Route>
            </Route>
        </Router>, document.getElementById('root'));
```
