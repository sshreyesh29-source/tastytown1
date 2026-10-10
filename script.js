document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".food-card button");

    const cart = document.querySelector(".cart");
    const cartCount = document.querySelector(".cart span");

    const cartPanel = document.querySelector("#cartPanel");
    const cartItems = document.querySelector("#cartItems");
    const cartTotal = document.querySelector("#cartTotal");

    const closeCart = document.querySelector("#closeCart");
    const clearCart = document.querySelector("#clearCart");
    const placeOrder = document.querySelector("#placeOrder");
    const orderConfirmation =
        document.querySelector("#orderConfirmation");
    const customerName = document.querySelector("#customerName");
    const customerAddress = document.querySelector("#customerAddress");


    /* LOAD SAVED CART */

    let cartData = JSON.parse(
        localStorage.getItem("tastyTownItems")
    ) || [];


    /* UPDATE CART */

    function updateCart() {

        let totalItems = 0;
        let totalPrice = 0;

        cartItems.innerHTML = "";


        cartData.forEach(function (item, index) {

            totalItems += item.quantity;

            const itemTotal = item.price * item.quantity;

            totalPrice += itemTotal;


            const itemElement = document.createElement("div");

            itemElement.className = "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-controls">

                    <button
                        class="quantity-btn minus"
                        data-index="${index}">
                        −
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-btn plus"
                        data-index="${index}">
                        +
                    </button>

                </div>

                <div class="cart-item-price">
                    ₹${itemTotal}
                </div>

            `;


            cartItems.appendChild(itemElement);

        });


        cartCount.textContent = totalItems;

        cartTotal.textContent = totalPrice;


        localStorage.setItem(
            "tastyTownItems",
            JSON.stringify(cartData)
        );

    }


    /* ADD FOOD TO CART */

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            const foodCard =
                button.closest(".food-card");


            const name =
                foodCard.querySelector("h3").textContent;


            const priceText =
                foodCard.querySelector("strong").textContent;


            const price =
                Number(
                    priceText
                        .replace("₹", "")
                        .trim()
                );


            const existingItem =
                cartData.find(function (item) {

                    return item.name === name;

                });


            if (existingItem) {

                existingItem.quantity++;

            } else {

                cartData.push({

                    name: name,

                    price: price,

                    quantity: 1

                });

            }


            updateCart();


            button.textContent = "ADDED ✓";


            setTimeout(function () {

                button.textContent = "Add";

            }, 1000);

        });

    });


    /* PLUS / MINUS QUANTITY */

    cartItems.addEventListener("click", function (event) {

        if (
            !event.target.classList.contains(
                "quantity-btn"
            )
        ) {
            return;
        }


        const index =
            Number(
                event.target.dataset.index
            );


        if (
            event.target.classList.contains(
                "plus"
            )
        ) {

            cartData[index].quantity++;

        }


        if (
            event.target.classList.contains(
                "minus"
            )
        ) {

            cartData[index].quantity--;


            if (
                cartData[index].quantity <= 0
            ) {

                cartData.splice(index, 1);

            }

        }


        updateCart();

    });


    /* OPEN CART */

   cart.addEventListener("click", function (event) {

        event.preventDefault();

        cartPanel.classList.toggle("show");

        if (!cartPanel.classList.contains("show")) {
            orderConfirmation.classList.remove("show");
        }

    });


    /* CLOSE CART */

    closeCart.addEventListener("click", function () {

        cartPanel.classList.remove("show");

    });


    /* CLEAR CART */

    clearCart.addEventListener("click", function () {

        cartData = [];

        localStorage.removeItem(
            "tastyTownItems"
        );

        updateCart();

    });


    /* PLACE ORDER */

    placeOrder.addEventListener("click", function () {


        /* CHECK CART */

        if (cartData.length === 0) {

            alert("Your cart is empty.");

            return;

        }


        /* CHECK NAME */

        if (
            customerName.value.trim() === ""
        ) {

            alert("Please enter your name.");

            customerName.focus();

            return;

        }


        /* CHECK ADDRESS */

        if (
            customerAddress.value.trim() === ""
        ) {

            alert(
                "Please enter your delivery address."
            );

            customerAddress.focus();

            return;

        }


        /* CREATE WHATSAPP MESSAGE */

        let message =
            "Hello TastyTown!%0A%0A" +

            "Name: " +
            encodeURIComponent(
                customerName.value.trim()
            ) +

            "%0A" +

            "Address: " +
            encodeURIComponent(
                customerAddress.value.trim()
            ) +

            "%0A%0A" +

            "Order:%0A";


        /* ADD FOOD ITEMS */

        cartData.forEach(function (item) {

            message +=

                encodeURIComponent(
                    item.name
                ) +

                " × " +

                item.quantity +

                " - ₹" +

                (
                    item.price *
                    item.quantity
                ) +

                "%0A";

        });


        /* CALCULATE TOTAL */

        const total =
            cartData.reduce(
                function (sum, item) {

                    return sum +
                        (
                            item.price *
                            item.quantity
                        );

                },
                0
            );


        message +=
            "%0ATotal: ₹" +
            total;


        /* OPEN WHATSAPP */

       window.open(
    "https://wa.me/919035398248?text=" + message,
    "_blank"
    );

    orderConfirmation.classList.add("show");

    });


    /* SHOW SAVED CART */

    updateCart();

});