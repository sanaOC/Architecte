/* the logout */
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    window.sessionStorage.removeItem("userInformation");
    window.location.replace("./index.html");
});
/* function worksDual to duplicate in admin page and in modal the gallery */
let worksDual;

const duplicateGallery = () => {
    return fetch("http://localhost:5678/api/works")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Il y a une erreur');
            }
        })
        .then(function (works) {
            worksDual = works;
            return worksDual;
        });
}

/* display portfolio from API in admin page */
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

const showPortfolio = (works) => {
    for (let i = 0; i < works.length; i++) {
        let work = works[i];
        if (work && work.hasOwnProperty("title")) {
            let figure = document.createElement("figure");
            
            figure.setAttribute("data-id", work.id);
            figure.setAttribute("data-user-id", work.userId);
            
            let img = document.createElement("img");
            img.src = work.imageUrl;
            img.crossOrigin = "anonymous";
            figure.appendChild(img);
            
            let figcaption = document.createElement("figcaption");
            figcaption.innerHTML = work.title;
            figure.appendChild(figcaption);
            gallery.appendChild(figure);

    }
}
};
/* display gallery of portfolio in modal3 */
const modal3 = document.getElementById("modal3");
const modalManager = modal3.querySelector(".modalManager");
let editMode = false;
let token = window.sessionStorage.getItem("token") || "";

const modal3Manager = (works) => {
    for (let i = 0; i < works.length; i++) {
        /* Create the image in the modalManager */
        let work = works[i];
        let img = document.createElement("img");
        let galleryModal = document.createElement("div");
        img.crossOrigin = "anonymous";
        img.src = work.imageUrl;
        img.classList.add("img");
        let figure = document.createElement("figure");
        galleryModal.appendChild(figure);
        figure.appendChild(img);
        modalManager.appendChild(galleryModal);
        figure.classList.add("galleryModal");
        figure.setAttribute("data-id", work.id);

        /* Edit the image in the modalManager */
        let editButton = document.createElement("button");
        editButton.innerHTML = "Editer";
        editButton.classList.add("btn-edit");

        let trashButton = document.createElement("i");
        trashButton.classList.add("fa-solid", "fa-trash-can", "trash-can-button");
        trashButton.style.display = "none";

        figure.appendChild(editButton);
        figure.appendChild(trashButton);

        /* Select edit or save mode in the modalManager*/
        editButton.addEventListener("click", function () {
            editMode = !editMode;
            if (editMode) {
                editButton.innerHTML = "Enregistrer";
                trashButton.style.display = "block";
            }
            else {
                editButton.innerHTML = "Editer";
                trashButton.style.display = "none";
            }
        });
        /* Delete the image with the API */
        trashButton.addEventListener("click", function () {
            let id = this.parentNode.getAttribute("data-id");
            fetch("http://localhost:5678/api/works/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },

            })
                .then(function (response) {
                    if (response.status === 204) {
                        figure.remove();
                        figure.innerHTML = "";
                        duplicateGallery().then(function (works) {
                            /* delete the image in the modalManager and in gallery of portfolio */
                            modalManager.innerHTML = "";
                            gallery.innerHTML = "";
                            modal3Manager(works);
                            showPortfolio(works);
                        });
                    }
                    else {
                        console.error("Il y a une erreur");
                    }
                })
                .catch(function (error) {
                    console.error("Il y a une erreur:", error);
                });
        });
    };
};

/* call duplicateGallery in admin page and in modal3 */
duplicateGallery().then(function (works) {
    showPortfolio(works);
    modal3Manager(works);
});

/* Les boîtes modales */
window.onload = () => {
    const modalButtons = document.querySelectorAll('[data-toggle=modal]');
    for (let button of modalButtons) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            let target = this.dataset.target;
            let modal = document.querySelector(target);
            modal.classList.add('show');

            const modalClose = document.querySelectorAll('[data-dismiss=dialog]');
            /* close modal with xmark */
            for (let close of modalClose) {
                close.addEventListener('click', () => {
                    modal.classList.remove('show');
                });
            }
            /* close modal with mouse outside the modal */
            modal.addEventListener('click', function () {
                this.classList.remove('show');
            })
            /* close modal with mouse inside the modal */
            modal.children[0].addEventListener('click', function (e) {
                e.stopPropagation();
            })
        })
        /* close modal5 with arrowLeft */
        const arrowLeft = document.querySelector(".fa-arrow-left");
        const modal5 = document.getElementById("modal5");
        arrowLeft.addEventListener('click', () => {
            if (modal5.classList.contains("show")) {
                modal5.classList.remove('show');
            }
        })
        /* close modal3 with modal5 */
        const modal3 = document.getElementById("modal3");
        modal5.addEventListener('click', function () {
            this.classList.remove('show');
            modal3.classList.remove('show');
        })
    }
};


/* Delete the modalManager and gallery of portfolio */
const deleteGalleryButton = modal3.querySelector(".delete-gallery");
const id = modal3.querySelector(".modalManager").getAttribute("data-id");

deleteGalleryButton.addEventListener("click", deleteGallery);

function deleteGallery() {
    const figure = document.querySelectorAll(".galleryModal");
    
    figure.forEach(figure => {
        let id = figure.getAttribute("data-id");

        fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
            .then(function (response) {
                if (response.status === 204) {
                    deleteGallery();
                }
                else {
                    console.error("Il y a une erreur");
                }
            })
            .catch(function (error) {
                console.error("Il y a une erreur:", error);
            });
    });
    duplicateGallery().then(function (works) {
        /* delete the image in the modalManager and in gallery of portfolio */
        modalManager.innerHTML = "";
        gallery.innerHTML = "";
        modal3Manager(works);
        showPortfolio(works);

    });
}
/* Fonction to show new image added in the gallery and in the modalManager automatically  without reload page*/
const newImageShowTAutomatically = () => {
    return fetch("http://localhost:5678/api/works")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Il y a une erreur');
            }
        })
        .then(function (works) {
            return works;
        });
}
/* Send the image to server */
let image;
const submitButton = document.querySelector("#submit-button");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");
const background = document.querySelector(".background");
const img = document.createElement("img");


submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const category = categorySelect.value;
    console.log(image);

    if (!image) {
        document.getElementById("errorMessage").innerHTML = "Une image est requise";
        return;
    }
    if (!title) {
        document.getElementById("errorMessage").innerHTML = "Un titre est requis";
        return;
    }

    if (!category) {
        document.getElementById("errorMessage").innerHTML = "Une catégorie est obligatoire";
    }
    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
        .then(function (response) {
            if (response.status === 201) {
                return response.json();
            }
            else {
                console.error("Il y a une erreur");
            }
        })
        /* add automatically the new image in the modalManager and in gallery of portfolio */
        .then(function (data) {
            console.log(data);
            newImageShowTAutomatically().then(function (works) {
                document.querySelector(".modalManager").innerHTML = "";
                document.querySelector(".gallery").innerHTML = "";
                showPortfolio(works);
                modal3Manager(works);
            });
        })
        .catch(function (error) {
            console.error("Il y a une erreur:", error);
        });
});

/* upload an image */
let imgSrc;
document.querySelector(".add-photo").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpg, image/png,image/jPEG";
    input.click();
    /* Check the file type and size */
    input.addEventListener("change", async function () {
        image = input.files[0];
        if (image.type !== "image/jpg" && image.type !== "image/png" && image.type !== "image/jpeg") {
            document.getElementById("errorMessage").innerHTML = "jpg ou png obligatoire";
            return;
        }
        if (image.size > 4 * 1024 * 1024) {
            document.getElementById("errorMessage").innerHTML = "4mo maximum";
            return;
        }
        /* Replace by image loaded, the default message jpg png 4mo max */
        background.innerHTML = "";
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function () {
            img.src = reader.result;
            imgSrc = reader.result;
            img.style.width = "30%";
            background.appendChild(img);
        }
    }
    );
});


/* take categories from API when load new image*/
async function categories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    const select = document.querySelector("#category");
    for (let i = 0; i < categories.length; i++) {
        let option = document.createElement("option");
        option.value = categories[i].id;
        option.innerHTML = categories[i].name;
        select.appendChild(option);
    }
}
categories();

/* publish all work on index.html */
const publish = document.querySelector(".publish");

publish.addEventListener("click", function (e) {
    e.preventDefault();
    editMode = !editMode;
    if (editMode) {
        publish.innerHTML = "Enregistré";
        fetch("http://localhost:5678/api/works").then(function (works) {
            showPortfolio(works);
        });
    }
});