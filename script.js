// Elementos DOM
const loginBtn = document.getElementById("loginBtn")
const registerBtn = document.getElementById("registerBtn")
const loginModal = document.getElementById("loginModal")
const registerModal = document.getElementById("registerModal")
const closeBtns = document.querySelectorAll(".close-btn")
const showRegisterBtn = document.getElementById("showRegisterBtn")
const showLoginBtn = document.getElementById("showLoginBtn")
const exploreBtn = document.getElementById("exploreBtn")
const contactForm = document.getElementById("contactForm")
const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const scrollTopBtn = document.getElementById("scrollTop")
const header = document.getElementById("header")

// Elementos de navegación entre páginas
const mainPage = document.getElementById("main-page")
const tablasPage = document.getElementById("tablas-page")
const vestimentaPage = document.getElementById("vestimenta-page")
const homeLink = document.getElementById("home-link")
const backFromTablas = document.getElementById("back-from-tablas")
const backFromVestimenta = document.getElementById("back-from-vestimenta")

// Elementos del carrito
const cartIcon = document.getElementById("cartIcon")
const cartDropdown = document.getElementById("cartDropdown")
const cartClose = document.getElementById("cartClose")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")
const cartTotal = document.getElementById("cartTotal")
const cartEmpty = document.getElementById("cartEmpty")

// Elementos para el proceso de pago
const viewCartBtn = document.getElementById("viewCartBtn")
const checkoutBtn = document.getElementById("checkoutBtn")
const cartPageModal = document.getElementById("cartPageModal")
const cartPageClose = document.querySelector(".cart-page-close")
const cartPageItems = document.getElementById("cartPageItems")
const cartPageSubtotal = document.getElementById("cartPageSubtotal")
const cartPageTotal = document.getElementById("cartPageTotal")
const cartPageCheckoutBtn = document.getElementById("cartPageCheckoutBtn")
const continueShopping = document.getElementById("continueShopping")

const checkoutModal = document.getElementById("checkoutModal")
const checkoutClose = document.querySelector(".checkout-close")
const checkoutCartItems = document.getElementById("checkoutCartItems")
const checkoutTotal = document.getElementById("checkoutTotal")

const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const step3 = document.getElementById("step3")

const section1 = document.getElementById("section1")
const section2 = document.getElementById("section2")
const section3 = document.getElementById("section3")

const backToCart = document.getElementById("backToCart")
const goToPayment = document.getElementById("goToPayment")
const backToShipping = document.getElementById("backToShipping")
const completeOrder = document.getElementById("completeOrder")

const paymentMethods = document.querySelectorAll(".payment-method")
const creditCardForm = document.querySelector(".credit-card-form")

const loadingOverlay = document.getElementById("loadingOverlay")

const orderNumber = document.getElementById("orderNumber")
const orderDate = document.getElementById("orderDate")
const orderTotal = document.getElementById("orderTotal")
const orderPaymentMethod = document.getElementById("orderPaymentMethod")

// Variables globales
let cart = []

// Función para mostrar/ocultar páginas
function showPage(pageId) {
  const pages = ["main-page", "tablas-page", "vestimenta-page"]
  pages.forEach((page) => {
    const element = document.getElementById(page)
    if (element) {
      element.style.display = page === pageId ? "block" : "none"
    }
  })
  window.scrollTo(0, 0)
}

// Función para mostrar/ocultar modales
function showModal(modal) {
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }
}

function hideModal(modal) {
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restaurar scroll del body
  }
}

function hideAllModals() {
  const modals = document.querySelectorAll('.product-modal');
  modals.forEach(modal => hideModal(modal));
}

// Función para actualizar el carrito
function updateCart() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")
  const cartEmpty = document.getElementById("cartEmpty")

  // Actualizar contador
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Limpiar items
  if (cartItems) {
    cartItems.innerHTML = ""

    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = "block"
      if (cartTotal) cartTotal.textContent = "$0.00"
    } else {
      if (cartEmpty) cartEmpty.style.display = "none"

      let total = 0
      cart.forEach((item) => {
        const subtotal = item.price * item.quantity
        total += subtotal

        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"
        cartItem.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.img}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
              <input type="text" class="quantity-input" value="${item.quantity}" readonly>
              <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
              <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></span>
            </div>
          </div>
        `
        cartItems.appendChild(cartItem)
      })

      if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`

      // Agregar event listeners a los botones
      addCartEventListeners()
    }
  }

  // Actualizar otras vistas del carrito
  updateCartPage()
  updateCheckoutSummary()
}

// Función para agregar event listeners del carrito
function addCartEventListeners() {
  document.querySelectorAll(".minus-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      decreaseQuantity(id)
    })
  })

  document.querySelectorAll(".plus-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      increaseQuantity(id)
    })
  })

  document.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      removeFromCart(id)
    })
  })
}

// Funciones del carrito
function addToCart(id, name, price, img) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id,
      name,
      price: Number.parseFloat(price),
      img,
      quantity: 1,
    })
  }

  updateCart()

  // Mostrar dropdown del carrito
  const cartDropdown = document.getElementById("cartDropdown")
  if (cartDropdown) {
    cartDropdown.classList.add("active")
    setTimeout(() => {
      cartDropdown.classList.remove("active")
    }, 3000)
  }
}

function increaseQuantity(id) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += 1
    updateCart()
  }
}

function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity -= 1
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      updateCart()
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  updateCart()
}

// Función para actualizar la página completa del carrito
function updateCartPage() {
  const cartPageItems = document.getElementById("cartPageItems")
  const cartPageSubtotal = document.getElementById("cartPageSubtotal")
  const cartPageTotal = document.getElementById("cartPageTotal")

  if (!cartPageItems) return

  cartPageItems.innerHTML = ""
  let subtotal = 0

  cart.forEach((item) => {
    const itemSubtotal = item.price * item.quantity
    subtotal += itemSubtotal

    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td data-label="Producto">
        <div class="cart-page-product">
          <div class="cart-page-img">
            <img src="${item.img}" alt="${item.name}">
          </div>
          <div class="cart-page-name">${item.name}</div>
        </div>
      </td>
      <td data-label="Precio" class="cart-page-price">$${item.price.toFixed(2)}</td>
      <td data-label="Cantidad">
        <div class="cart-page-quantity">
          <button class="cart-page-quantity-btn cart-page-minus-btn" data-id="${item.id}">-</button>
          <input type="text" class="cart-page-quantity-input" value="${item.quantity}" readonly>
          <button class="cart-page-quantity-btn cart-page-plus-btn" data-id="${item.id}">+</button>
        </div>
      </td>
      <td data-label="Subtotal" class="cart-page-subtotal">$${itemSubtotal.toFixed(2)}</td>
      <td data-label="Eliminar">
        <div class="cart-page-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></div>
      </td>
    `
    cartPageItems.appendChild(tr)
  })

  if (cartPageSubtotal) cartPageSubtotal.textContent = `$${subtotal.toFixed(2)}`
  if (cartPageTotal) cartPageTotal.textContent = `$${(subtotal + 10).toFixed(2)}`

  // Agregar event listeners para la página del carrito
  addCartPageEventListeners()
}

// Event listeners para la página del carrito
function addCartPageEventListeners() {
  document.querySelectorAll(".cart-page-minus-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      decreaseQuantity(id)
    })
  })

  document.querySelectorAll(".cart-page-plus-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      increaseQuantity(id)
    })
  })

  document.querySelectorAll(".cart-page-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id")
      removeFromCart(id)
    })
  })
}

// Función para actualizar el resumen del checkout
function updateCheckoutSummary() {
  const checkoutCartItems = document.getElementById("checkoutCartItems")
  const checkoutTotal = document.getElementById("checkoutTotal")
  const orderTotal = document.getElementById("orderTotal")

  if (!checkoutCartItems) return

  checkoutCartItems.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity
    total += subtotal

    const summaryItem = document.createElement("div")
    summaryItem.className = "summary-item"
    summaryItem.innerHTML = `
      <div class="summary-item-name">
        <div class="summary-item-quantity">${item.quantity}</div>
        ${item.name}
      </div>
      <div>$${subtotal.toFixed(2)}</div>
    `
    checkoutCartItems.appendChild(summaryItem)
  })

  // Agregar envío
  const shippingItem = document.createElement("div")
  shippingItem.className = "summary-item"
  shippingItem.innerHTML = `
    <div>Envío</div>
    <div>$10.00</div>
  `
  checkoutCartItems.appendChild(shippingItem)

  if (checkoutTotal) checkoutTotal.textContent = `$${(total + 10).toFixed(2)}`
  if (orderTotal) orderTotal.textContent = `$${(total + 10).toFixed(2)}`
}

// Función para mostrar una página de categoría específica
function showCategoryPage(category) {
    if (category === 'tablas') {
        mainPage.style.display = 'none';
        tablasPage.style.display = 'block';
        vestimentaPage.style.display = 'none';
    } else if (category === 'vestimenta') {
        mainPage.style.display = 'none';
        tablasPage.style.display = 'none';
        vestimentaPage.style.display = 'block';
    }
    window.scrollTo(0, 0);
}

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const closeBtns = document.querySelectorAll(".close-btn")
  const showRegisterBtn = document.getElementById("showRegisterBtn")
  const showLoginBtn = document.getElementById("showLoginBtn")
  const exploreBtn = document.getElementById("exploreBtn")
  const contactForm = document.getElementById("contactForm")
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const scrollTopBtn = document.getElementById("scrollTop")
  const header = document.getElementById("header")

  // Navegación
  const homeLink = document.getElementById("home-link")
  const backFromTablas = document.getElementById("back-from-tablas")
  const backFromVestimenta = document.getElementById("back-from-vestimenta")

  // Carrito
  const cartIcon = document.getElementById("cartIcon")
  const cartDropdown = document.getElementById("cartDropdown")
  const cartClose = document.getElementById("cartClose")
  const viewCartBtn = document.getElementById("viewCartBtn")
  const checkoutBtn = document.getElementById("checkoutBtn")
  const cartPageModal = document.getElementById("cartPageModal")
  const cartPageClose = document.querySelector(".cart-page-close")
  const cartPageCheckoutBtn = document.getElementById("cartPageCheckoutBtn")
  const continueShopping = document.getElementById("continueShopping")

  // Checkout
  const checkoutModal = document.getElementById("checkoutModal")
  const checkoutClose = document.querySelector(".checkout-close")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  const step3 = document.getElementById("step3")
  const section1 = document.getElementById("section1")
  const section2 = document.getElementById("section2")
  const section3 = document.getElementById("section3")
  const backToCart = document.getElementById("backToCart")
  const goToPayment = document.getElementById("goToPayment")
  const backToShipping = document.getElementById("backToShipping")
  const completeOrder = document.getElementById("completeOrder")
  const paymentMethods = document.querySelectorAll(".payment-method")
  const creditCardForm = document.querySelector(".credit-card-form")
  const loadingOverlay = document.getElementById("loadingOverlay")
  const orderNumber = document.getElementById("orderNumber")
  const orderDate = document.getElementById("orderDate")
  const orderPaymentMethod = document.getElementById("orderPaymentMethod")

  // Event Listeners para navegación
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault()
      showPage("main-page")
    })
  }

  if (backFromTablas) {
    backFromTablas.addEventListener("click", (e) => {
      e.preventDefault()
      showPage("main-page")
    })
  }

  if (backFromVestimenta) {
    backFromVestimenta.addEventListener("click", (e) => {
      e.preventDefault()
      showPage("main-page")
    })
  }

  // Event listeners para categorías
  const categoryBtns = document.querySelectorAll(".category-btn")
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category")
      showCategoryPage(category)
    })
  })

  // Event listeners para enlaces del footer
  const footerCategoryLinks = document.querySelectorAll(".footer-category")
  footerCategoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const category = link.getAttribute("data-category")
      showCategoryPage(category)
    })
  })

  // Event listener para explorar
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      const categoriesSection = document.getElementById("categories")
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: "smooth" })
      }
    })
  }

  // Event listeners para modales de login/registro
  if (loginBtn) {
    loginBtn.addEventListener("click", () => showModal(loginModal))
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => showModal(registerModal))
  }

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault()
      hideModal(loginModal)
      showModal(registerModal)
    })
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      hideModal(registerModal)
      showModal(loginModal)
    })
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      hideModal(loginModal)
      hideModal(registerModal)
    })
  })

  // Event listeners para modales de productos
  const tablaCards = document.querySelectorAll(".tabla-card")
  tablaCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest('.tabla-btn')) {
        const category = card.getAttribute("data-category")
        const modal = document.getElementById(`${category}-modal`)
        if (modal) {
          modal.style.display = "flex"
        }
      }
    })
  })

  const vestimentaCards = document.querySelectorAll(".vestimenta-card")
  vestimentaCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest('.vestimenta-btn')) {
        const category = card.getAttribute("data-category")
        const modal = document.getElementById(`${category}-modal`)
        if (modal) {
          modal.style.display = "flex"
        }
      }
    })
  })

  // Cerrar modales de productos
  const productModalCloseBtns = document.querySelectorAll(".product-modal-close")
  productModalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest('.product-modal')
      hideModal(modal)
    })
  })

  // Event listeners para formularios
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.")
      contactForm.reset()
    })
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Inicio de sesión exitoso.")
      hideModal(loginModal)
      loginForm.reset()
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const password = document.getElementById("registerPassword").value
      const confirmPassword = document.getElementById("registerConfirmPassword").value

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.")
        return
      }

      alert("Registro exitoso. ¡Bienvenido a Nauticshop!")
      hideModal(registerModal)
      registerForm.reset()
    })
  }

  // Event listeners para el carrito
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation()
      cartDropdown.classList.toggle("active")
    })
  }

  if (cartClose) {
    cartClose.addEventListener("click", () => {
      cartDropdown.classList.remove("active")
    })
  }

  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", () => {
      cartDropdown.classList.remove("active")
      showModal(cartPageModal)
    })
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de proceder al pago.")
        return
      }
      cartDropdown.classList.remove("active")
      showModal(checkoutModal)
    })
  }

  if (cartPageClose) {
    cartPageClose.addEventListener("click", () => hideModal(cartPageModal))
  }

  if (cartPageCheckoutBtn) {
    cartPageCheckoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de proceder al pago.")
        return
      }
      hideModal(cartPageModal)
      showModal(checkoutModal)
    })
  }

  if (continueShopping) {
    continueShopping.addEventListener("click", (e) => {
      e.preventDefault()
      hideModal(cartPageModal)
    })
  }

  // Event listeners para checkout
  if (checkoutClose) {
    checkoutClose.addEventListener("click", () => hideModal(checkoutModal))
  }

  if (backToCart) {
    backToCart.addEventListener("click", () => {
      hideModal(checkoutModal)
      showModal(cartPageModal)
    })
  }

  if (goToPayment) {
    goToPayment.addEventListener("click", () => {
      const shippingForm = document.getElementById("shippingForm")
      if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity()
        return
      }

      section1.classList.remove("active")
      section2.classList.add("active")
      step1.classList.remove("active")
      step1.classList.add("completed")
      step2.classList.add("active")
    })
  }

  if (backToShipping) {
    backToShipping.addEventListener("click", () => {
      section2.classList.remove("active")
      section1.classList.add("active")
      step2.classList.remove("active")
      step1.classList.remove("completed")
      step1.classList.add("active")
    })
  }

  // Event listeners para métodos de pago
  paymentMethods.forEach((method) => {
    method.addEventListener("click", () => {
      paymentMethods.forEach((m) => m.classList.remove("selected"))
      method.classList.add("selected")

      const paymentMethod = method.getAttribute("data-method")

      if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
        if (creditCardForm) creditCardForm.classList.add("active")
      } else {
        if (creditCardForm) creditCardForm.classList.remove("active")
      }

      const methodNames = {
        "credit-card": "Tarjeta de Crédito",
        "debit-card": "Tarjeta de Débito",
        paypal: "PayPal",
        "bank-transfer": "Transferencia Bancaria",
      }

      if (orderPaymentMethod) {
        orderPaymentMethod.textContent = methodNames[paymentMethod] || "Tarjeta de Crédito"
      }
    })
  })

  if (completeOrder) {
    completeOrder.addEventListener("click", async function() {
      // Mostrar overlay de carga
      loadingOverlay.style.display = "flex";

      try {
        // Obtener el total del carrito
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Procesar el pago con Stripe
        const paymentMethodId = await window.stripeHandler.handlePayment(total * 100); // Stripe usa centavos
        
        if (!paymentMethodId) {
          throw new Error('El pago falló');
        }

        // Aquí normalmente enviarías el paymentMethodId a tu servidor para completar el pago
        // Por ahora, simularemos una respuesta exitosa
        
        // Actualizar la información del pedido
        const orderId = 'NS-' + Math.floor(Math.random() * 10000);
        const currentDate = new Date().toLocaleDateString();
        
        // Actualizar elementos del DOM
        orderNumber.textContent = orderId;
        orderDate.textContent = currentDate;
        orderTotal.textContent = `$${total.toFixed(2)}`;
        orderPaymentMethod.textContent = 'Tarjeta de Crédito';
        
        // Limpiar el carrito
        cart = [];
        updateCart();
        
        // Cambiar a la sección de confirmación
        section2.classList.remove("active");
        section3.classList.add("active");
        step2.classList.remove("active");
        step3.classList.add("active");
        
      } catch (error) {
        console.error('Error en el pago:', error);
        const errorElement = document.getElementById('card-errors');
        if (errorElement) {
          errorElement.textContent = 'Hubo un error al procesar el pago. Por favor, intente nuevamente.';
        }
      } finally {
        // Ocultar overlay de carga
        loadingOverlay.style.display = "none";
      }
    });
  }

  const continueShopping2 = document.getElementById("continueShopping2")
  if (continueShopping2) {
    continueShopping2.addEventListener("click", (e) => {
      e.preventDefault()
      hideModal(checkoutModal)
      showPage("main-page")
    })
  }

  // Event listener global para añadir al carrito
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      e.stopPropagation()
      const id = e.target.getAttribute("data-id")
      const name = e.target.getAttribute("data-name")
      const price = e.target.getAttribute("data-price")
      const img = e.target.getAttribute("data-img")
      addToCart(id, name, price, img)
    }
  })

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) hideModal(loginModal)
    if (e.target === registerModal) hideModal(registerModal)
    if (e.target === cartPageModal) hideModal(cartPageModal)
    if (e.target === checkoutModal) hideModal(checkoutModal)

    const productModals = document.querySelectorAll(".product-modal")
    productModals.forEach((modal) => {
      if (e.target === modal) hideModal(modal)
    })

    if (cartDropdown && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
      cartDropdown.classList.remove("active")
    }
  })

  // Scroll events
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("active")
    } else {
      scrollTopBtn.classList.remove("active")
    }

    if (window.scrollY > 50) {
      header.style.backgroundColor = "rgba(0, 102, 164, 0.95)"
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
    } else {
      header.style.backgroundColor = "#0066a4"
      header.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)"
    }
  })

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Inicializar
  updateCart()
  showPage("main-page")
})

// Event listeners para cerrar modales
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-modal')) {
        hideModal(e.target);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAllModals();
    }
});

// Función para crear el efecto de vuelo del producto
function createFlyingImage(productImg, startPos, endPos) {
    const flyingImg = document.createElement('img');
    flyingImg.src = productImg.src;
    flyingImg.className = 'cart-fly-item';
    flyingImg.style.position = 'fixed';
    flyingImg.style.left = `${startPos.x}px`;
    flyingImg.style.top = `${startPos.y}px`;
    document.body.appendChild(flyingImg);

    // Animación de vuelo
    const animation = flyingImg.animate([
        {
            transform: `translate(0, 0) scale(1)`,
            opacity: 1
        },
        {
            transform: `translate(${endPos.x - startPos.x}px, ${endPos.y - startPos.y}px) scale(0.2)`,
            opacity: 0
        }
    ], {
        duration: 800,
        easing: 'ease-in-out'
    });

    animation.onfinish = () => {
        flyingImg.remove();
        updateCartAnimation();
    };
}

// Función para actualizar la animación del carrito
function updateCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    
    // Animar el contador
    cartCount.classList.add('updating');
    setTimeout(() => cartCount.classList.remove('updating'), 500);
    
    // Animar el icono del carrito
    cartIcon.classList.add('added');
    setTimeout(() => cartIcon.classList.remove('added'), 750);
}

// Función para añadir efecto ripple al botón
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    button.appendChild(ripple);

    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.classList.add('clicked');
    
    ripple.addEventListener('animationend', () => {
        ripple.remove();
        button.classList.remove('clicked');
    });
}

// Función para mostrar el tick de confirmación
function showSuccessTick(button) {
    const tick = document.createElement('i');
    tick.className = 'fas fa-check success-tick';
    button.appendChild(tick);
    button.classList.add('success');
    
    setTimeout(() => {
        button.classList.remove('success');
        tick.remove();
    }, 1500);
}

// Event listeners para los botones de añadir al carrito
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Añadir efecto ripple
        addRippleEffect(this, e);
        
        // Obtener la imagen del producto
        const productCard = this.closest('.featured-product');
        const productImg = productCard.querySelector('.product-image');
        
        // Calcular posiciones
        const startPos = productImg.getBoundingClientRect();
        const cartIcon = document.querySelector('.cart-icon');
        const endPos = cartIcon.getBoundingClientRect();
        
        // Crear imagen voladora
        createFlyingImage(productImg, {
            x: startPos.left,
            y: startPos.top
        }, {
            x: endPos.left + endPos.width / 2,
            y: endPos.top + endPos.height / 2
        });
        
        // Mostrar tick de confirmación
        showSuccessTick(this);
    });
});
