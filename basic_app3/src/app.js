//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import marked from "marked";
import "whatwg-fetch";
import update from "react-addons-update";

//  데이터 가져올 주소
const API_URL = "http://kanbanapi.pro-react.com";
const API_HEDER = {
    "Content-Type": "application/json",
    "Authorization" : "ichaospace@nate.comalsefjp"
}

class BoardContainer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            cards:[]
        }
    }

    addTask( cardId, taskName ) {
        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex( (card) => card.id == cardId );
        let newTask = {id:Date.now(), name:taskName, done:false };
        let nextState = update( this.state.cards, {
            [cardIndex]:{
                tasks:{$push:[newTask]}
            }
        });

        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks`, {
            method:'post',
            header:API_HEDER,
            body:JSON.stringify(newTask)
        })
        .then( (response) => {
            if( response.ok ){
                 return response.json();
            } else {
                throw new Error( "respoinse-error" );
            }
        } )
        .then( (responseData) => {
            newTask.id = responseData.id;
            this.setState({cards:nextState});
        })
        .catch( (error) => {
            console.log( error );
            this.setState( prevState );
        });

    }

    deleteTask( cardId, taskId, taskIndex ){
        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex( (card) => card.id == cardId );
        let nextState = update( this.state.cards, {
            [cardIndex]:{
                tasks:{ $splice:[[taskIndex, 1]] }
            }
        })
        this.setState({cards:nextState});
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method:'delete',
            header:API_HEDER
        })
        .then( (response) => {
            if( !response.ok ){
                throw new Error("server-error");
            }
        })
        .catch( (error) =>{
            console.log( "delete-error", error );
            this.setState(prevState);
        } );
    }

    toggleTask( cardId, taskId, taskIndex ){
        let cardIndex = this.state.cards.findIndex( (card) => card.id == cardId );
        console.log( cardIndex );
        let newDoneValue;
        let nextState = update( this.state.cards, {
            [cardIndex]:{
                tasks:{
                    [taskIndex]:{
                        done:{$apply:(done)=>{
                            newDoneValue = !done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });
        this.setState({cards:nextState});

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
            method:'put',
            header:API_HEDER,
            body: JSON.stringify({done:newDoneValue})
        });
    }

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

class Board extends Component {
    render(){
        let cards;
        return(
            <div className="app">
                <List id="todo" title="To do" taskCallbacks={this.props.taskCallbacks} cards={this.props.cards.filter((card) => card.status === "todo" )} />
                <List id="in-progress" title="In Progress" taskCallbacks={this.props.taskCallbacks} cards={this.props.cards.filter((card) => card.status === "in-progress" )} />
                <List id="done" title="Done" taskCallbacks={this.props.taskCallbacks} cards={this.props.cards.filter((card) => card.status === "done" )} />
            </div>
        );
    }
}

// Board에 cards속성 선언
Board.propTypes = {
    cards : PropTypes.arrayOf( PropTypes.object ),
    taskCallbacks: PropTypes.object
};

// 리스트 컨테이너 역할 - Card를 ItemRenderer로 사용
class List extends Component {

    render(){
        let cards = this.props.cards.map((card) => {
            return <Card key ={card.id}
                         id = {card.id}
                         taskCallbacks={this.props.taskCallbacks}
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
    cards:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object

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
                    <CheckList  cardId={this.props.id} taskCallbacks={this.props.taskCallbacks} tasks={this.props.tasks} />
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
    tasks:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
}

// checkbox 클래스
class CheckList extends Component {

    checkInputKeyPress( evt ){
        if( evt.key === "Enter" ) {
            this.props.taskCallbacks.add( this.props.cardId, evt.target.value );
            evt.target.value = "";
        }
    }

    render(){
        let tasks = this.props.tasks.map( (task, taskIndex ) => (
            <li key={task.id} className="checklist-task">
                <input type="checkbox" checked={task.done} onChange={this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)} />
                {task.name}{' '}
                <a href="#" className="checklist-task-remove" onClick={this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex )} />
            </li>
        ));

        return(
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text" className="checklist-add-task" placeholder="type then hit enter to add a task" onKeyPress={this.checkInputKeyPress.bind(this)}/>
            </div>
        );
    }

}

CheckList.propsTypes = {
    cardId : PropTypes.number,
    tasks : PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object

}


ReactDOM.render( <BoardContainer />, document.getElementById("root") );
