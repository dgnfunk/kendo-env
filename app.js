import express from 'express';
const path = require('path');
import db from './api/db/db';
import bodyParser from 'body-parser';
// Set up the express app
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.post('/api/v1/contacts', (req, res) => {
    var paging = req.body.options;
    var filters = req.body.options && req.body.options.filter ? req.body.options.filter.filters : null;
    if (filters && filters.length > 0) {
        console.log(filters);
        
        res.status(200).send({
            success: 'true',
            message: 'contacts filtered retrieved successfully',
            contacts: db.slice(filters[0].value, filters[1].value).slice(paging.skip, paging.skip + paging.take)
        });
    }
    else if (req.body.options && req.body.options.action === 'addRow') {
        res.status(200).send({
            success: 'true',
            message: 'contact added successfully',
            contacts: [{
                "Email": "new@email.com",
                "FullName": "New User",
                "Country": "New City",
                "UserId": db.length + 1,
                "CreatedAt": "2002-04-24T22:08:38.375Z"
            }]
        });    
    }
    else if (req.body.options && req.body.options.action === 'change') {
        res.status(200).send({
            success: 'true',
            message: 'contacts filtered retrieved successfully',
            contacts: db.slice(paging.skip, paging.skip + paging.take)
        });
    }
    else {
        console.log(paging);
        res.status(200).send({
            success: 'true',
            message: 'contacts retrieved successfully',
            contacts: db.slice(paging.skip, paging.skip + paging.take)
        });
    }
});
app.post('/api/v1/change', (req, res) => {
    console.log(req.body.options);
    var filtering = req.body.options.filtering;
    res.status(200).send({
        success: 'true',
        message: 'contacts filtered retrieved successfully',
        contacts: db.slice(filtering[0].value, filtering[1].value)
    });
});
app.post('/api/v1/addRow', (req, res) => {
    console.log(req.body.options);
    res.status(200).send({
            success: 'true',
            message: 'contacts filtered retrieved successfully',
            contacts: [{
                "Email": "new@email.com",
                "FullName": "New User",
                "Country": "New City",
                "UserId": db.length + 1,
                "CreatedAt": "2002-04-24T22:08:38.375Z"
            }]
        });
    
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'newindex.html'));
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    console.log(__dirname);
});