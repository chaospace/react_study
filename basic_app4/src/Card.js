//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import marked from "marked";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { DragSource, DropTarget } from "react-dnd";
import CheckList from "./CheckList";
import constants from "./constants";

const cardDragSpec ={
    beginDrag( props ){
        return {
            id : props.id
        };
    }
}

const cardDropSpec = {
    hover( props, monitor ){

        const draggedId = monitor.getItem().id;
        //console.log("draggedId", props.cardCallbacks );
        props.cardCallbacks.updatePosition( draggedId, props.id );
    }
}

let collectDrop = ( connect, monitor ) => {
    return {
        connectDropTarget : connect.dropTarget()
    }
}

let collectDrag = ( connect, monitor ) => {
    return {
        connectDragSource : connect.dragSource()
    }
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
        const { connectDragSource, connectDropTarget } = this.props;
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
                    <CheckList  cardId={this.props.id}
                                taskCallbacks={this.props.taskCallbacks}
                                cardCallbacks={this.props.cardCallbacks}
                                tasks={this.props.tasks} />
                </div>
            );
        }
        /* onclick이벤트 시 bind를 통한 함수 연결 */
        return connectDropTarget( connectDragSource(
                <div className="card">
                    <div style={sideColor}></div>
                    <div className={this.state.showDetails ? "card-title card-title-is-open" : "card-title" } onClick={ this.toggleDetails.bind(this) }>{this.props.title}</div>
                    <ReactCSSTransitionGroup transitionName="toggle"
                                             transitionEnterTimeout={250}
                                             transitionLeaveTimeout={250}>
                    {cardDetails}
                    </ReactCSSTransitionGroup>

                </div>
        ));

    }
}

Card.propTypes ={
    id : PropTypes.number,
    title:PropTypes.string,
    description:PropTypes.string,
    color:PropTypes.string,
    tasks:PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
}

const dragHighOrderCard = DragSource( constants.CARD, cardDragSpec, collectDrag )(Card);
const dragDropHighOrderCard = DropTarget( constants.CARD, cardDropSpec, collectDrop )(dragHighOrderCard);

export default dragDropHighOrderCard;
