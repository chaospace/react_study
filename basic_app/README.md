## React JS를 이용한 app만들기##  
reactJS를 이용한 TodoList만들기  
Board클래스부터 CheckList클래스까지의 구성을 보면 제대로 객체지향  
주의할 점은 jsx문법에서 **html요소에 class를 지정하려면 className** 으로 해야 함.  

```javascript
let cardList = [
    {
        id:1,
        title:"Read the Book",
        description:"I should read the whole book",
        status:"in-progress",
        tasks:[]
    },
    {
        id:2,
        title:"Write some code",
        description:"I should read the whole book",
        status:"todo",
        tasks:[
            {
                id:1,
                name:"ContactList Example",
                done:true
            },
            {
                id:2,
                name:"Kanban Example",
                done:false
            }
        ]
    }
];

class Board extends Component {
    render(){
        return(
            <div className="app">
                <List id="todo" title="To do" cards={this.props.cards.filter((card) => card.status === "todo" )} />
                <List id="in-progress" title="In Progress" cards={this.props.cards.filter((card) => card.status === "in-progress" )} />
                <List id="done" title="Done" cards={this.props.cards.filter((card) => card.status === "done" )} />
            </div>
        );
    }
}

// 리스트 컨테이너 역할 - Card를 ItemRenderer로 사용
class List extends Component {

    render(){
        let cards = this.props.cards.map((card) => {
            return <Card id = {card.id}
                         title = {card.title}
                         description = {card.description}
                         tasks = {card.tasks} />
        });
        return(
            <div className="list">
                <h1>{this.props.title}</h1>
                {cards}
            </div>
        );
    }

}


class Card extends Component {

    constructor(){
        super(...arguments);
        this.state = {showDetails : false};

    }

    render(){
        // toggle상태를 위한 변수 선언
        let cardDetails;
        if( this.state.showDetails ){
            cardDetails = (
                <div className="card-details">
                    {this.props.description}
                    <CheckList cardId={this.props.id} tasks={this.props.tasks} />
                </div>
            );
        }
        return(
                <div className="card">
                    <div className="card-title" onClick={() => this.setState({showDetails:!this.state.showDetails}) }>{this.props.title}</div>
                    {cardDetails}
                </div>
        );

    }
}

// checkbox 클래스
class CheckList extends Component {

    render(){
        let tasks = this.props.tasks.map( (task) => (
            <li className="checklist-task">
                <input type="checkbox" defaultChecked={task.done} />
                {task.name}
                <a href="#" className="checklist-task-remove" />
            </li>
        ));

        return(
            <div className="checklist">
                <ul>{tasks}</ul>
            </div>
        );
    }

}
```

index.html은 그냥 컨테이너용 div만 있음.

```html
<div id="root"></div>
<script type="text/javascript" src="./bundle.js"></script>
```
