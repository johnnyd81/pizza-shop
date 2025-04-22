//required DOM variables for the application
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let close = document.querySelector("#close-cart");
let cartContainer = document.querySelector(".cart-box");
let productContainer = document.querySelector(".product-container");
let totalCartPrice = document.querySelector(".total-price");
let addMessage = document.querySelector(".add-msg");

//opens the hidden cart component when the cart navigation icon is clicked by the user
//items can be removed from the cart using this component and are updated in real time
cartIcon.onclick = function () {
  cart.classList.add("active");
  //two functions below update the cart items and total price
  displayCart();
  displayCartPrice();
};

// closes the cart component when it is clicked by the user
close.onclick = function () {
  //the classList.remove method removes the "active" class from the cart component thereby closing the cart
  cart.classList.remove("active");
};

//when the user clicks anywhere on the productContainer the cart will close
productContainer.onclick = function () {
  cart.classList.remove("active");
};

//the function below shows a message and removes it after 3 seconds using the setTimeout method
function addMsg() {
  addMessage.classList.add("active");
  setTimeout(() => {
    addMessage.classList.remove("active");
  }, 3000);
}

// array that contains the details of each pizza available in the application stored as an object literal
let pizzas = [
  {
    title: "Bbq chicken",
    price: 85,
    pic: "images/bbq_chicken.jpeg",
    tag: "bbq_chicken",
    inCart: 0,
  },
  {
    title: "Cheesesteak",
    price: 95,
    pic: "images/cheesesteak_pizza.jpeg",
    tag: "cheesesteak",
    inCart: 0,
  },
  {
    title: "Chicken Mushroom",
    price: 100,
    pic: "images/chicken_mushroom.jpeg",
    tag: "chicken_mushroom",
    inCart: 0,
  },
  {
    title: "Margherita",
    price: 80,
    pic: "images/margherita.jpeg",
    tag: "margherita",
    inCart: 0,
  },
  {
    title: "Pepperoni",
    price: 92,
    pic: "images/pepperoni.jpeg",
    tag: "pepperoni",
    inCart: 0,
  },
  {
    title: "Spicy chicken",
    price: 88,
    pic: "images/spicy_chicken.jpeg",
    tag: "spicy_chicken",
    inCart: 0,
  },
  {
    title: "Vegetarian 1",
    price: 79,
    pic: "images/vegi_pizza.jpeg",
    tag: "vegi_1",
    inCart: 0,
  },
  {
    title: "Vegetarian 2",
    price: 84,
    pic: "images/vegi_pizza2.jpeg",
    tag: "vegi_2",
    inCart: 0,
  },
];

//gets all the add-cart buttons in the DOM and stores it in a nodelist i.e. array-like data structure
//a nodelist is similar to an array as it is iterable using a for loop
let addCartBtns = document.querySelectorAll(".add-cart");

//by looping over the nodelist each button gets a click handler that calls two functions
//the first function increases the cartNumbers by one and adds the new item to the cartItems object in sessionStorage
//the second function takes the cost of the specific item and adds it to the totalCost of the cart
for (let i = 0; i < addCartBtns.length; i++) {
  addCartBtns[i].addEventListener("click", function () {
    cartNumbers(pizzas[i]);
    totalCost(pizzas[i]);
    addMsg();
  });
}

//cartNumbers keeps track of the amount of items in the cart
//the amount is stored in the browser's sessionStorage 
function cartNumbers(product) {
  let cartNumbers = sessionStorage.getItem("cartNumbers");
  cartNumbers = parseInt(cartNumbers);
  
//if cartNumbers has a value add 1 to the existing value
  if (cartNumbers) {
    sessionStorage.setItem("cartNumbers", cartNumbers + 1);
    document.querySelector(".pizza_count").textContent = cartNumbers + 1;
    
    //if cartNumbers doesn't have a value then make it's value 1
  } else {
    sessionStorage.setItem("cartNumbers", 1);
    document.querySelector(".pizza_count").textContent = 1;
  }

  setItem(product);
}

//cartLoad makes sure the correct amount of items in the cart are displayed when the page loads
function cartLoad() {
  let cartNumbers = sessionStorage.getItem("cartNumbers");
  cartNumbers = parseInt(cartNumbers);

  if (cartNumbers) {
    document.querySelector(".pizza_count").textContent = cartNumbers;
  } else {
    document.querySelector(".pizza_count").textContent = 0;
  }
}

//the setItem function is called whenever an item is added to the cart
//the item is stored in an object in sessionStorage i.e. cartItems
function setItem(product) {
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems"));

  if (cartItems != null) {
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
      //the line below makes sure that the initial inCart amount is 0
      cartItems[product.tag].inCart = 0;
    }
    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }

  //stores the cartItems in sessionStorage in a stringified format
  sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// display the cartitem price if the user has added any pizzas to the cart
function displayCartPrice() {
  let cartCost = sessionStorage.getItem("cartCost");
  cartCost = parseInt(cartCost);

  if (cartCost) {
    totalCartPrice.textContent = `R ${cartCost}, 00`;
  } else {
    totalCartPrice.textContent = `R 0, 00`;
  }
}

//the totalCost function calculates the total cost of the cart and stores it in sessionStorage
//the value can then be used to display the final total to the user
function totalCost(product) {
  let cartCost = sessionStorage.getItem("cartCost");
  cartCost = parseInt(cartCost);

  if (cartCost) {
    sessionStorage.setItem("cartCost", cartCost + product.price);
  } else {
    sessionStorage.setItem("cartCost", product.price);
  }
}

//displays the content of the cart
function displayCart() {
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems"));

  if (cartItems && cartContainer) {
    cartContainer.innerHTML = ""; //clears the cartContainer to make sure that each render of the cart is up to date
    Object.values(cartItems).map((item) => {
      cartContainer.innerHTML += `
       <div class="cart-item" id=${item.tag}>
         <div class="cart-detail">
          <img src=${item.pic} class="cart-img" />
          <div class="cartInfo">
            <p>${item.title}</p>
            <p>Price: R ${item.price * item.inCart}, 00</p>
            <input type="number" min="1" value=${
              item.inCart
            } class="cart-inCart ${item.tag} edit"/><br/>
            <div class="action">
            <i class='bx bxs-trash-alt delete ${item.tag}'></i>
            </div>
           </div>
         </div> 
       </div>
      `;
    });
  }
}

//deletes item from the cart
cartContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    adjustValues(e.target.classList[3], e.target.classList[2]);
    displayCart();
    displayCartPrice();
    cartLoad();
  }
});

//adjust values in the cart i.e. amount of items
function adjustValues(key, action) {
  let cartItems = JSON.parse(sessionStorage.getItem("cartItems"));
  let cartNumbers = sessionStorage.getItem("cartNumbers");
  let cartCost = sessionStorage.getItem("cartCost");
  cartNumbers = parseInt(cartNumbers);
  cartCost = parseInt(cartCost);

  for (let item in cartItems) {
    if (item == key && action == "delete") {
      cartNumbers = cartNumbers - cartItems[item].inCart;
      cartCost = cartCost - cartItems[item].price * cartItems[item].inCart;
      delete cartItems[item];
    }
  }

  sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  sessionStorage.setItem("cartNumbers", JSON.stringify(cartNumbers));
  sessionStorage.setItem("cartCost", JSON.stringify(cartCost));
}

cartLoad();
