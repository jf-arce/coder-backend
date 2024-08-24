const socket = io();
const containerProducts = document.getElementById("container-products");

socket.emit("message", "Hola mundo!");

socket.on("addProduct", (data) => {
    console.log("Nuevo producto creado", data);
    containerProducts.innerHTML += `
        <div class="card" style="width: 18rem;">
            <img src="${data.thumbnails[0]}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text">${data.description}</p>
                <p class="card-text">${data.price}</p>
                <p class="card-text">${data.stock}</p>
            </div>
        </div>
    `;
});