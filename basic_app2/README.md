## React JS를 이용한 app만들기2##  
reactJS를 이용한 TodoList만들기  
 클래스에 PropTypes을 이용한 속성 정의  
 리스트 형식의 요소의 변경에 대해 성능계선을 위해 key속성 사용.  

```javascript
//PropTypes타입 import 추가
import React, {Component, PropTypes } from 'react';


// Board에 cards속성 선언
// cards속성은 배열내부에 object로 구성됨을 제공
Board.propTypes = {
    cards : PropTypes.arrayOf( PropTypes.object )
};

// isRequired를 이용해 필수 여부 제공
List.propTypes ={
    title:PropTypes.string.isRequired,
    cards:PropTypes.arrayOf(PropTypes.object)
}

// 리스트 - Card 리턴 시 key속성 설정
class List extends Component {

    render(){
        let cards = this.props.cards.map((card) => {
            return <Card key ={card.id}
                         ...  />
        });
        return( ... );
    }

}


// PropTypes을 커스텀으로 정의해서 사용도 가능
let titleProps = ( props, propName, componentName ) => {
    if( props[propName]){
        let value = props[propName];
        if( typeof value !== "string" || value.length > 80 ) {
            return new Error('${propName} in ${componentName} is longer than 80 characters');
        }
    }
}

Card.propTypes = {
    title:titleProps
}

```
