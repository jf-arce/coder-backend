const containerHome = document.getElementById("container-home");
const currentPage = document.getElementById("current-page");
const btnNext = document.getElementById("btn-next");
const btnPrev = document.getElementById("btn-prev");
const cartView = document.getElementById("cart-view");
const btnFirst = document.getElementById("btn-first");
const btnLast = document.getElementById("btn-last");
const totalPages = document.getElementById("total-pages");
const cleanFilters = document.getElementById("clean-filters");  

let maxPage;
let currentPageNumber;

//Obtener todos los productos
const getProducts = async () => {
    try {
        const params = new URLSearchParams(location.search);
        let page = params.get("page");
        let limit = params.get("limit");
        let sort = params.get("sort");
        let query = params.get("query");  
        
        if (!page || isNaN(Number(page))) {
            page = 1;
        }
        if (!limit || isNaN(Number(limit))) {
            limit = 10;
        }
        if (!sort) {
            sort = "";
        }   
        if (!query) {
            query = "";
        }

        const res = await fetch(`/api/products/?page=${page}&limit=${limit}&sort=${sort}&query=${query}`);
        const data = await res.json();

        maxPage = data.totalPages;
        totalPages.innerHTML = maxPage;
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
                <p class="price-product">$${prod.price}</p>
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

/**************************** PAGINACION ******************************/
const params = new URLSearchParams(location.search);
let page = Number(params.get('page'));
let category = params.get('query');
let sort = params.get('sort');
let limit = params.get('limit');

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
    const queryString = `page=${page}${category ? `&query=${category}` : ''}${sort ? `&sort=${sort}` : ''}${limit ? `&limit=${limit}` : ''}`;
    location.href = `/products?${queryString}`
});

//Redireccionar a la pagina anterior
btnPrev.addEventListener('click', async () => {
    page--;
    const queryString = `page=${page}${category ? `&query=${category}` : ''}${sort ? `&sort=${sort}` : ''}${limit ? `&limit=${limit}` : ''}`;
    location.href = `/products?${queryString}`
});

//Redireccionar a la primera pagina
btnFirst.addEventListener('click', async () => {
    page = 1;
    const queryString = `page=${page}${category ? `&query=${category}` : ''}${sort ? `&sort=${sort}` : ''}${limit ? `&limit=${limit}` : ''}`;
    location.href = `/products?${queryString}`
});

//Redireccionar a la ultima pagina
btnLast.addEventListener('click', async () => {
    page = maxPage;
    const queryString = `page=${page}${category ? `&query=${category}` : ''}${sort ? `&sort=${sort}` : ''}${limit ? `&limit=${limit}` : ''}`;
    location.href = `/products?${queryString}`
});

/******************************** CART ******************************************/
const CART = "66e4801c7f809369afe2de10"

cartView.addEventListener("click", async () => {
    location.href = `/cart`;
});


//Agregar producto al carrito
containerHome.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-addToCart")) {
        const id = e.target.dataset.id;
        
        await fetch(`/api/carts/${CART}/products/${id}`, {
            method: "POST",
        }).then(() => {
            Swal.fire({
                title: 'Agregado al carrito!',
                text: 'Continúa comprando o ve al carrito para ver tu compra',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                location.reload();
            }); 
        });
    }
});


/********************* Filters ****************** */
const filtersForm = document.getElementById("filters-form");

filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Crear un objeto FormData con los valores del formulario
    const formData = new FormData(e.target);

    const category = formData.get('category');
    const sort = formData.get('sort');
    const limit = formData.get('limit');

    const params = new URLSearchParams();

    if (category !== 'all') params.append('query', category);  //Si category es all mostrar todos los productos
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const url = `/products?${queryString}`;

    location.href = url;
});


// Al cargar la página, restaurar los filtros desde la URL
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const category = params.get('query');
    const sort = params.get('sort');
    const limit = params.get('limit');

    if (category) document.getElementById('category-filter').value = category;
    if (sort) document.getElementById('price-filter').value = sort;
    if (limit) document.getElementById('limit-filter').value = limit;
});

//Limpiar filtros
cleanFilters.addEventListener("click", () => {
    location.href = `/products`;
});