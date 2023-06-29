const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

const portfolioFiltered = (filteredTool) => {
  gallery.innerHTML = '';

  filteredTool.map(tool => {
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    let figcaption = document.createElement('figcaption');

    img.src = tool.imageUrl;
    img.crossOrigin = 'anonymous';
    figcaption.innerHTML = tool.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

const fetchData = async () => {
  const response = await fetch('http://localhost:5678/api/works');

  if (response.ok) {
    const data = await response.json();

    const btnAll = document.querySelector('.btn-filter.green');
    const btnAppartment = document.querySelector('.btn-filter.appartment');
    const btnHotel = document.querySelector('.btn-filter.hotel');
    const btnObject = document.querySelector('.btn-filter.object');

    btnAll.addEventListener('click', () => portfolioFiltered(data));

    btnAppartment.addEventListener('click', () => {
      const filteredWorks = data.filter(obj => obj.category.name === 'Appartements');
      portfolioFiltered(filteredWorks);
    });

    btnHotel.addEventListener('click', () => {
      const filteredWorks = data.filter(obj => obj.category.name === 'Hotels & restaurants');
      portfolioFiltered(filteredWorks);
    });

    btnObject.addEventListener('click', () => {
      const filteredWorks = data.filter(obj => obj.category.name === 'Objets');
      portfolioFiltered(filteredWorks);
    });

    portfolioFiltered(data);
    console.log('Données récupérées avec succès');
  } else {
    console.error("Erreur lors de la requête vers l'API");
  }
};

fetchData();
