require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('express-async-errors');
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('------------------')
  next()
});


// returns one random recipe from Spoonacular
async function getRandomRecipe() {
  const recipe = await axios.get(
    `https://api.spoonacular.com/recipes/random?number=1&limitLicense=true&apiKey=${process.env.SPOON_APIKEY}`
    );
  return recipe.data;
};

app.get('/api/random_recipe', async (req, res) => {
  const recipeObj = await getRandomRecipe();
  res.json(recipeObj);
});

// app.get('/api/recipes/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const recipe = recipes.find(recipe => recipe.id === id);
//   if (recipe) {
//     response.json(recipe);  
//   } else {    
//     response.status(404).end();  
//   }
// });


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// simple generic error handler
app.use((err, req, res, next) => {
  console.log(`error handler: '${err.message}'`);
  res.json({ error: err.message });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});