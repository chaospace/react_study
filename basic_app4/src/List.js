//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import { DropTarget } from "react-dnd";
import constants from "./constants";
import Card from "./Card";


const listTargetSpec = {
    hover( props, monitor ){
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateStatus( draggedId, props.id );
    }
}

function collect( connect, monitor ){
    return {
        connectDropTarget: connect.dropTarget()
    }
}

// 리스트 컨테이너 역할 - Card를 ItemRenderer로 사용
class List extends Component {

    render(){
        const { connectDropTarget } = this.props;

        let cards = this.props.cards.map((card) => {
            return <Card key ={card.id}
                         id = {card.id}
                         taskCallbacks={this.props.taskCallbacks}
                         cardCallbacks={this.props.cardCallbacks}
                         title = {card.title}
                         description = {card.description}
                         color = {card.color}
                         tasks = {card.tasks} />
        });
        return connectDropTarget(
            <div className="list">
                <h1>{this.props.title}</h1>
                {cards}
            </div>
        );
    }

}

List.propTypes ={
    id : PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    cards:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired
}






export default DropTarget(constants.CARD, listTargetSpec, collect)(List);
