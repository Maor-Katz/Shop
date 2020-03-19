function fieldsCounter(obj) {
    let count = 0;
    for (var f in obj) {//count how many field are filled
        if (obj[f]) {
            ++count;
        }
    }
    return count
}


module.exports = {
    fieldsCounter
}