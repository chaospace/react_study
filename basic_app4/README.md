## React JS를 이용한 app만들기3##  
reactJS를 이용한 TodoList만들기  
    react dnd를 이용한 드래그&드롭기능 추가  
    drag&drop사용을 위한 플러그인 설치
```javascript
 npm install --save react-dnd react-dnd-html5-backend;
```

플러그인이 설치되면 DropTarget, DragSource 구현을 위한 기초지식  
 - 타입 지정 : 드롭&드래그 대상이 되는 객체 타입지정
 - 사양 객체(spec object) : 드래그 & 드롭이 시작될때 호출되는 함수
    - DragSource - beginDrag, endDrag
    - DropTarget - canDrag, onDrop
- 콜렉팅 함수 : React Dnd에서 속성 제어를 위해 제공하는 함수
  connector와 monitor 2매개 변수를 통해 컴포넌트에 정의된 콜렉팅 함수를 호출


``` javascript
// DropTarget import
// constants 는 card 문자열을 상수로 사용하기 위한 모듈로 내용은 아래가 전부
//export default { CARD : "card" };

import { DropTarget } from "react-dnd";
import constants from "./constants";

// 사양 객체 선언
const listTargetSpec = {
    hover( props, monitor ){
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateStatus( draggedId, props.id );
    }
}
// 콜렉팅 함수
function collect( connect, monitor ){
    return {
        connectDropTarget: connect.dropTarget()
    }
}

// 리스트 컨테이너 역할 - Card를 ItemRenderer로 사용
class List extends Component {

    render(){
        // connectDropTarget를 구조분해 할당
        // this.props.connectDropTarget 이 아니라 바로 connectDropTarget으로 접근
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
        //  connectDropTarget - 드롭 가능영역이 리스트라는 것을 알림
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





// dropTarget으로 모듈 내보내기
export default DropTarget(constants.CARD, listTargetSpec, collect)(List);

```

 Card클래스 DragTarget만들기  
 Card의 경우 Card사이에 순서를 변경가능 하기 때문에 DropTarget, DragSource역할 모두 함.  

 ```javascript
 // Card객체는 드래그와 동시에 드롭대상
 import React, {Component, PropTypes } from 'react';
 import { DragSource, DropTarget } from "react-dnd";

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
         /* 뷰를 dragsrouce, droptarget으로 2번 깜사줘야 함 */
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

/* export도 같은 render와 같은 요령으로  */
 const dragHighOrderCard = DragSource( constants.CARD, cardDragSpec, collectDrag )(Card);
 const dragDropHighOrderCard = DropTarget( constants.CARD, cardDropSpec, collectDrop )(dragHighOrderCard);

 export default dragDropHighOrderCard;
 ```
