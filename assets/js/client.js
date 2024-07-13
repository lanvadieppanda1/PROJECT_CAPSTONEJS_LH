let products = [];
let BASE_URL = 'https://5b2b636747a7720014ca8489.mockapi.io/list/Products';
let productsLocal = []

// get API
let getApi = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json();
    document.querySelector(".list-prod .row").innerHTML = renderCard()
  } catch (error) {
    alert(`Failed to load products: ${error.message}`);
  }
}
getApi()

// render list card
let renderCard = (arr = products) => {
  let content = "";
  for (let item of arr) {
    content += `
    <div class="col-md-3 mb-5">
      <div class="card text-center">
        <div class="card-img">
          <img src="${item.img}" alt="${item.name}" class="img-fluid"/>
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${Number(item.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
          <p class="card-text"><strong>Back Camera: </strong>${item.backCamera}</p>
          <p class="card-text"><strong>Front Camera: </strong>${item.frontCamera}</p>
          <p class="card-text"><strong>Type: </strong>${item.type}</p>
          <p class="card-text"><strong>Description: </strong>${item.desc}</p>
          <button class="btn btn-switch mx-auto btn-addtocart" onclick="addToCart('${item.name}')">Add to cart</button>
        </div>
      </div>
    </div>
    `
  }
  return content;
}

// filter type
async function filterName() {
  let selected = document.getElementById("selectFilter").value
  try {
    let getAPI = await axios({
      method: "GET",
      url: BASE_URL,
    })
    let listItem = getAPI.data.filter((item, index) => {
      if (selected === "all") {
        return item
      } else {
        return item.type.toLowerCase() === selected
      }
    })
    document.querySelector(".list-prod .row").innerHTML = renderCard(listItem)
  } catch (error) {
    console.log("error: ", error);
  }
}

document.getElementById("selectFilter").onchange = filterName

// add to cart
window.addToCart = function (productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1 // Số lượng mặc định là 1 khi thêm vào giỏ hàng
  };

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1; // Nếu có rồi thì tăng số lượng lên 1
  } else {
    cart.push(cartItem); // Nếu chưa có thì thêm vào giỏ hàng
  }

  renderCart();
}

window.addToCart = function (productId) {
  addToCart(productId);
  $('#cartModal').modal('show'); // Mở modal giỏ hàng
}
