
export function fieldsCounter(obj) {
    let count = 0;
    for (var f in obj) {//count how many field are filled
        if (obj[f]) {
            ++count;
        }
    }
    return count
}

export async function getUserDetailsAndCartId() {
    let response = await fetch(`http://localhost/auth/${localStorage.email}`);
    let data = await response.json()
    if (data.length === 0) {
        return []
    }
    let response2 = await fetch(`http://localhost/products/cart/${data[0] && data[0].Identity_num}`);//looking for open cart, if there is no open, we need to open new cart
    let data2 = await response2.json()
    let openCart = data2.filter(cart => cart.isDone == 0)[0] || []

    return [data[0], openCart.cart_id || 'no-open-cart']
}

export async function getNewCartId(idnum) {
    let response = await fetch(`http://localhost/products/getcartid/${idnum}`);
    let data = await response.json()
    if (data[0]) {
        return data[0].cart_id;
    } else {
        return
    }
}

export async function getInvoice(e, openNewTab) {
    fetch(`http://localhost/products/invoice`, { responseType: 'blob' })
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            if (openNewTab) {// case we want to open new tab with pdf and not to save file
                let newWindow = window.open('/')
                newWindow.location = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                var link = document.createElement('a');
                link.href = url
                link.setAttribute('download', `Voucher.pdf`);
                // 3. Append to html page
                document.body.appendChild(link);
            } else {// case we want to save pdf file
                var url = URL.createObjectURL(new Blob([blob]));
                var link = document.createElement('a');
                link.href = url
                link.setAttribute('download', `Voucher.pdf`);
                // 3. Append to html page
                document.body.appendChild(link);
                // 4. Force download
                link.click();
            }
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);
        });
}

export async function generateVoucher(userCartId, userDetails) {
    debugger
    try{
        let response = await fetch(`http://localhost/products/download/${userCartId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname: userDetails.firstname, lastname: userDetails.lastname, email: userDetails.email })
        });
        let data = await response.json()
    }catch(err){
        console.log(err,"thisis what")
        debugger
    }
    
}

export async function getCategories() {
    let response = await fetch(`http://localhost/products/category`);
    let data = await response.json()
    return data
}
//to delete storage need to pass this.props
export function deleteStorageDirectLogin(props) {
    alert('Required token!')
    localStorage.clear();
    props.history.push('/login')
}

export async function productsCounterUser(email) {
    let response = await fetch(`http://localhost/products/openreservation/${email}`);
    let data = await response.json()
    return data
}

export async function allCompletedOrdersForUser(email) {
    let response = await fetch(`http://localhost/products/allreservations/${email}`);
    let data = await response.json()
    return data
}

