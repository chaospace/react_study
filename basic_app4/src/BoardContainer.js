//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import Board from './Board';
import "whatwg-fetch";
import update from "react-addons-update";

//  react animation추가
//  데이터 가져올 주소
const API_URL = "http://kanbanapi.pro-react.com";
const API_HEDER = {
    "Content-Type": "application/json",
    "Authorization" : "ichaospace@nate.comalsefjp"
}

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
    },
    {
        id:3,
        title:"외주 하기",
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
    },
    {
        id:4,
        title:"취업 하기",
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
    },
    {
        id:6,
        title:"잡플래닛 보기",
        description:"I should read the whole book",
        color:"#bd8d31",
        status:"in-progress",
        tasks:[]
    },
];


class BoardContainer extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            cards:[]
        }
    };

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

    };

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
    };

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
    };

    updateCardStatus( cardId, listId ){
        // 카드 인덱스를 찾음
        let cardIndex = this.state.cards.findIndex( (card) => card.id == cardId );
        let card      = this.state.cards[cardIndex];
        if( card.status !== listId ){
            // 변경된 상태로 컴포넌트 조정
            this.setState( update( this.state, {
                cards:{
                    [cardIndex]:{
                        status:{$set:listId}
                    }
                }
            }));
        }

    };


    updateCardPoisition( cardId, afterId ){
        // 다른 카드 위로 드래그 시에만 진행
        if( cardId !== afterId ) {
            let cardIndex = this.state.cards.findIndex( (card) => card.id == cardId );
            let card      = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex( (card) => card.id == afterId );
            this.setState( update(
                this.state, {
                    cards:{
                        $splice:[
                            [cardIndex, 1],
                            [afterIndex, 0, card]
                        ]
                    }
                }
            ) );
        }
    }


    // fetch를 이용한 promise적용
    componentDidMount(){
        /*fetch( API_URL +"/cards", {headers:API_HEDER})
        .then((response) => response.json() )
        .then((responseData) => {
            console.log( responseData  )
            this.setState({cards:responseData});
        })
        .catch( (error) =>{
            console.log( error );
        });*/
        this.setState({cards:cardList});
    };

    render(){
        return(
            <Board cards={this.state.cards} taskCallbacks={
                {
                    toggle:this.toggleTask.bind(this),
                    delete:this.deleteTask.bind(this),
                    add:this.addTask.bind(this)
                }
            }
            cardCallbacks={{
                updateStatus:this.updateCardStatus.bind(this),
                updatePosition:this.updateCardPoisition.bind(this)
            }}/>
        );
    };

}

export default BoardContainer;
