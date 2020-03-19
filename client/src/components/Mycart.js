import React from 'react';
import Mycartcard from './Mycartcard'
import { faShekelSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

class Mycart extends React.Component {

    state = { productsForCart: [], totalPrice: 0 }

    componentDidMount() {
        this.getUserProducts()
        this.getUserTotalPrice()
    }
    getUserTotalPrice = async () => {
        let response = await fetch(`http://localhost:1009/products/sum/${localStorage.email}`);
        let data = await response.json()
        this.setState({ totalPrice: Object.values(data[0])[0] })
    }

    getUserProducts = async () => {
        let response = await fetch(`http://localhost:1009/products/productsbyid/${localStorage.email}`);
        let data = await response.json()
        this.setState({ productsForCart: data })
    }

    deleteProductItem = async (productId) => {
        let response = await fetch(`http://localhost:1009/products/product/${productId}`, {
            method: 'DELETE'
        });
        let data = await response.json();
        this.getUserProducts();
        this.getUserTotalPrice();
    }


    render() {
        const { productsForCart, totalPrice } = this.state;
        const { shoppingCart } = this.props;

        return <div className={`myCartPanel ${shoppingCart ? 'flex1' : 'flex0'} ${this.props.atOrder ? 'cartAtOrder' : ''}`}>
            <h2 className="storeInfoTitle ">My Cart</h2>
            {productsForCart.map((p, index) => (
                <Mycartcard details={p} key={index} deleteProductItem={this.deleteProductItem} atOrder={this.props.atOrder ? true : false} />
            ))}
            <div className="totalPrice">Total price : {totalPrice} <FontAwesomeIcon icon={faShekelSign} className="size12" /></div>
        </div>;
    }
}
const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart.shopping_cart
})

export default connect(mapStateToProps)(withRouter(Mycart))