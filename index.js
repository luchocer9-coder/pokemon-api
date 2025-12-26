console.log('👉 API Pokémon iniciada');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));

app.get('/pokemon/:nombre', async (req, res) => {
  const nombre = req.params.nombre.toLowerCase();

  try {
    // 1️⃣ Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!response.ok) throw new Error();

    const data = await response.json();

    // 2️⃣ Species
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    // 3️⃣ Evoluciones
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    const evoluciones = [];
    let actual = evoData.chain;

    while (actual) {
      evoluciones.push(actual.species.name);
      actual = actual.evolves_to[0];
    }

    res.json({
      nombre: data.name,
      imagen: data.sprites.other['official-artwork'].front_default,
      altura: data.height,
      peso: data.weight,
      tipos: data.types.map(t => t.type.name),
      stats: data.stats.map(s => ({
        nombre: s.stat.name,
        valor: s.base_stat
      })),
      evoluciones,
      tieneEvoluciones: evoluciones.length > 1
    });

  } catch (error) {
    res.status(404).json({ error: 'Pokémon no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 http://localhost:${PORT}`);
});
