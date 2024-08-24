const socket = io();

if(window.location.pathname === '/realTimeProducts'){
    socket.emit("message", "Real time products conectado!");
}

const containerProducts = document.getElementById("container-products");
const productsForm = document.getElementById("products-form");

socket.on("addProduct", (data) => {
    containerProducts.innerHTML += `
        <div class="card-product">
            <header class="card-header">            
                <div class="img-container">
                    <img src=${""} alt=${""}>
                </div>
            </header>
            <div class="card-content">
                <h3 class="title-product">${data.title}</h3>
                <p class="description-product">${data.description}</p>
                <p class="price-product">${data.price}</p>
            </div>
            <footer class="card-footer">
                <button id="btn-delete" class="btn-delete" data-id=${data.id}>Eliminar</button>
            </footer>
        </div>
    `;
});

socket.on("deleteProduct", (data) => {
    const product = document.querySelector(`[data-id="${data}"]`);
    product.parentElement.parentElement.remove();
});

productsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(productsForm);
    await fetch("/api/products", {
        method: "POST",
        body: formData,
    });
});

containerProducts.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });
    }
});
