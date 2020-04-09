import React from 'react';
import { productsCounterUser, allCompletedOrdersForUser, getUserDetailsAndCartId } from '../service'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { setUserStatus } from '../actions/actions'
var moment = require('moment');

class About extends React.Component {

  state = {
    productsNum: 0,
    ordersNum: 0,
    lastUserOrder: {},
    name: ''
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    fetch('http://localhost:1009/products')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ productsNum: Object.values(data[0])[0] })
      });
    fetch('http://localhost:1009/products/orders')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ ordersNum: Object.values(data[0])[0] })
      });
    if (localStorage.email) {
      let userProductsCounter = await productsCounterUser(localStorage.email);
      let userdetails = await getUserDetailsAndCartId()
      let name = userdetails[0].firstname
      this.setState({ userOpenOrder: true, name })
      //case user have open order:
      if (userProductsCounter.length > 0) {
        dispatch(setUserStatus('OPEN_ORDER', true))
      } else {//case user does not have open order
        let allOrders = await allCompletedOrdersForUser(localStorage.email)
        if (allOrders.length > 0) {//case user closed his all previous orders
          let lastOrder = allOrders.pop();
          this.setState({ lastUserOrder: lastOrder, name })
        } else {//user does not have any orders, new user:
          dispatch(setUserStatus('NEW_USER', true))
        }
      }
    }
  }

  render() {
    const { productsNum, ordersNum, lastUserOrder, name } = this.state;
    const { userStatus } = this.props
    return <div className="storeInfoPage">
      <h1 className="storeInfoTitle">Store Information</h1>
      <div className="infoDetails">
        <div className="numOfProducts">Availble products of Megasport : {productsNum}</div>
        <div className="numOfProducts">Orders completed of Megasport : {ordersNum}</div>
        {userStatus.itsNewUser && <h3 className="storeNotfication">
          Welcome {name}!
      </h3>}
        {userStatus.userOpenOrder && <h3>
          <span className="underline">{name}!</span> you forgot some products...
      </h3>}
        {Object.keys(lastUserOrder).length > 0 && <h3>
          Your last purchase was at {moment(lastUserOrder.order_date).format('MMMM Do YYYY, h:mm:ss a')}
        </h3>}
      </div>
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle3"></div>
    </div>;
  }
}

const mapStateToProps = state => ({
  userStatus: state.userStatus
})

export default connect(mapStateToProps)(withRouter(About))