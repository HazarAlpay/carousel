(function () {

    //does not work outside the requested page
    if (!window.location.href.includes("e-bebek.com") || window.location.pathname !== "/") {
        console.log("wrong page");
        return;
    }
  
    //url of the json file containing data of the products
    const dataURL =
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    
    //key used to cache product data in localstorage
    const STORAGE_KEY = "ebebekProducts";
  
    //key used to store favorite product ids in localstorage
    const FAVORITES_KEY = "ebebekFavorites";
    
    //key used to store cart product ids in localstorage
    const CART_KEY = "ebebekCart";

    //checks if the given product ID exists in the list of favorite items stored in localStorage
    const isFavorite = (id) => {
        const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        return favs.includes(id);
    };

    //converts '.' to ',' in prices of the products
    const formatPrice = (price) => {
        return price.toFixed(2).replace('.', ',');
    };

    //adds or removes the product from favorites in localstorage and changes the ui of the icon
    const toggleFavorite = (id, button) => {
        let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        const icon = button.querySelector("i");
    
        if (favs.includes(id)) {
            favs = favs.filter(favId => favId !== id);
            icon.className = "far fa-heart";
        } else {
            favs.push(id);
            icon.className = "fas fa-heart filled";
        }
    
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    };

    //styles
    const createStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
            .carousel-container {
             background-color: #FEF6EB;
                border-radius: 40px;
                margin: 32px 0;
                font-family: 'Arial', sans-serif;
                max-width: 1280px;
                margin-left: auto;
                margin-right: auto;
            }

            .carousel-title {
                font-size: 24px;
                font-weight: 700;
                color: #F28E00;
                letter-spacing: 0.5px;
                margin: 16px 0px 0px 40px;
                line-height: 1; 
                display: flex;
                align-items: center;
                height: 40px;
                weight: bold;
            }

            .carousel-list {
                display: flex;
                overflow-x: auto;
                gap: 20px;
                scroll-behavior: smooth;
                -ms-overflow-style: none;
                scrollbar-width: none;
                background-color: #FFFFFF;
                padding-top: 20px;
            }

            .carousel-list::-webkit-scrollbar {
                display: none;
            }

            .product-card {
                background-color: #fff;
                border-radius: 8px;
                border: 1px solid #eee;
                width: 240px;
                padding: 12px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                position: relative;
                flex-shrink: 0;
                margin-bottom: 40px;
                position: relative;
                padding-bottom: 100px;
            }

            .product-card:hover {
                box-shadow: 0 0 0 1px #F28E00;
                border-color: #F28E00;
                cursor: pointer;
            }


            .product-card img {
                width: 100%;
                height: 300px;
                object-fit: contain;
                border-radius: 4px;
                margin-bottom: 16px;
            }

            .product-name {
                font-size: 14px;
                font-weight: 500;
                color: #333;
                margin-bottom: 8px;
                height: 40px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .price-box {
                margin-top: 20px;
            }

            .original-price {
                font-size: 18px;
                color: #6A6A6A;
                text-decoration: line-through;
                margin-bottom: 2px;
            }

            .current-price {
                font-size: 24px;
                font-weight: bold;
            }

            .discount {
                font-size: 12px;
                color: #00A365;
                margin-top: 4px;
            }

            .add-to-cart {
                position: absolute;
                bottom: 12px;
                left: 12px;
                right: 12px;
                padding: 15px 0;
                background-color: #FEF6EB;
                border-radius: 20px;
                color: #F28E00;
                font-weight: bold;
                cursor: pointer;
                border: none;
                font-size: 12px;
                transition: background-color 0.2s ease;
                box-shadow: 0px -4px 8px rgba(0,0,0,0.03);
            }

            .add-to-cart:hover {
                background-color: #F28E00;
                color:  #FEF6EB;
            }

            .fav-button {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 40px;
                height: 40px;
                background: #fff;
                border: none;
                border-radius: 50%;
                font-size: 22px;
                color: #F28E00;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
                transition: border 0.2s ease, color 0.2s ease;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }

            .fav-button:hover {
                border: 1px solid #F28E00;
                background-color: #fff;
            }

            .fav-button i.filled {
                color: #F28E00 !important;
            }

            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
                background-color: #FEF6EB;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                border: none;
                box-shadow: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #F07F00;
                transition: background-color 0.3s ease, border 0.3s ease;
            }

            .carousel-arrow:hover {
                background-color: #FFFFFF;
                border: 1px solid #F07F00;
            }

            .carousel-arrow.left {
                left: -65px;
            }

            .carousel-arrow.right {
                right: -65px;
            }

            .carousel-wrapper {
                position: relative;
            }

            .carousel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                margin-bottom: 12px;
            }

            .discount-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background-color: #E6F4EE;
                border-radius: 12px;
                padding: 2px 6px;
                font-size: 18px;
                color: #00A365;
                margin-left: 8px;
                font-weight: 600;
            }

            .discount-badge .icon {
                display: inline-block;
                font-size: 18px;
                margin-bottom: 5px;
                transform: rotate(0deg);
            }
        `;

        document.head.appendChild(style);
    };
  
    //renders the carousel on the home page
    const renderCarousel = (products) => {
        const container = document.createElement("div");
        container.className = "carousel-container";
  
        const header = document.createElement("div");
        header.className = "carousel-header";

        const title = document.createElement("div");
        title.className = "carousel-title";
        title.textContent = "Beğenebileceğinizi düşündüklerimiz";

        const seeAll = document.createElement("a");
        seeAll.href = "#";

        header.appendChild(title);
        header.appendChild(seeAll);
        container.appendChild(header);

        const wrapper = document.createElement("div");
        wrapper.className = "carousel-wrapper";

        const list = document.createElement("div");
        list.className = "carousel-list";
        wrapper.appendChild(list);

        const leftArrow = document.createElement("button");
        leftArrow.className = "carousel-arrow left";
        leftArrow.innerHTML = "‹";
        leftArrow.addEventListener("click", () => {
            list.scrollBy({ left: -300, behavior: 'smooth' });
        });

        const rightArrow = document.createElement("button");
        rightArrow.className = "carousel-arrow right";
        rightArrow.innerHTML = "›";
        rightArrow.addEventListener("click", () => {
            list.scrollBy({ left: 300, behavior: 'smooth' });
        });

        wrapper.appendChild(leftArrow);
        wrapper.appendChild(rightArrow);
  
        products.forEach((product) => {
            const card = document.createElement("div");
            card.className = "product-card";
        
            const favButton = document.createElement("button");
            favButton.className = "fav-button";
            favButton.innerHTML = isFavorite(product.id)
            ? '<i class="fas fa-heart filled"></i>'
            : '<i class="far fa-heart"></i>';

            /*
                opens the product's page using url data of the product
                however, the urls of some products are redirecting me to some
                other url of the website due to i believe that the url is no longer being used.
            */
            card.addEventListener("click", () => {
                window.open(product.url, "_blank");
            });

            //triggers toggleFavorite to add the product to favorites in local storage
            favButton.addEventListener("click", (e) => {
                e.stopPropagation(); 
                toggleFavorite(product.id, favButton);
            });            

            const image = document.createElement("img");
            image.src = product.img;
            image.alt = product.name;
        
            const brand = document.createElement("div");
            brand.textContent = product.brand;
            brand.style.fontWeight = "bold";
            brand.style.color = "#000000";
            brand.style.fontSize = "14px";
            brand.style.marginBottom = "2px";
        
            const name = document.createElement("div");
            name.className = "product-name";
            name.textContent = product.name;
            name.style.color = "#666666";
            name.style.fontWeight = "normal";
        
            const priceBox = document.createElement("div");
            priceBox.className = "price-box";
        
            /*
                Check if the product is discounted by comparing original and current prices.
                I initially used the following if statement
                     if (product.price !== product.original_price)
                However, after carefully examining the data i found that the price of the product with id 8 is higher than the original price.
                So in other words the price of the product with id 8 is increased. However, it does not make any sense to show the user that 
                the price increase has occured. That's why i changed my if statement to:
                    if (product.price < product.original_price)
                and if the price is higher than the original price, i displayed the price rather than the original price. 
            */
            if (product.price < product.original_price) {
                const original = document.createElement("div");
                original.className = "original-price";
                original.textContent = `${formatPrice(product.original_price)} TL`;
            
                const discountBadge = document.createElement("span");
                discountBadge.className = "discount-badge";
                const discountPercent = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                discountBadge.innerHTML = `${discountPercent}% <span class="icon">↓</span>`;
            
                const originalWrapper = document.createElement("div");
                originalWrapper.style.display = "flex";
                originalWrapper.style.alignItems = "center";
                originalWrapper.appendChild(original);
                originalWrapper.appendChild(discountBadge);
            
                const current = document.createElement("div");
                current.className = "current-price";
                current.textContent = `${formatPrice(product.price)} TL`;
                current.style.color = "#00A365";
            
                priceBox.appendChild(originalWrapper);
                priceBox.appendChild(current);
            } else {
                const current = document.createElement("div");
                current.className = "current-price";
                current.textContent = `${formatPrice(product.price)} TL`;
                current.style.color = "grey";
            
                priceBox.appendChild(current);
            }
        
            const addToCartBtn = document.createElement("button");
            addToCartBtn.className = "add-to-cart";

            //controls that whether the product in the cart or not
            let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            let inCart = cart.some(p => p.id === product.id);
            addToCartBtn.textContent = inCart ? "Sepetten Kaldır" : "Sepete Ekle";

           
            addToCartBtn.onclick = (e) => {
                e.stopPropagation();
                let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
                const exists = cart.find(p => p.id === product.id);

                if (exists) {
                    cart = cart.filter(p => p.id !== product.id);
                    addToCartBtn.textContent = "Sepete Ekle";
                    alert(`Sepetten kaldırıldı: ${product.name}`);
                } else {
                    cart.push(product);
                    addToCartBtn.textContent = "Sepetten Kaldır";
                    alert(`Sepete eklendi: ${product.name}`);
                }

                localStorage.setItem(CART_KEY, JSON.stringify(cart));
            };
            
        
            card.appendChild(favButton);
            card.appendChild(image);
            card.appendChild(brand);
            card.appendChild(name);
            card.appendChild(priceBox);
            card.appendChild(addToCartBtn);
        
            list.appendChild(card);
        });
        
        container.appendChild(wrapper);

        const targetElement = document.querySelector("eb-hero-banner-carousel");
        if (targetElement && targetElement.parentNode) {
            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    };
  
    const cached = localStorage.getItem(STORAGE_KEY);
  
    if (cached) {
        const products = JSON.parse(cached);
        createStyles();
        renderCarousel(products);
    } else {
        fetch(dataURL)
            .then((res) => res.json())
            .then((data) => {
                console.log("Data has been fetched:", data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                createStyles();
                renderCarousel(data);
            })
            .catch((err) => console.error("Data has not been fetched:", err));
    }
})();