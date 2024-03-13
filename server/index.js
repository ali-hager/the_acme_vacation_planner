const { client, createTables, createUser, createPlace, fetchUsers, fetchPlaces, createVacation, fetchVacations, destoryVacation } = require("./db");

const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));


app.get('/api/users', async(req, res, next) => {
  try{
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});


app.get('/api/places', async(req, res, next) => {
  try{
    res.send(await fetchPlaces());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/vacations', async(req, res, next) => {
  try{
    res.send(await fetchVacations());
  }
  catch(ex){
    next(ex);
  }
});



const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [moe, lucy, jennifer, australia, france, london, nyc] =
    await Promise.all([
      createUser({ name: "moe" }),
      createUser({ name: "lucy" }),
      createUser({ name: "jennifer" }),
      createPlace({ name: "australia" }),
      createPlace({ name: "france" }),
      createPlace({ name: "london" }),
      createPlace({ name: "nyc" }),
    ]);
  console.log(await fetchUsers());
  console.log(await fetchPlaces());

  const vacations = await Promise.all([
    createVacation({ user_id: moe.id, place_id: australia.id, travel_date: '03/19/2024'}),
    createVacation({ user_id: moe.id, place_id: france.id, travel_date: '04/28/2024'}),
    createVacation({ user_id: jennifer.id, place_id: london.id, travel_date: '07/05/2024'})
  ]);
  console.log(await fetchVacations());

  await destoryVacation(vacations[0]);

  console.log(await fetchVacations());

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
    console.log('TESTING OUT APP WITH curl:');
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/places`);
    console.log(`curl localhost:${port}/api/vacations`);
  });

};

init();
