//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import marked from "marked";

let cardList = [
    {
        id:1,
        title:"Read the Book",
        description:"I should read the whole book",
        color:"#bd8d31",
        status:"in-progress",
        tasks:[]
    },
    {
        id:2,
        title:"Write some code",
        description:"Code along with the sample in the book.Them complete source can be found at [github](https://github.com/pro-react)",
        status:"todo",
        color:"#3a7e28",
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
        let cards;
        return(
            <div className="app">
                <List id="todo" title="To do" cards={this.props.cards.filter((card) => card.status === "todo" )} />
                <List id="in-progress" title="In Progress" cards={this.props.cards.filter((card) => card.status === "in-progress" )} />
                <List id="done" title="Done" cards={this.props.cards.filter((card) => card.status === "done" )} />
            </div>
        );
    }
}

// Board에 cards속성 선언
Board.propTypes = {
    cards : PropTypes.arrayOf( PropTypes.object )
};

// 리스트 컨테이너 역할 - Card를 ItemRenderer로 사용
class List extends Component {

    render(){
        let cards = this.props.cards.map((card) => {
            return <Card key ={card.id}
                         id = {card.id}
                         title = {card.title}
                         description = {card.description}
                         color = {card.color}
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

List.propTypes ={
    title:PropTypes.string.isRequired,
    cards:PropTypes.arrayOf(PropTypes.object)
}


class Card extends Component {

    constructor(){
        super(...arguments);
        this.state = {showDetails : false};

    }

    toggleDetails(){
        this.setState({showDetails:!this.state.showDetails});
    }

    render(){
        // toggle상태를 위한 변수 선언
        let cardDetails;
        let sideColor = {
            position:"absolute",
            zIndex:-1,
            top:0,
            left:0,
            bottom:0,
            width:7,
            backgroundColor:this.props.color
        }
        if( this.state.showDetails ){
            // react는 기본적으로 html태그 랜더링을 금지하여 dangerouslySetInnerHTML 이용해 우회
            cardDetails = (
                <div className="card-details">
                    <span dangerouslySetInnerHTML ={{__html:marked(this.props.description)}} />
                    <CheckList  cardId={this.props.id} tasks={this.props.tasks} />
                </div>
            );
        }
        /* onclick이벤트 시 bind를 통한 함수 연결 */
        return(
                <div className="card">
                    <div style={sideColor}></div>
                    <div className={this.state.showDetails ? "card-title card-title-is-open" : "card-title" } onClick={ this.toggleDetails.bind(this) }>{this.props.title}</div>
                    {cardDetails}
                </div>
        );0

    }
}

Card.propTypes ={
    id : PropTypes.number,
    title:PropTypes.string,
    description:PropTypes.string,
    color:PropTypes.string,
    tasks:PropTypes.arrayOf(PropTypes.object)
}

// checkbox 클래스
class CheckList extends Component {

    render(){
        let tasks = this.props.tasks.map( (task) => (
            <li key={task.id} className="checklist-task">
                <input type="checkbox" defaultChecked={task.done} />
                {task.name}{' '}
                <a href="#" className="checklist-task-remove" />
            </li>
        ));

        return(
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text" className="checklist-add-task" placeholder="type then hit enter to add a task"/>
            </div>
        );
    }

}

CheckList.propsTypes = {
    cardId : PropTypes.number,
    tasks : PropTypes.arrayOf(PropTypes.object)

}


ReactDOM.render( <Board cards={cardList}/>, document.getElementById("root") );
