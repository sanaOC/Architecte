

// Sélectionner tous les éléments HTML avec la classe "gallery" et les stocker dans la variable "gallery"
const gallery = document.querySelector(".gallery");

// Sélectionner l'élément HTML avec l'ID "portfolio" et le stocker dans la variable "portfolio"
const portfolio = document.getElementById("#portfolio");


/* display filter function */
function portfolioFiltered(filteredTool) {
    // Sélectionne l'élément HTML avec la classe "gallery"
    let gallery = document.querySelector('.gallery');
      
    // Remplace le contenu de l'élément "gallery" par une chaîne vide
    gallery.innerHTML = '';
      
    // Parcourt l'objet "filteredTool" avec une boucle "for...in"
    for (let key in filteredTool) {
        // Crée un élément HTML de type "figure"
        let figure = document.createElement('figure');
      
        // Ajoute l'élément "figure" à l'élément "gallery"
        gallery.appendChild(figure);
    
        // Crée un élément HTML de type "img" et lui assigne la source de l'image
        let img = document.createElement('img');
        img.src = filteredTool[key].imageUrl;
    
        // Ajoute l'élément "img" à l'élément "figure" et spécifie que l'image est de source externe
        figure.appendChild(img);
        img.crossOrigin = 'anonymous';
    
        // Crée un élément HTML de type "figcaption" et lui assigne le titre de l'image
        let figcaption = document.createElement('figcaption');
        figcaption.innerHTML = filteredTool[key].title;
      
        // Ajoute l'élément "figcaption" à l'élément "figure"
        figure.appendChild(figcaption);
    }
};

/* Récupérer les données de l'API */
let response;

fetch("http://localhost:5678/api/works")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Il y a une erreur quant à la réponse de l\'API');
        }
    })
    .then(function (data) {
        btnObject.addEventListener('click', function () {
            let filteredTool = Object.entries(data).reduce((obj, [key, value]) => {
                if (value.category.name === 'Objets') {
                    obj[key] = value;
                }
                return obj;
            }, {});
            portfolioFiltered(filteredTool);
        });
    
        btnAll.addEventListener('click', function () {
            let filteredTool = Object.entries(data).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
            portfolioFiltered(filteredTool);
        });
    
        btnAppartment.addEventListener('click', function () {
            let filteredTool = Object.entries(data).reduce((obj, [key, value]) => {
                if (value.category.name === 'Appartements') {
                    obj[key] = value;
                }
                return obj;
            }, {});
            portfolioFiltered(filteredTool);
        });
    
        btnHotel.addEventListener('click', function () {
            let filteredTool = Object.entries(data).reduce((obj, [key, value]) => {
                if (value.category.name === 'Hotels & restaurants') {
                    obj[key] = value;
                }
                return obj;
            }, {}); 
            portfolioFiltered(filteredTool);
        })
        return data;
    })
     .then(function (works) {
        for (let i = 0; i < works.length; i++) {
            let work = works[i];
            let figure = document.createElement("figure");
            
            let img = document.createElement("img");
            img.src = work.imageUrl;
            img.crossOrigin = "anonymous";
            figure.appendChild(img);
            
            let figcaption = document.createElement("figcaption");
            figcaption.innerHTML = work.title;
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        }
    });

const btnAll = document.querySelector('.btn-filter.green');
const btnAppartment = document.querySelector('.btn-filter.appartment');
const btnHotel = document.querySelector('.btn-filter.hotel');
const btnObject = document.querySelector('.btn-filter.object');

/* filter function button active */
const button = [];
button.push(btnAll);
button.push(btnAppartment); 
button.push(btnHotel);
button.push(btnObject);

for (const btn of button) {
    btn.addEventListener("click", function() {
       for (const btn of button) {
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "#1D6154";
       }
        this.style.backgroundColor = "#1D6154";
        this.style.color = "#ffffff";
    });
};




