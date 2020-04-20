import React from 'react';
import Mycartcard from './Mycartcard'
import { faShekelSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { getUserDetailsAndCartId, getCategories, deleteStorageDirectLogin } from '../service'
import { isAdminDetails } from '../actions/actions'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import UploadButtons from './matirialComponents/Uploadbtn'
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { addProduct, chooseView, shoppingCartfunc } from '../actions/actions'
import NativeSelects from './matirialComponents/Myselect'

class Mycart extends React.Component {

    state = {
        productsForCart: [],
        totalPrice: 0,
        categories: [],
        files: {},
        addNewProdForm: false,
    }
    useStyles = makeStyles(theme => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    async componentDidMount() {
        const { dispatch } = this.props
        this.checkView()
        this.getUserProducts()
        this.getUserTotalPrice()
        let userDetails = await getUserDetailsAndCartId()
        let isAdminFlag = userDetails[0] && userDetails[0].isAdmin
        dispatch(isAdminDetails('IS_ADMIN', isAdminFlag))
        if (isAdminFlag) {
            let categories = await getCategories();
            this.setState({ categories })
        }
    }

    checkView = () => {
        const { dispatch } = this.props
        // need to listen to resize event listener in order to choose the view
        window.addEventListener('resize', () => {
            if (window.innerWidth < 1200) {
                dispatch(chooseView('MOBILE_MENU', true))
            } else {
                dispatch(chooseView('MOBILE_MENU', false))
            }
        });
        //on the first upload of the page we must check the view:
        if (window.innerWidth < 1200) {
            dispatch(chooseView('MOBILE_MENU', true))
        }
    }

    getUserTotalPrice = async () => {
        let response = await fetch(`http://localhost/products/sum/${localStorage.email}`);
        let data = await response.json()
        this.setState({ totalPrice: Object.values(data[0])[0] || 0 })
    }

    getUserProducts = async () => {
        let response = await fetch(`http://localhost/products/productsbyid/${localStorage.email}`, {
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.token
            }
        });
        if (response.status === 401) {
            deleteStorageDirectLogin(this.props);
        }
        let data = await response.json()
        this.setState({ productsForCart: data })
    }

    deleteProductItem = async (productId) => {
        let response = await fetch(`http://localhost/products/product/${productId}`, {
            method: 'DELETE'
        });
        let data = await response.json();
        this.getUserProducts();
        this.getUserTotalPrice();
    }

    uploadHandler = async (e) => {
        const { dispatch } = this.props
        dispatch(addProduct('UPLOAD_IMAGE', e.target.files));
        dispatch(addProduct('IMAGE_NAME', e.target.files[0].name));
    }

    addProduct = async (addNew) => {
        const { newProduct, productId } = this.props;
        //if its new product i must add new image:!!!
        if (!newProduct.files[0] && addNew) { return console.error('please add image to the product') }
        await this.uploadImg();
        try {
            let response = await fetch(`http://localhost/products/${addNew ? 'addproduct' : 'editproduct'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newProduct,
                    imgName: newProduct.img_name,
                    productToEdit: addNew ? false : productId.productId
                })// if our case is to edit an existing product, we need to send product id - productToEdit
            });
            let data = await response.json()
            this.cleanNewProductForm()
            this.setState({ addNewProdForm: false })
            this.props.setForRender(Math.random() * 100)//for rendering parent in order Mycart component to rerender also

        } catch (e) {
            console.log('upload file failed', e)
        }
    }
    uploadImg = async () => {
        const { newProduct } = this.props;
        const form = new FormData()
        for (let i = 0; i < newProduct.files.length; i++) {
            form.append('abc', newProduct.files[i], newProduct.files[i].name)
        }

        try {
            let response = await fetch(`http://localhost/products/uploadimg`, {
                method: 'POST',
                body: form
            });
            let data = await response.json()
            console.log(data)

        } catch (e) {
            console.log('upload file failed', e)
        }
    }

    cleanNewProductForm = () => {
        const { dispatch } = this.props
        dispatch(addProduct('UPLOAD_IMAGE', {}));
        dispatch(addProduct('IMAGE_NAME', ''));
        dispatch(addProduct('PRICE_P', 0));
        dispatch(addProduct('NAME_P', ''));
        dispatch(addProduct('CATEGORY_ID', 0));
    }

    showAddProductForm = () => {
        this.cleanNewProductForm();
        this.setState({ addNewProdForm: true })
    }

    render() {
        const { productsForCart, totalPrice, categories, addNewProdForm } = this.state;
        const { shoppingCart, isAdmin, newProduct, dispatch, view } = this.props;
        
        return  <div className={`myCartPanel ${shoppingCart || isAdmin ? 'flex1' : 'flex0'} ${view.mobileMenu && window.location.pathname==='/order' && 'displayNone'} ${this.props.atOrder ? 'cartAtOrder' : ''}`}>
            {!isAdmin ? <div>
                <h2 className="storeInfoTitle ">My Cart</h2>
                {productsForCart.map((p, index) => (
                    <Mycartcard details={p} key={index} deleteProductItem={this.deleteProductItem} atOrder={this.props.atOrder ? true : false} />
                ))}
                <div className="totalPrice">Total price : {totalPrice} <FontAwesomeIcon icon={faShekelSign} className="size12" /></div>
                {view.mobileMenu && <Button size="small" variant="contained" color="primary" className="marginBottom"
                    onClick={() => dispatch(shoppingCartfunc('SHOPPING_CART', false))}>
                    Back To Shop
</Button>}
            </div> : <div className="adminPanel">
                    <div>
                        {addNewProdForm ? <h2 className="storeInfoTitle ">Add New Product</h2> : <h2 className="storeInfoTitle ">Edit</h2>}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            label="Name"
                            value={newProduct.name}
                            autoFocus
                            onChange={(e) => dispatch(addProduct('NAME_P', e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            label="Price"
                            value={newProduct.price}
                            type="number"
                            autoFocus
                            onChange={(e) => dispatch(addProduct('PRICE_P', +e.target.value))}
                        />

                        <NativeSelects categories={categories} dispatch={dispatch} categoryId={newProduct.category_id} />

                        <UploadButtons uploadHandler={this.uploadHandler} />
                        {addNewProdForm ? <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className="saveBtn"
                            startIcon={<SaveIcon />}
                            onClick={() => this.addProduct(true)}
                        >
                            Add
      </Button> : <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                className="saveBtn"
                                startIcon={<SaveIcon />}
                                onClick={() => this.addProduct(false)}
                            >
                                Save
      </Button>}
                    </div>


                    <div><img className="imageAdd" src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX11070076.jpg" onClick={() => this.showAddProductForm()} /></div>
                </div>}
        </div>;
    }
}
const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart.shopping_cart,
    isAdmin: state.isAdmin.isAdmin,
    newProduct: state.newProduct,
    productId: state.editProduct,
    view: state.view
})

export default connect(mapStateToProps)(withRouter(Mycart))