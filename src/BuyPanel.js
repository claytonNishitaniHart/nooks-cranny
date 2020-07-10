import React from "react";
import "./BuyPanel.css";

class BuyPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPanel: true
        };
    }

    showBuyPanel() {
        let panel = document.getElementById(this.props.uniqueIdP);
        let button = document.getElementById(this.props.uniqueIdB);
        if (this.state.showPanel) {
            panel.style.height = "133px";
            button.style.opacity = "1";
        } else {
            panel.style.height = "0";
            button.style.opacity = "0";
        }
    }


    componentDidUpdate(prevProps) {
        if (prevProps.showBuy !== this.props.showBuy) {
            this.setState({showPanel: !this.state.showPanel});
            this.showBuyPanel();
        }
    }

    render() {
        return(
            <div id={this.props.uniqueIdP} className={"Buy-panel"}>
                <button id={this.props.uniqueIdB} className={"Buy-button"} onClick={() => this.props.addToCartFunc(this.props.itemObject)}>buy</button>
            </div>
        );

    }
}

export default BuyPanel;