const boton = document.getElementById('buscarBtn');
const input = document.getElementById('pokemonInput');
const resultado = document.getElementById('resultado');

const coloresTipo = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  fairy: '#EE99AC',
  normal: '#A8A878',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  ice: '#98D8D8'
};

async function buscarPokemon() {
  const nombre = input.value.toLowerCase();
  if (!nombre) return;

  try {
    const res = await fetch(`http://localhost:3000/pokemon/${nombre}`);
    const data = await res.json();

    let fondo;
    if (data.tipos.length === 1) {
      fondo = coloresTipo[data.tipos[0]];
    } else {
      fondo = `linear-gradient(135deg,
        ${coloresTipo[data.tipos[0]]},
        ${coloresTipo[data.tipos[1]]}
      )`;
    }

    resultado.innerHTML = `
      <div class="card" style="background:${fondo}">
        <div class="card-content">
          <h2>${data.nombre.toUpperCase()}</h2>
          <img src="${data.imagen}">
          <p><strong>Altura:</strong> ${data.altura}</p>
          <p><strong>Peso:</strong> ${data.peso}</p>

          <div>
            ${data.tipos.map(t => `
              <span class="tipo" style="background:${coloresTipo[t]}">${t}</span>
            `).join('')}
          </div>

          <h3>Stats</h3>
          <div class="stats">
  ${data.stats.map(s => `
    <div class="stat">
      <span class="stat-name">${s.nombre}</span>
      <div class="stat-bar">
        <div 
          class="stat-fill"
          style="width:${Math.min(s.valor, 100)}%"
        ></div>
      </div>
      <span class="stat-value">${s.valor}</span>
    </div>
  `).join('')}
</div>


          <h3>Evoluciones</h3>
          ${
            data.tieneEvoluciones
              ? `<div class="evoluciones">
              ${data.evoluciones.map((evo, i) => `
                <span class="evo">${evo}</span>
                ${i < data.evoluciones.length - 1 ? '<span class="flecha">→</span>' : ''}
              `).join('')}
            </div>
            `
              : `<p class="sin-evo">Este Pokémon no evoluciona</p>`
          }
        </div>
      </div>
    `;

  } catch {
    resultado.textContent = 'Pokémon no encontrado';
  }
}

boton.addEventListener('click', buscarPokemon);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') buscarPokemon();
});
