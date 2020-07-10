import React from 'react';
import ItemCard from "./ItemCard";
import CartItem from "./CartItem";
import './App.css';
import BellBag from "./images/BellBag.png"

import { FaShoppingCart } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            allResults: [],
            results: [],
            cart: [],
            showCart: false,
            pageNumber: 0
        }

        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    componentDidMount() {
        fetch('https://acnhapi.com/v1/houseware/')
            .then(res => res.json())
            .then(
                (result) => {
                    for (let item in result) {
                        if (result[item][0].source === "Nook's Cranny") {
                            this.setState({items: [...this.state.items, result[item]]});
                        }
                    }
                    //this.setState({results: this.state.items.slice(0, 30), cart: [{cartItem: {item: [this.state.items[0][0]], quantity: 1}}]});
                    this.setState({results: this.state.items.slice(0, 30), allResults: this.state.items});
                },
                (error) => {
                    console.log("did not work");
                }
            )
    }

    deepCopy = (input) => {
        let output, value, key;

        if (typeof input !== "object" || input === null) {
            return input;
        }

        output = Array.isArray(input) ? [] : {};

        for(key in input) {
            value = input[key];

            output[key] = this.deepCopy(value);
        }

        return output;
    }

    addToCart(newItem) {
        if (this.state.cart.length === 0) {
            this.setState({cart: [{cartItem: {item: [newItem], quantity: 1}}]});
        } else {
            for (let x in this.state.cart) {
                if (this.state.cart[x].cartItem.item[0].name["name-USen"] === newItem.name["name-USen"]) {
                    let updateCart = this.deepCopy(this.state.cart);
                    updateCart[x].cartItem.quantity += 1;
                    updateCart[x].cartItem.quantity = Math.min(updateCart[x].cartItem.quantity, 9);
                    this.setState({cart: updateCart});
                    break;
                } else {
                    this.setState({cart: [...this.state.cart, {cartItem: {item: [newItem], quantity: 1}}]});
                }
            }
        }
    }

    removeFromCart(oldItem) {
        for(let x in this.state.cart) {
            if (this.state.cart[x].cartItem.item[0].name["name-USen"] === oldItem.cartItem.item[0].name["name-USen"]) {
                let updateCart = this.deepCopy(this.state.cart);
                updateCart.splice(x, 1);
                this.setState({cart: updateCart});
                break;
            }
        }
    }

    changeQuantity(item, amount) {
        for (let x in this.state.cart) {
            if (this.state.cart[x].cartItem.item[0].name["name-USen"] === item.cartItem.item[0].name["name-USen"]) {
                let updateCart = this.deepCopy(this.state.cart);
                updateCart[x].cartItem.quantity += amount;
                updateCart[x].cartItem.quantity = Math.max(updateCart[x].cartItem.quantity, 1);
                updateCart[x].cartItem.quantity = Math.min(updateCart[x].cartItem.quantity, 9);
                this.setState({cart: updateCart});
            }
        }
    }

    searchItems(event) {
        let searchTerm = event.target.value.toString();
        this.setState({results: this.state.items.filter(x => x[0].name["name-USen"].includes(searchTerm)).slice(0, 30), allResults: this.state.items.filter(x => x[0].name["name-USen"].includes(searchTerm))});
    }

    changePage(amount) {
        this.setState((prevState) => ({
            pageNumber: prevState.pageNumber + amount
        }));
        this.setState((prevState) => ({
            results: this.state.allResults.slice(30 * prevState.pageNumber, 30 * prevState.pageNumber + 30)
        }));

        let element = document.querySelector("#Top");
        element.scrollIntoView({behavior: "smooth"});
    }

    render() {
        let Cart, Header, Cart_content, Cart_button, PrevPage_button, NextPage_button;
        let subtotal = 0, quantities = 0;

        for(let x in this.state.cart) {
            subtotal += this.state.cart[x].cartItem.item[0]["buy-price"] * this.state.cart[x].cartItem.quantity;
            quantities += this.state.cart[x].cartItem.quantity;
        }


        PrevPage_button =
            <button className={"pagination-Button button-left"} onClick={() => this.changePage(-1)}>
                previous
            </button>;
        NextPage_button =
            <button className={"pagination-Button button-right"} onClick={() => this.changePage(1)}>
                next
            </button>;

        if (this.state.pageNumber === 0) {
            PrevPage_button = null;
        } else if (this.state.allResults.length <= (this.state.pageNumber + 1) * 30) {
            NextPage_button = null;
        }

        if (!this.state.cart.length) {
            Header =
                <div className={"empty_header"}>
                    <button className={"close_cart-button"} onClick={() => this.setState({showCart: !this.state.showCart})}>
                        <FaTimes className={"close_cart-icon"}/>
                    </button>
                </div>;
            Cart_content =
                <div className={"empty_text-container"}>
                    <span className={"empty_text"}>
                        your shopping cart is empty :(
                    </span>
                </div>;
            Cart_button = null;
        }else {
            Header =
                <div className={"Cart-header"}>
                    <span className={"Cart-header-text"}>my cart</span>
                    <span className={"Cart-header-subtotal"}>
                        subtotal {subtotal}
                        <img className={"bellbag"} src={BellBag} alt={"bell bag"}/>
                    </span>
                    <button className={"close_cart-button"} onClick={() => this.setState({showCart: !this.state.showCart})}>
                        <FaTimes className={"close_cart-icon-white"}/>
                    </button>
                </div>
            Cart_content = this.state.cart.map(item => {
                return(
                    <CartItem key={item.cartItem.item[0].name["name-USen"]} item_image={item.cartItem.item[0].image_uri} english_name={item.cartItem.item[0].name["name-USen"]} quantity={item.cartItem.quantity} price={item.cartItem.item[0]["buy-price"]} removeFromCartFunc={this.removeFromCart} changeQuantityFunc={this.changeQuantity} itemObject={item}/>
                );
            });
            Cart_button =
                <div className={"Cart-clearButton-container"}>
                    <button className={"Cart-clearButton"} onClick={() => {this.setState({cart: []})}}>
                        clear cart
                    </button>
                </div>;
        }

        if (this.state.showCart){
            Cart =
                <div className={"Cart-Dropdown-container"}>
                    {Header}
                    <div className={"Cart-Dropdown"}>
                        {Cart_content}
                        <div id={"dropdown-buffer"}/>
                    </div>
                    {Cart_button}
                </div>
        } else{
            Cart = null;
        }

        return (
            <div className="App">
                <div className={"Header"} id={"Top"}>
                    <div className={"Logo_text"}>Nook's Cranny</div>
                </div>
                <div className={"Searchbar-Container"}>
                    <input className={"Searchbar"} type={"text"} placeholder={"Search..."} onChange={event => this.searchItems(event)} value={this.state.searchResult}/>
                    <button className={"Shopping-Cart"} onClick={() => this.setState({showCart: !this.state.showCart})}><FaShoppingCart id={"cartIcon"}/><span className={"quantities"}>{quantities}</span></button>
                    {Cart}
                </div>
                <div className={"pagination"}>
                    {PrevPage_button}
                    {NextPage_button}
                </div>
                <div className={"results"}>
                    {this.state.results.map(item => {
                        return(
                            <ItemCard key={item[0].name["name-USen"]} item_image={item[0].image_uri} english_name={item[0].name["name-USen"]} price={item[0]["buy-price"]} variants={item} addToCartFunc={this.addToCart} itemObject={item[0]}/>
                        );
                    })}
                </div>
                <div className={"pagination"}>
                    {PrevPage_button}
                    {NextPage_button}
                </div>
                <div className={"Footer"}>
                    made by clayton nishitani-hart :)
                </div>
            </div>
        );
    }
}

export default App;
