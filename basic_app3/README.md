## React JS를 이용한 app만들기3##  
reactJS를 이용한 TodoList만들기  
  json파일을 api를 통해 가져오기  
  fetch를 사용하기 위해 react-addons-update설치  
  React는 하위 컴포넌트에서 데이터 조작하는 것을 싫어라 함.  
  그리하여 최상위 컴포넌트는 상태를 관리를 위한 핸들러를 하위 컴포넌트에 전달.  
  중첩된 컴포넌트에 참조전달의 삽질을 막으려면 **store와 action** 을 사용하면 됨.  
  
```javascript
 npm install --save react-addons-update;
```

``` javascript
// 데이터 주소 선언
const API_URL = "http://kanbanapi.pro-react.com";
const API_HEDER = {
    "Content-Type": "application/json",
    "Authorization" : "CHANGETHISVALUE"
}

class BoardContainer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            cards:[]
        }
    }
    addTask( cardId, taskName ) {...}
    deleteTask( cardId, taskId, taskIndex ){...}
    toggleTask( cardId, taskId, taskIndex ){...}

    // fetch를 이용한 promise적용
    componentDidMount(){
        fetch( API_URL +"/cards", {headers:API_HEDER})
        .then((response) => response.json() )
        .then((responseData) => {
            console.log( responseData  )
            this.setState({cards:responseData});
        })
        .catch( (error) =>{
            console.log( error );
        });
    }

    // 하위 컴포넌트의 이벤트를 가져오기 위해 taskCallbacks를 전달
    render(){
        return(
            <Board cards={this.state.cards} taskCallbacks={
                {
                    toggle:this.toggleTask.bind(this),
                    delete:this.deleteTask.bind(this),
                    add:this.addTask.bind(this)
                }
            } />
        );
    }

}

// Board객체는 List생성 시 전달된 taskCallbacks를 다시 전달
class Board extends Component {
    render(){
        let cards;
        return(
            <div className="app">
                <List id="todo" title="To do" taskCallbacks={this.props.taskCallbacks} ...} />
                <List id="in-progress" title="In Progress" taskCallbacks={this.props.taskCallbacks} ...} />
                <List id="done" title="Done" taskCallbacks={this.props.taskCallbacks} ... } />
            </div>
        );
    }
}

```
