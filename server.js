'use strict'
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');


const app = express();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));


// --------routs---------------
app.get('/', homePage);
app.post('/getCountryResult', getCountryResult)
app.get('/allCountries', Countries);
app.post('/myRecords', Records)
app.get('/Details/:id', details)






// ----------functions------------

function homePage(req, res) {
    let url = `https://api.covid19api.com/world/total`
    superagent.get(url)
        .then(results => {
            res.render('pages/homePage', { data: results.body })
        })
}

function getCountryResult(req, res) {
    let { search, searchDateFrom, searchDateTo } = req.body;
    console.log(search, searchDateFrom, searchDateTo);

    let url = `https://api.covid19api.com/country/${search}/status/confirmed?from=${searchDateFrom}T00:00:00Z&to=${searchDateTo}T00:00:00Z`
    console.log(url);
    superagent.get(url)
        .then(results => {
            res.render('pages/getCountryResult', { data: results.body })
        })
}

function Countries(req, res) {
    let url = `https://api.covid19api.com/summary`
    superagent.get(url)
        .then(results => {

            res.render('pages/allCountries', { data: results.body.Countries })
        })
}


function Records(req, res) {
    let { country, confirmed, deaths, Recovered, date } = req.body
    let sql = `INSERT INTO covid (country,confirmed,deaths,Recovered,date) VALUES ($1,$2,$3,$4,$5);`
    let val = [country, confirmed, deaths, Recovered, date]
    client.query(sql, val)
        .then(() => {
            let sql = `SELECT * FROM covid;`
            client.query(sql)
                .then(results => {
                    res.render('pages/myRecords', { data: results.rows })
                })
        })
}


function details(req, res) {
    let id = req.params.id
    let sql = `SELECT * FROM covid WHERE id=$1;`
    let val = [id]
    client.query(sql, val)
        .then(results => {
            res.render('pages/Details', { data: results.rows[0] })
        })
}




client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        })
    })
