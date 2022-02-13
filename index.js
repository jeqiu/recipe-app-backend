require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
require('express-async-errors');

const usersRouter = require('./routes/users');

app.use(cors());
app.use(express.json()); // replace bodyparser; parse incoming requests with JSON payloads
app.use(express.static('build'));

app.use((req, res, next) => {
  console.log('Method: ', req.method);
  console.log('Path: ', req.path);
  console.log('Body: ', req.body);
  next();
});

app.use('/api/users', usersRouter);

// returns a random recipe from Spoonacular
async function getRandomRecipe() {
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/random?number=1&limitLicense=true&apiKey=${process.env.SPOON_API_KEY1}`,
  );
  return response.data.recipes[0];
}

// returns a recipe that from Spoonacular that tries to exclude intolerances;
// use Spoonacular complex search to return 99 recipes with intolerances excluded;
// randomly pick one and get details by making a 2nd GET request to recipe information endpoint
async function getSearchRecipe(queryParam) {
  const response = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?query=''&number=99&intolerances=${queryParam}&apiKey=${process.env.SPOON_API_KEY2}`,
  );
  const numOfRecipes = response.data.number;
  const selectedRecipeObj = response.data.results[Math.floor(Math.random() * numOfRecipes)];
  const recipe = await axios.get(
    `https://api.spoonacular.com/recipes/${selectedRecipeObj.id}/information?includeNutrition=false&apiKey=${process.env.SPOON_API_KEY2}`,
  );
  return recipe.data;
}

app.get('/api/random_recipe', async (req, res) => {
  const recipeObj = await getRandomRecipe();
  res.json(recipeObj);
});

app.get('/api/search_recipe/:strParam', async (req, res) => {
  // express route parameters must be made up of “word characters” ([A-Za-z0-9_])
  const queryParam = req.params.strParam.split('_').join(',');
  const recipeObj = await getSearchRecipe(queryParam);
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

// general error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(`error handler: '${err.message}'`);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
