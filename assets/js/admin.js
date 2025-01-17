let products = [];
let BASE_URL = "https://5b2b636747a7720014ca8489.mockapi.io/list/Products";

// hide modal
let hideModal = () => {
    var myModalEl = document.getElementById('exampleModal');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}

// get info product
let getInfoProduct = (temp) => {
    let itemProduct = new Product();
    let arrInput = document.querySelectorAll('.modal input , .modal select');
    let flagCkeck = true;
    let checkEmplyValue = true;
    for (let input of arrInput) {
        const { id, value } = input
        itemProduct[id] = value
        let elem = document.getElementById("tb_" + id);
        if ((temp != "1" && id == "idProduce") || (id !== "idProduce")) {
            checkEmplyValue = checkEmpty(elem, value);
        }
        flagCkeck &= checkEmplyValue
        if (!checkEmplyValue) {
            continue
        }
    }
    if (flagCkeck) {
        return itemProduct;
    }
};

// get API
let getAPI = async () => {
    try {
        let products = await axios({
            method: "GET",
            url: BASE_URL,
        });
        document.querySelector(".admin .table tbody").innerHTML = renderProduct(
            products.data
        );
    } catch (error) {
        console.log("error: ", error);
    }
};
getAPI();

// render product
let renderProduct = (arr = products) => {
    let content = "";
    for (let item of arr) {
        content += `
    <tr>
      <td class="img"><img src='${item.img}'/></td>
      <td class="name">${item.name}</td>
      <td class=desc"">${item.desc}</td>
      <td class="price">${Number(item.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        })}</td>
      <td>
        <button class="btn btn-danger" onclick="removeProduct('${item.id
            }')">Xoá</button>
        <button class="btn btn-warning" data-bs-toggle="modal"
                data-bs-target="#exampleModal" onclick="editProduct('${item.id}')">Sửa</button>
      </td>
    </tr>
    `;
    }
    return content;
};

// delete product
let removeProduct = async (id) => {
    if (confirm(`Delete product has ID: ${id} !`) == true) {
        try {
            let products = await axios({
                method: "DELETE",
                url: `${BASE_URL}/${id}`,
            });
            getAPI();
            showError("Deleta success !");
        } catch (error) {
            showError("Deleta fail !");
        }
    } else {
        return;
    }
};

// add product
let addProduct = async () => {
    let infoProduct = getInfoProduct("1");
    if (!infoProduct) {
        return false;
    }
    try {
        let getProductAPI = await axios({
            method: "POST",
            url: BASE_URL,
            data: infoProduct
        })
        getAPI();
        hideModal();
        showError('Add product success!')
    } catch (error) {
        showError('Add product fail!')
    }
};

document.querySelector(".btn-add").onclick = addProduct;
document.querySelector(".btn-addnew").onclick = function () {
    document.getElementById("formProd").reset();
    document.querySelector(".btn-update").setAttribute("disabled", "");
    document.querySelector(".btn-add").removeAttribute("disabled", "");
    document.getElementById("formProd").reset();
    let arrSpan = document.querySelectorAll("#formProd span")
    for (let span of arrSpan) {
        span.style.display = "none"
    }
};

// edit product
let editProduct = async (id) => {
    document.querySelector(".btn-add").setAttribute("disabled", "");
    document.querySelector(".btn-update").removeAttribute("disabled", "");
    let arrSpan = document.querySelectorAll("#formProd span")
    for (let span of arrSpan) {
        span.style.display = "none"
    }
    try {
        let getApiProd = await axios({
            method: 'GET',
            url: `${BASE_URL}/${id}`
        })
        let result = getApiProd.data
        let arrInput = document.querySelectorAll('.modal input , .modal select');
        for (let input of arrInput) {
            input.value = result[input.id]
        }
        document.getElementById("idProduce").value = id
    } catch (error) {
        console.log("error: ", error);
    }
}

// update product
let updateProduct = async () => {
    let infoProduct = getInfoProduct();
    if (!infoProduct) {
        return false;
    }
    let id = document.getElementById("idProduce").value;
    try {
        let getApiProd = await axios({
            method: "PUT",
            url: `${BASE_URL}/${id}`,
            data: infoProduct,
        });
        getAPI();
        hideModal();
        showError("Update product success!");

    } catch (error) {
        console.log("error: ", error);
    }
};

document.querySelector(".btn-update").onclick = updateProduct;

// sort price
lowHightFilter = (vals) => {
    return vals.sort((a, b) => {
        const aPrice = parseFloat(a.price);
        const bPrice = parseFloat(b.price);
        return aPrice - bPrice;
    });
};
hightLowFilter = (vals) => {
    return vals.sort((a, b) => {
        const aPrice = parseFloat(a.price);
        const bPrice = parseFloat(b.price);
        return bPrice - aPrice;
    });
};

// sort product
let sortPrice = async () => {
    let select = document.getElementById("selectSort").value;
    console.log("select: ", select);
    try {
        let getAPIProd = await axios({
            method: "GET",
            url: BASE_URL,
        });
        switch (select) {
            case "hightLow":
                let productHL = hightLowFilter(getAPIProd.data);
                document.querySelector(".admin .table tbody").innerHTML =
                    renderProduct(productHL);
                break;
            case "lowHight":
                let productLH = lowHightFilter(getAPIProd.data);
                document.querySelector(".admin .table tbody").innerHTML =
                    renderProduct(productLH);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log("error: ", error);
    }
};
document.getElementById("selectSort").onchange = sortPrice;

//filter product
let fiterProduct = async () => {
    let textInput = document.getElementById("search").value;
    let textSearch = removeVietnameseTones(textInput).toLowerCase();
    try {
        let getAPIProd = await axios({
            method: "GET",
            url: BASE_URL,
        });
        let prodResult = getAPIProd.data.filter((prod, index) => {
            return removeVietnameseTones(prod.name)
                .toLowerCase()
                .includes(textSearch);
        });
        document.querySelector(".admin .table tbody").innerHTML =
            renderProduct(prodResult);
    } catch (error) {
        console.log("error: ", error);
    }
};
document.getElementById("btnSearch").onclick = fiterProduct;