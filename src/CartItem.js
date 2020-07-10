import React from "react";
import "./CartItem.css";
import BellBag from "./images/BellBag.png";

import { FaTrashAlt } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import { FaGreaterThan} from "react-icons/fa";

class CartItem extends React.Component {
    render() {
        return(
            <div className={"CartItem-base"}>
                <div className={"CartItem-image-background"}/>
                <img className={"CartItem-image"} src={this.props.item_image} alt={"cart item"}/>
                <div className={"CartItem-info"}>
                    <span className={"CartItem-info-name"}>{this.props.english_name}</span>
                    <span className={"CartItem-info-price"}>{this.props.price}<img className={"bellbag"} src={BellBag} alt={"bell bag"}/></span>
                    <button className={"CartItem-info-decrement CartItem-button"} onClick={() => this.props.changeQuantityFunc(this.props.itemObject, -1)}><FaLessThan/></button>
                    <span className={"CartItem-info-quantity"}>{this.props.quantity}</span>
                    <button className={"CartItem-info-increment CartItem-button"} onClick={() => this.props.changeQuantityFunc(this.props.itemObject, 1)}><FaGreaterThan/></button>
                    <button className={"CartItem-info-remove CartItem-button"} onClick={() => this.props.removeFromCartFunc(this.props.itemObject)}><FaTrashAlt/></button>
                </div>
            </div>
        );
    }
}

export default CartItem;