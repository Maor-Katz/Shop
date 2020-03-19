import React from 'react';
import SearchBox from './SearchBox'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

class Order extends React.Component {

    state = {
        productsForCart: [], totalPrice: 0, searchBox: '', listForSuggest: []
    }

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

    handler = async (e) => {
        await this.setState({ searchBox: e.target.value })
        this.checkAutoSuggest()
    }

    checkAutoSuggest = () => {
        const { productsForCart, listForSuggest, searchBox } = this.state;
        let newListForSuggest = productsForCart.filter(p => {

            var reg = new RegExp(searchBox, "i");
            debugger
            p['newArr'] = p.product_name.replace(reg, '|' + searchBox + '|').split('|')

            return reg.test(p.product_name);
        })
        this.setState({ listForSuggest: newListForSuggest })
    }


    render() {

        const { productsForCart, totalPrice, searchBox, listForSuggest } = this.state

        console.log(productsForCart)
        return <div className="orderPage">
            <h2 className="storeInfoTitle ">My Order</h2>
            <div ><SearchBox handler={this.handler} /></div>
            {searchBox && <div className='autosuggest'>{listForSuggest.map(p => (
                <div>
                    <span>{p.newArr[0]}<span className="red">{p.newArr[1]}</span>{p.newArr[2]}</span>
                </div>
            ))}</div>}
        </div>;
    }
}
const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(withRouter(Order))