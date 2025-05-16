async function cargarReceta() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  const respuesta = await fetch('recetas.json');
  const recetas = await respuesta.json();
  const receta = recetas.find(r => r.id === id);

  if (!receta) {
    document.body.innerHTML = "<h1>Receta no encontrada</h1>";
    return;
  }

  document.getElementById('tituloPagina').innerText = receta.titulo;
  document.getElementById('titulo').innerText = receta.titulo;
  document.getElementById('imagen').src = receta.imagen;
  document.getElementById('imagen').alt = receta.titulo;
  document.getElementById('tiempoEstimado').innerText = receta.tiempoEstimado;
  document.getElementById('tiempoCoccion').innerText = receta.tiempoCoccion;
  document.getElementById('dificultad').innerText = receta.dificultad;
  document.getElementById('tips').innerText = receta.tips;
  document.getElementById('presentacion').innerText = receta.presentacion;

  // Ingredientes
  const ulIng = document.getElementById('ingredientes');
  receta.ingredientes.forEach(i => {
    const li = document.createElement('li');
    li.textContent = i;
    ulIng.appendChild(li);
  });

  // Preparación
  const olPrep = document.getElementById('preparacion');
  receta.preparacion.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    olPrep.appendChild(li);
  });

  // Imágenes
  const contenedorMiniaturas = document.querySelector('.col-md-3 .d-flex');
  contenedorMiniaturas.innerHTML = '';
  receta.imagenes.forEach((url, index) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'img-thumbnail miniatura';
    img.alt = `Miniatura ${index + 1}`;
    img.onclick = () => cambiarImagen(url);
    contenedorMiniaturas.appendChild(img);
    if (index === 0) {
      document.getElementById('imagenPrincipal').src = url;
      img.classList.add('active');
    }
  });

  // GRÁFICA NUTRICIONAL
  if (receta.nutricion) {
    const ctx = document.getElementById('graficaNutricion').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Proteínas', 'Grasas', 'Carbohidratos', 'Fibra', 'Azúcares'],
        datasets: [{
          label: 'g por porción',
          data: [
            receta.nutricion.proteinas,
            receta.nutricion.grasas,
            receta.nutricion.carbohidratos,
            receta.nutricion.fibra,
            receta.nutricion.azucares
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

cargarReceta();
  