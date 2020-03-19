import React from 'react';

class About extends React.Component {

  state = { productsNum: 0, ordersNum: 0 }

  componentDidMount() {
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
  }

  render() {
    const { productsNum, ordersNum } = this.state;
    return <div className="storeInfoPage">
      <h1 className="storeInfoTitle">Store Information</h1>
      <div className="numOfProducts">Availble products of Megasport : {productsNum}</div>
      <div className="numOfProducts">Orders completed of Megasport : {ordersNum}</div>
    </div>;
  }
}

export default About