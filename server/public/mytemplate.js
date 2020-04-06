module.exports = (resultsSum, results, body) => {
    let trs = "";
    results.forEach(element => {
        trs += `<tr>
        <td>${element.product_name}</td>
        <td>${element.quantity}</td>
        <td>${element.sum_price}</td>
        </tr>`
    })

    return `<!DOCTYPE html>
<html>
<style>
    .title {
        text-align: center;
        text-decoration: underline;
    }

    table {
        margin: auto;
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 80%;
    }

    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }

    .center {
        text-align: center;
    }

    .userName {
        font-size: 20px;
        font-weight: bold;
        padding-left: 150px;
        padding-bottom: 20px;
    }

    .logo {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto;
    }
</style>

<body>
    <h2 class="title">Voucher:</h2>
    <div class="userName">
        Name: ${body.firstname} ${body.lastname}
        <div>Email: ${body.email}</div>
    </div>
    <table id = "myTable">
        <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
        
        ${trs}
    </table>

    <div id='ele'>
        <h3 class="center">Total Price : ${resultsSum[0].total_price}</h3>
    </div>
    <div class="center"><img src="https://www.bls.gov/spotlight/2017/sports-and-exercise/images/cover_image.jpg" class="logo" /></div>
    
</body>

</html>`}