let products = [];
let BASE_URL = 'https://5b2b636747a7720014ca8489.mockapi.io/list/Products';

// get API
let getAPI = async () => {
    try {
        let products = await axios({
            method: 'GET',
            url: BASE_URL,
        })
        document.querySelector(".admin .table tbody").innerHTML = renderProduct(products.data)
    } catch (error) {
        console.log("error: ", error);
    }
}
getAPI();

// render product
let renderProduct = (arr = products) => {
    let content = ''
    for (let item of arr) {
        content += `
    <tr>
      <td class="img"><img src='${item.img}'/></td>
      <td class="name">${item.name}</td>
      <td class=desc"">${item.desc}</td>
      <td class="price">${item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
      <td>
        <button class="btn btn-danger">Xoá</button>
        <button class="btn btn-warning">Sửa</button>
      </td>
    </tr>
    `
    }
    return content;
}

// 