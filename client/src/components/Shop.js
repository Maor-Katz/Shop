import React from 'react';
import SearchBox from './SearchBox'
import MediaCard from './MediaCard'
import Modal from 'react-modal';
import { faPlus, faMinus, faWindowClose, faShoppingCart, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { shoppingCartfunc } from '../actions/actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';


class Shop extends React.Component {

    state = {
        searchBox: '',
        categories: [],
        productsToShow: [],
        modalIsOpen: false,
        itemForModal: { product: '', quantity: 1, img_src: '', product_id: 0, price: 0 },
        userDetails: {},
        userCartId: 0
    }

    customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };
    componentDidMount() {
        this.getCategories();
        this.getAllProducts();
        this.getUserDetailsAndCartId();
    }

    getUserDetailsAndCartId = async () => {
        let response = await fetch(`http://localhost:1009/auth/${localStorage.email}`);
        let data = await response.json()
        let response2 = await fetch(`http://localhost:1009/products/cart/${data[0].Identity_num}`);
        let data2 = await response2.json()
        this.setState({ userDetails: data[0], userCartId: data2[0].cart_id })
    }

    getAllProducts = async () => {
        let response = await fetch(`http://localhost:1009/products/all`);
        let data = await response.json()
        this.setState({ productsToShow: data })
    }

    getCategories = async () => {
        let response = await fetch(`http://localhost:1009/products/category`);
        let data = await response.json()
        this.setState({ categories: data })
    }
    handler = (e) => {
        this.setState({ searchBox: e.target.value })
    }

    openModal = (itemDetails) => {
        this.setState({
            itemForModal: { product: itemDetails.product_name, quantity: 1, img_src: itemDetails.img_url, product_id: itemDetails.id || itemDetails.product_id, price: itemDetails.price },
            modalIsOpen: true
        })
    }

    getProductsByCategory = async (categoryId) => {
        let response = await fetch(`http://localhost:1009/products/bycategory/${categoryId}`);
        let data = await response.json()
        this.setState({ productsToShow: data })
    }

    searchProduct = async () => {
        let response = await fetch(`http://localhost:1009/products/search/${this.state.searchBox}`);
        let data = await response.json()
        this.setState({ productsToShow: data })
    }

    addCartItem = async () => {
        const { userCartId, itemForModal } = this.state
        try {
            let response = await fetch(`http://localhost:1009/products/cartitem/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: itemForModal.product_id, quantity: itemForModal.quantity, price: itemForModal.price, cart_id: userCartId })
            });
            let data = await response.json()
            this.setState({
                modalIsOpen: false,
                itemForModal: { product: '', quantity: 1, img_src: '', product_id: 0, price: 0 }
            })
            debugger
            this.props.setForRender(Math.random() * 100)//for rendering parent in order Mycart component to rerender also
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { categories, productsToShow, modalIsOpen, itemForModal, searchBox } = this.state;
        const { shoppingCart, dispatch } = this.props

        return <div className="Shop">
            <img src="https://www.bls.gov/spotlight/2017/sports-and-exercise/images/cover_image.jpg" className="logo" />
            <div className="openCartBtn" onClick={() => dispatch(shoppingCartfunc('SHOPPING_CART', !shoppingCart))}>
                <FontAwesomeIcon icon={faShoppingCart} className="shoppingIcon" />
                <FontAwesomeIcon icon={shoppingCart ? faArrowLeft : faArrowRight} className="rightArrow" /></div>

            <h1 className="storeInfoTitle fontsize">Megasport</h1>
            <Button variant="contained" color="primary" href="/order"
               >
               Order
      </Button>
            <div ><SearchBox handler={this.handler} searchProduct={this.searchProduct} /></div>
            <div className="categoryPanel">
                <div className="categoryTitles">
                    <div className="specificCategory categoryAll" onClick={() => this.getAllProducts()}>
                        All
                         <span className="divider"></span>
                    </div>

                    {categories.map((c, index) => (
                        <div className="categoryWrapper" key={index}>
                            <div className="specificCategory" onClick={() => this.getProductsByCategory(c.id)}>{c.category_name}</div>
                            {!(index === (categories.length - 1)) && <span className="divider"></span>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="productsList">{productsToShow.map((p, index) => (
                <MediaCard details={p} openModal={this.openModal} key={index} />
            ))}</div>
            <Modal
                isOpen={modalIsOpen}
                style={this.customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                <FontAwesomeIcon icon={faWindowClose} className="closeModal" onClick={() => this.setState({
                    modalIsOpen: false,
                    itemForModal: { product: '', quantity: 1, img_src: '' }
                })} />
                <img src={itemForModal.img_src} className="imgModal" />
                <div className="productModal">{itemForModal.product}</div>
                <div className="qunatityDiv">
                    <FontAwesomeIcon icon={faMinus} className="qunatityBtn" onClick={() => { itemForModal.quantity--; this.setState({ itemForModal }) }} />
                    <span className="qunatityModal">{itemForModal.quantity}</span>
                    <FontAwesomeIcon icon={faPlus} className="qunatityBtn" onClick={() => { itemForModal.quantity++; this.setState({ itemForModal }) }} />
                </div>
                <div className="addBtnModal"><Button size="small" color="primary" className="addButton" onClick={() => this.addCartItem()}>
                    Add
        </Button></div>
            </Modal>
        </div>;
    }
}
const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart.shopping_cart
})

export default connect(mapStateToProps)(withRouter(Shop))