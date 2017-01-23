import React, {Component} from 'react';
import ReactDOM from "react-dom";

//
class List extends Component {

    render(){
        return(
            <ul>
                <ListItem index = "1" name = "woo" />
                <ListItem index = "4" name = "coffee" />
                <ListItem index = "2" name = "milk" />
            </ul>
        );
    }

}


class ListItem extends Component {
    render(){

        return(
                <li>
                    {this.props.index} x { this.props.name }
                </li>
        );

    }
}

ReactDOM.render( <List/>, document.getElementById("root") );
