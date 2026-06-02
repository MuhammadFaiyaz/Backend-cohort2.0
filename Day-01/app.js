const express = require('express');
const app = express();

const notes = [];

app.get('/', (req,res)=>{
    res.send('Hi, Faiyaz!')
})

app.post('/notes', (req,res)=>{
    res.send('notes created!')
})

app.listen(3000)