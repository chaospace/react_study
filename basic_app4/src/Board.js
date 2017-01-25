//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import constants from "./constants";
import List from "./List";

class Board extends Component {
    render(){
        let cards;
        return(
            <div className="app">
                <List id="todo" title="To do" taskCallbacks={this.props.taskCallbacks}
                    cardCallbacks={this.props.cardCallbacks}
                    cards={this.props.cards.filter((card) => card.status === "todo" )} />
                <List id="in-progress" title="In Progress" taskCallbacks={this.props.taskCallbacks}
                    cardCallbacks={this.props.cardCallbacks}
                    cards={this.props.cards.filter((card) => card.status === "in-progress" )} />
                <List id="done" title="Done" taskCallbacks={this.props.taskCallbacks}
                    cardCallbacks={this.props.cardCallbacks}
                    cards={this.props.cards.filter((card) => card.status === "done" )} />
            </div>
        );
    }
}

// Board에 cards속성 선언
Board.propTypes = {
    cards : PropTypes.arrayOf( PropTypes.object ),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object
};

export default DragDropContext(HTML5Backend)(Board);
