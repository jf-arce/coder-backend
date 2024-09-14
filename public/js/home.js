const containerHome = document.getElementById("container-home");
const currentPage = document.getElementById("current-page");
const btnNext = document.getElementById("btn-next");
const btnPrev = document.getElementById("btn-prev");
const cartView = document.getElementById("cart-view");

let maxPage;
let currentPageNumber;

//Obtener todos los productos
const getProducts = async () => {
    try {
        const params = new URLSearchParams(location.search);
        let page = params.get("page");
        if (!page || isNaN(Number(page))) {
            page = 1;
        }
        const res = await fetch(`/api/products/?page=${page}`);
        const data = await res.json();

        maxPage = data.totalPages;
        currentPageNumber = data.page;

        containerHome.innerHTML = "";
        containerHome.innerHTML += data.payload
            .map(
                (prod) => `
        <div class="card-product">
            <header class="card-header">
                <div class="img-container">
                ${prod.thumbnails.map(
                    (thumbnail) => `
                    <img src=${thumbnail} alt=${""}>
                `,
                )}  
                </div>          
            </header>
            <div class="card-content">
                <h3 class="title-product">${prod.title}</h3>
                <p class="description-product">${prod.description}</p>
                <p class="price-product">${prod.price}</p>
            </div>
            <footer class="card-footer">
                <button id="btn-addToCart" class="btn-addToCart" data-id=${prod.id}>Agregar al carrito</button>
            </footer>
        </div>
    `,
            )
            .join("");
    } catch (err) {
        console.log(err);
    }
};

//Paginación
const params = new URLSearchParams(location.search);
let page = Number(params.get('page'));
if (!page || isNaN(Number(page))) {
    page = 1;
}

getProducts().then(() => {
    currentPage.innerHTML = page;
    if (!page || !isNaN(page)) {
        if (page < maxPage){
            btnNext.disabled = false;
        }else{
            btnNext.disabled = true
        }
    
        if (page > 1){
            btnPrev.disabled = false;
        }else{
            btnPrev.disabled = true;
        }
    }
});

//Redireccionar a la siguiente pagina
btnNext.addEventListener('click', async () => {
    page++;
    location.href = `/products?page=${page}`;
});

//Redireccionar a la pagina anterior
btnPrev.addEventListener('click', async () => {
    page--;
    location.href = `/products?page=${page}`;
});

//CART
const CART = "66e4801c7f809369afe2de10"

cartView.addEventListener("click", async () => {
    location.href = `/cart`;
});

containerHome.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-addToCart")) {
        const id = e.target.dataset.id;
        
        await fetch(`/api/carts/${CART}/products/${id}`, {
            method: "POST",
        });
    }
});


