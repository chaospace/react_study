## React JS 기초 정리2##  

**컴포넌트 조합**  
angularJS의 directive와 유사한 느낌이지만 객체지향적으로는 더 깔끔
```javascript
// 부모 클래스
class List extends Component {
    render(){
        return(
            <ul>
                <ListItem index = "1" name = "bread" />
                <ListItem index = "6" name = "coffee" />
                <ListItem index = "2" name = "milk" />
            </ul>
        );
    }

}

// 자식 클래스
class ListItem extends Component {
    render(){

        return(
                <li>
                    {this.props.index} x { this.props.name }
                </li>
        );

    }
}

// 돔에 뿌리기
ReactDOM.render( <List/>, document.getElementById("root") );
```
