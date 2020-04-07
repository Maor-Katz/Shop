import React from 'react';
import SearchBox from './SearchBox'
import MediaCard from './MediaCard'
import { getUserDetailsAndCartId, getNewCartId, generateVoucher, getCategories } from '../service'
import Modal from 'react-modal';
import { faPlus, faMinus, faWindowClose, faShoppingCart, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { shoppingCartfunc, addProduct } from '../actions/actions'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Loader from './Loader'
import payBtn from '../payBtn.jpg'

class Shop extends React.Component {

    state = {
        searchBox: '',
        categories: [],
        productsToShow: [],
        modalIsOpen: false,
        itemForModal: { product: '', quantity: 1, img_src: '', product_id: 0, price: 0 },
        userDetails: {},
        userCartId: 0,
        loader: true
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

    async componentDidMount() {
        let categoriesNames = await getCategories();
        this.setState({ categories: categoriesNames })
        this.getAllProducts();

        let userArayDetails = await getUserDetailsAndCartId();
        await this.setState({ userDetails: userArayDetails[0], userCartId: userArayDetails[1], loader: false })
        if (userArayDetails[1] === 'no-open-cart') {
            this.openNewCart()
        }
    }

    getAllProducts = async () => {
        let response = await fetch(`http://localhost:1009/products/all`);
        let data = await response.json()
        this.setState({ productsToShow: data })
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

            this.props.setForRender(Math.random() * 100)//for rendering parent in order Mycart component to rerender also
        } catch (err) {
            console.log(err)
        }
    }

    openNewCart = async () => {
        const { userDetails } = this.state
        let response = await fetch(`http://localhost:1009/products/newcart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Identity_num: userDetails.Identity_num, city: userDetails.city, street: userDetails.street, dateNow: "2020-01-18 13:17:17" })
        });
        let data = await response.json()
        let newCartId = await getNewCartId(userDetails.Identity_num);
        this.setState({ userCartId: newCartId })
    }
    editProduct = (details) => {
        const { userDetails } = this.state
        if (!userDetails.isAdmin) { return }// case user is not admin, dont continute with this function
        const { dispatch } = this.props
        dispatch(addProduct('NAME_P', details.product_name))
        dispatch(addProduct('PRICE_P', details.price))
        dispatch(addProduct('CATEGORY_ID', details.category_id))
        dispatch(addProduct('EDIT_PRODUCT', details.id))
        dispatch(addProduct('IMAGE_NAME', details.img_url))
    }

    render() {
        const { categories, productsToShow, modalIsOpen, itemForModal, userDetails, userCartId, loader } = this.state;
        const { shoppingCart, dispatch, isAdmin } = this.props

        return <div className="Shop">
            {loader && <Loader />}
            <div className="logoutWrapper">
                <div className="hiLogo">Welcome {userDetails.firstname}!</div>
                <a className="logoutBtn" onClick={() => localStorage.clear()} href="/login">Logout</a>
            </div>
            <img src="https://www.bls.gov/spotlight/2017/sports-and-exercise/images/cover_image.jpg" className="logo" alt="none" />
            {!isAdmin && <div className="openCartBtn" onClick={() => dispatch(shoppingCartfunc('SHOPPING_CART', !shoppingCart))}>
                <FontAwesomeIcon icon={faShoppingCart} className="shoppingIcon" />
                <FontAwesomeIcon icon={shoppingCart ? faArrowLeft : faArrowRight} className="rightArrow" />
            </div>}

            <h1 className="storeInfoTitle fontsize">Megasport</h1>
            {!userDetails.isAdmin && <a className="payWrapperBtn" href="/order" onClick={() => generateVoucher(userCartId, userDetails)}><img src={payBtn} className="payBtn"/></a>
      }
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
                <MediaCard details={p} openModal={this.openModal} key={index} editProduct={this.editProduct} />
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
                <img src={`http://localhost:1009/uploads/${itemForModal.img_src}`} className="imgModal" alt="none" />
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
    shoppingCart: state.shoppingCart.shopping_cart,
    isAdmin: state.isAdmin.isAdmin
})

export default connect(mapStateToProps)(withRouter(Shop))