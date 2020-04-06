import React from 'react';
import Mycartcard from './Mycartcard'
import { faShekelSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { getUserDetailsAndCartId, getCategories } from '../service'
import { isAdminDetails } from '../actions/actions'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import UploadButtons from './matirialComponents/Uploadbtn'
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { addProduct } from '../actions/actions'
import NativeSelects from './matirialComponents/Myselect'

class Mycart extends React.Component {

    state = { productsForCart: [], totalPrice: 0, categories: [], files: {} }
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

    uploadHandler = async (e) => {
        this.setState({ files: e.target.files })
    }
    
    addProduct = async () => {
        debugger
        const { files } = this.state;
        const { newProduct } = this.props;
        await this.uploadImg();
        try {
            let response = await fetch(`http://localhost:1009/products/addproduct`, {
                method: 'POST',
                body: JSON.stringify({ newProduct, files })
            });
            let data = await response.json()
            console.log(data)

        } catch (e) {
            console.log('upload file failed', e)
        }
    }
    uploadImg = async () => {
        const { files } = this.state;
        const form = new FormData()
        for (let i = 0; i < files.length; i++) {
            form.append('abc', files[i], files[i].name)
        }

        try {
            let response = await fetch(`http://localhost:1009/products/uploadimg`, {
                method: 'POST',
                body: form
            });
            let data = await response.json()
            console.log(data)

        } catch (e) {
            console.log('upload file failed', e)
        }
    }

    render() {
        const { productsForCart, totalPrice, categories } = this.state;
        const { shoppingCart, isAdmin, newProduct, dispatch } = this.props;

        return <div className={`myCartPanel ${shoppingCart || isAdmin ? 'flex1' : 'flex0'} ${this.props.atOrder ? 'cartAtOrder' : ''}`}>
            {!isAdmin ? <div>
                <h2 className="storeInfoTitle ">My Cart</h2>
                {productsForCart.map((p, index) => (
                    <Mycartcard details={p} key={index} deleteProductItem={this.deleteProductItem} atOrder={this.props.atOrder ? true : false} />
                ))}
                <div className="totalPrice">Total price : {totalPrice} <FontAwesomeIcon icon={faShekelSign} className="size12" /></div>
            </div> : <div className="adminPanel">
                    <h2 className="storeInfoTitle ">Add New Product</h2>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        label="Name"
                        autoFocus
                        onChange={(e) => dispatch(addProduct('NAME_P', e.target.value))}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        label="Price"
                        type="number"
                        autoFocus
                        onChange={(e) => dispatch(addProduct('PRICE_P', +e.target.value))}
                    />

                    <NativeSelects categories={categories} dispatch={dispatch} newProduct={newProduct} />

                    <UploadButtons uploadHandler={this.uploadHandler} />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className="saveBtn"
                        startIcon={<SaveIcon />}
                        onClick={() => this.addProduct()}
                    >
                        Save
      </Button>
                </div>}
        </div>;
    }
}
const mapStateToProps = state => ({
    shoppingCart: state.shoppingCart.shopping_cart,
    isAdmin: state.isAdmin.isAdmin,
    newProduct: state.newProduct
})

export default connect(mapStateToProps)(withRouter(Mycart))