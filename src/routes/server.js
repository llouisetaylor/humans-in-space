const express = require('express');
const morgan = require('morgan');
const fetch = require('node-fetch');
const path = require('path');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(morgan('tiny'));

app.use('/js', express.static(path.resolve(__dirname, '../../', 'dist/js')));
app.use('/css', express.static(path.resolve(__dirname, '../../', 'dist/css')));
app.use('/img', express.static(path.resolve(__dirname, '../../', 'dist/img')));

app.get('/api/astronauts', (req, res) => {
  fetch('http://api.open-notify.org/astros.json')
    .then(res => res.json())
    .then(json => res.send(json))
    .catch(e => {
      res.status(503);
      res.send(e.message);
    })
});

app.get('/api/astronauts/name/:searchParam', (req, res) => {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${req.params.searchParam}%20astronaut&prop=info&inprop=url&utf8=&format=json`)
    .then(res => res.json())
    .then(json => res.send(json))
    .catch(e => {
      res.status(503);
      res.send(e.message);
    })
});

app.get('/api/astronauts/bio/:name', (req, res) => {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${req.params.name}`)
    .then(res => res.json())
    .then(json => res.send(json))
    .catch(e => {
      res.status(503);
      res.send(e.message);
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../', 'dist/index.html'));
})

app.listen(PORT, () => { console.log(`Server is running on port: ${PORT}`) });
