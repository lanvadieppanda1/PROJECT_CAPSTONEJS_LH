let products = [];
let BASE_URL = 'https://5b2b636747a7720014ca8489.mockapi.io/list/Products';
let productsLocal = []
let cartLocal = loadCart(); // Load giỏ hàng từ localStorage
renderCart();

// get API
function getApi() {

  let promise = axios({
    // phương thức (method)
    method: "GET",
    // url (đường dẫn api)
    url: BASE_URL,
  });
  promise
    .then((res) => {
      console.log(res);
      products = res.data;
      renderCard();
    })
    .catch((err) => {
      alert(`Failed to fetch products: ${err.message}`);
    });
}
getApi();

// render list card
function renderCard(arr = products) {
  let content = "";
  arr.forEach((item, index) => {
    content += `
    <div class="col-md-3 mb-5">
      <div class="card text-center">
        <div class="card-img-top">
          <img src="${item.img}" alt="${item.name}" class="img-fluid"/>
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${Number(item.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
          <button class="btn btn-switch mx-auto btn-addtocart" onclick="addToCart('${item.id}')">Add to cart</button>
        </div>
      </div>
    </div>
    `;
  });
  // gọi tới câu lệnh dom để thực hiện hiển thị lên giao diện
  document.querySelector(".list-prod .row").innerHTML = content;
}

document.getElementById("selectFilter").onchange = function (e) {
  let filterPds;
  let type = e.target.value;
  if (type === "all") {
    filterPds = products; // Hiển thị tất cả sản phẩm nếu chọn "all"
  } else {
    filterPds = products.filter((product) => product.type === type);
  }
  renderCard(filterPds); // Hiển thị danh sách sản phẩm đã lọc
};

// add to cart
addToCart = (productId) => {
  const product = products.find(p => p.id === productId);
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  };

  const existingItem = cartLocal.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartLocal.push(cartItem);
  }

  renderCart();
  saveCart();
  quantityCard(); // Update số lượng sản phẩm trong giỏ hàng
}

function showToast() {
  const toastEl = document.getElementById("cart-toast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Hàm hiển thị thông báo toast khi thanh toán
function showToast2() {
  const toastEl = document.getElementById("cart-toast2");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Hàm hiển thị thông báo toast khi xóa sản phẩm khỏi giỏ hàng
function showToast3() {
  const toastEl = document.getElementById("cart-toast3");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function quantityCard() {
  let quantity = 0
  for (let item of cartLocal) {
    quantity += item.quantity
  }
  document.querySelector(".quantity").innerHTML = quantity
}

// Hàm hiển thị giỏ hàng
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");
  const itemPay = document.getElementById("btnPay");
  let totalPrice = 0;

  cartList.innerHTML = cartLocal
    .map(
      (item) => `
            <div class="col-12 mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Price: ${Number(item.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                        <p>Quantity: <button onclick="changeQuantityItem('${item.id
        }', -1)" class="btn btn-sm btn-outline-secondary">-</button> ${item.quantity
        } <button onclick="changeQuantityItem('${item.id
        }', 1)" class="btn btn-sm btn-outline-secondary">+</button></p>
                    </div>
                    <div>
                        <h5>
        ${Number(item.price * item.quantity).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h5>
                    </div>
                    <button onclick="removeFromCart('${item.id
        }')" class="btn btn-sm btn-outline-danger"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `
    )
    .join("");

  cartLocal.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  if (totalPrice > 0) {
    totalPriceEl.innerText = `Tổng tiền: ${totalPrice.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    })}`;
    itemPay.disabled = false;
  } else {
    totalPriceEl.innerText = "Looks Like You Haven't Added Any Product In The Cart";
    itemPay.disabled = true;
  }
  quantityCard(); // Update số lượng sản phẩm trong giỏ hàng

}

changeQuantityItem = (productId, val) => {
  let item = cartLocal.find((i) => i.id === productId);
  if (item) {
    item.quantity += val;
    if (item.quantity < 1) {
      cartLocal = cartLocal.filter((item) => item.id !== productId);
      showToast3();
      saveCart();
      renderCart();
    }
    saveCart();
    renderCart();
    quantityCard(); // Update số lượng sản phẩm trong giỏ hàng
  }
};

window.removeFromCart = function (productId) {
  cartLocal = cartLocal.filter((item) => item.id !== productId);
  showToast3();
  saveCart();
  renderCart();
};

function saveCart() {
  localStorage.setItem("cartLocal", JSON.stringify(cartLocal));
}

function loadCart() {
  const storedCart = localStorage.getItem("cartLocal");
  return storedCart ? JSON.parse(storedCart) : [];
}

// Hàm xóa giỏ hàng
function clearCart() {
  cartLocal = [];
  saveCart();
  renderCart();
}

document.getElementById("btnPay").onclick = () => {
  clearCart(); // Clear giỏ hàng khi nhấn nút thanh toán
  showToast2();
}