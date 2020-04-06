import React from 'react';
import SearchBox from './SearchBox'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getUserDetailsAndCartId, getInvoice } from '../service'
import { userDetails } from '../actions/actions'
import Modal from 'react-modal';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';


class Order extends React.Component {

    state = {
        productsForCart: [], totalPrice: 0, searchBox: '', listForSuggest: [],
        form: { city: '', street: '', date: new Date(), credit: '' },
        selectedDate: new Date(),
        errMsg: '',
        successMsg: ''
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
        const { dispatch } = this.props;
        this.getUserProducts()
        this.getUserTotalPrice()

        let userArayDetails = await getUserDetailsAndCartId();
        dispatch(userDetails('DETAILS', { userDetails: userArayDetails[0], userCartId: userArayDetails[1] }))
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
        const { productsForCart, searchBox } = this.state;

        let newListForSuggest = productsForCart.filter(p => {
            var reg = new RegExp(searchBox, "i");
            let myString = reg.exec(p.product_name);//generate my string that i have found at product name
            if (myString === null) { myString = [] }//make it array if i didnt found my string
            p['newArr'] = p.product_name.replace(reg, '|' + myString[0] + '|').split('|')
            return reg.test(p.product_name);
        })

        this.setState({ listForSuggest: newListForSuggest })
    }
    updateForm = (e, field) => {
        const { form } = this.state;
        form[field] = field === 'date' ? e.constructor() : e.target.value;
        this.setState({ form })
    }

    fillTextField = (field) => {
        const { form } = this.state
        const { userDetails } = this.props
        form[field] = userDetails.userDetails[field];
        this.setState({ form })
    }
    changeDate = (e) => {
        const { form } = this.state;
        form['date'] = e;
        this.setState({ selectedDate: e })
    }

    disableWeekends = (date) => {
        return date.getDay() === 5 || date.getDay() === 6;
    }

    checkNumOfOrders = async () => {
        const { form } = this.state;
        let year = form['date'].getFullYear()
        let month = form['date'].getMonth() + 1;
        let monthTranslate = `0${month}`.slice(-2)// i.e: in order to get april 04 and not 4
        let day = form['date'].getDate();
        let dayTranslate = `0${day}`.slice(-2)// i.e: in order to get day 05 and not 5
        let response = await fetch(`http://localhost:1009/products/ordersbydate/${year}-${monthTranslate}-${dayTranslate}`);
        let data = await response.json()
        if (data.length > 2) { return false } else {
            return true
        }
    }

    confirmOrder = async () => {
        const { userDetails } = this.props
        const { form } = this.state
        try {
            let continueOrder = await this.checkNumOfOrders();
            if (continueOrder === false) {//validation if we have 3 orders already at the same day
                this.setState({ errMsg: 'No Shipping at your date, please choose another Date' })
                return
            }

            const rawResponse = await fetch(`http://localhost:1009/products/confirm/${userDetails.userDetails.Identity_num}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ arrival_date: `${form.date.toISOString()}` })
            });
            const content = await rawResponse.json();
            this.setState({ successMsg: 'Your reservation had been confirmed!' })
        } catch (err) {
            this.setState({ errMsg: 'Can not confirm your order, please try again later' })
            console.log(err)
        }
    }

    render() {

        const { errMsg, searchBox, listForSuggest, form, selectedDate, successMsg } = this.state

        return <div className="orderPage">
            <h2 className="storeInfoTitle ">My Order</h2>
            <div ><SearchBox handler={this.handler} /></div>
            {searchBox && <div className='autosuggest'>{listForSuggest.map(p => (
                <div>
                    <span>{p.newArr[0]}<span className="red">{p.newArr[1]}</span>{p.newArr[2]}</span>
                </div>
            ))}</div>}
            <Button variant="contained" color="primary" href="/shop"

                className="backToShop">
                Back To Shop
      </Button>
            <div>
                <h1>Shipping details:</h1>
                <div className="citySection tooltip">
                    <span class="tooltiptext">Double click in order to insert your city<span className="chat black"></span></span>
                    <h3 className="sectionTitle">City</h3><span> <TextField required id="standard-basic" label="City"
                        value={form['city']}
                        onChange={(e) => this.updateForm(e, 'city')}
                        onDoubleClick={() => this.fillTextField('city')} /></span></div>

                <div className="streetSection tooltip">
                    <span class="tooltiptext">Double click in order to insert your street<span className="chat black"></span></span>
                    <h3 className="sectionTitle">Street</h3><span> <TextField required id="standard-basic" label="street" onChange={(e) => this.updateForm(e, 'street')}
                        value={form['street']}
                        onDoubleClick={() => this.fillTextField('street')} /></span></div>

                <div className="dateSection"><h3 className="sectionTitle">Shipping Date</h3><span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker disablePast shouldDisableDate={this.disableWeekends} value={selectedDate} onChange={(e) => this.changeDate(e)} />
                    </MuiPickersUtilsProvider>
                </span></div>

                <h2 className="paymentTitle">Payments:</h2>
                <div className="cretidSection"><h3 className="sectionTitle">Credit</h3><span> <TextField required type="number" id="standard-basic" label="Standard" onChange={(e) => this.updateForm(e, 'credit')} /></span></div>
                <div><Button variant="contained" color="primary"
                    disabled={!Object.values(form).every(x => x)} className="confirmBtn" onClick={() => this.confirmOrder()}>
                    confirm order
</Button></div>
            </div>
            <Modal
                isOpen={errMsg || successMsg}
                style={this.customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                {errMsg && <div>
                    <div className="errorMsg">{errMsg}</div>
                    <div className="addBtnModal"><Button size="small" color="primary" className="addButton" onClick={() => this.setState({ errMsg: '', successMsg: '' })}>
                        Close
        </Button></div>
                </div>}
                {successMsg && <div>
                    <div className="lineModal"></div>
                    <div className="successMsg">{successMsg}</div>
                    <div className="voucherBtn">
                        <Button variant="contained" color="primary"
                            onClick={(e) => getInvoice(e, true)} className="width111" >
                            print
      </Button>
                        <span className="leftMargin"> <Button variant="contained" color="primary"
                            onClick={(e) => getInvoice(e)} >
                            download
      </Button></span>
                    </div>
                    <div className="addBtnModal"><Button size="small" color="primary" href="/shop" className="addButton" onClick={() => this.setState({ errMsg: '', successMsg: '' })}>
                        OK
        </Button></div>
                </div>
                }

            </Modal>
        </div>;
    }
}
const mapStateToProps = state => ({
    userDetails: state.userDetails
})

export default connect(mapStateToProps)(withRouter(Order))