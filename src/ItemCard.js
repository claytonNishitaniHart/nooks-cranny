import React from "react";
import BuyPanel from "./BuyPanel";
import "./ItemCard.css";
import BellBag from "./images/BellBag.png"

class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uri: "",
            showBuy: true
        }
    }

    changeDisplayImage(_uri) {
        this.setState({uri: _uri});
    }

    showBuyButton() {
        this.setState({showBuy: !this.state.showBuy});
    }

    render() {
        let count = 0;
        let variants = [];
        if (this.props.variants.length > 1) {
            variants = this.props.variants;
            variants = variants.slice(0, 5);
        }
        return(
            <div className={"Card-base"}>
                <div className={"Card-base-image"} onMouseEnter={() => this.showBuyButton()} onMouseLeave={() => this.showBuyButton()}>
                    <BuyPanel showBuy={this.state.showBuy} uniqueIdP={this.props.english_name + "panel"} uniqueIdB={this.props.english_name + "button"} addToCartFunc={this.props.addToCartFunc} itemObject={this.props.itemObject}/>
                    <img className={"Card-image"} src={(this.state.uri === "" ? this.props.item_image : this.state.uri)} alt={"item"}/>
                </div>
                <div className={"Card-info"}>
                    <div className={"Card-info-variants"}>
                        {variants.map(x => {
                            count++;
                            return(
                                <div key={x.name["name-USen"] + x.variant + count} className={"variants"} onMouseEnter={() => this.changeDisplayImage(x.image_uri)}/>
                            );
                        })}
                    </div>
                    <span className={"Card-info-name"}>{this.props.english_name}</span>
                    <span className={"Card-info-price"}>{this.props.price}<img className={"bellbag"} src={BellBag} alt={"bell bag"}/></span>
                </div>
            </div>
        );
    }
}

export default ItemCard;