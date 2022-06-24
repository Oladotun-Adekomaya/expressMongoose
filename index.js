const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')


const Product = require('./models/product')
const Farm = require('./models/farm')

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> {
        console.log(" MONGO CONNECTION OPEN!!! ")
    })
    .catch(err => {
        console.log(" OH NO MONGO CONNECTION ERROR!!! ")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended : true}))
app.use(methodOverride('_method'))


// FARMS ROUTE


app.get('/farms', async (req,res) => {
    farms = await Farm.find({})
    res.render('farms/index', {farms})
})

app.get('/farms/new', (req,res) => {
    res.render('farms/new')
})

app.post('/farms', async(req,res) => {
    const newFarm = new Farm(req.body)
    await newFarm.save();
    console.log(newFarm);
    res.redirect (`/farms`)
})


app.get('/farms/:id', async (req,res) => {
    const { id } = req.params
    const farm = await Farm.findById(id).populate('products')
    res.render("farms/details", { farm, id })
})


app.get('/farms/:id/products/new',(req,res) => {
    const { id } = req.params
    res.render("products/new", { id })
})
app.post('/farms/:id/products', async(req,res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    const newProduct = new Product(req.body)
    farm.products.push(newProduct)
    newProduct.farm = farm
    await newProduct.save()
    await farm.save()
    res.redirect (`/farms/${farm._id}`) 
})


app.delete('farms/:id', async (req,res) => {
    console.log('DELETING');
    //await Farm.findByIdAndRemove(req.params.id)
    res.redirect('/farms')
})










//  PRODUCT ROUTES
app.get('/products', async (req,res) => {
    products = await Product.find({})
    res.render('products/index', {products})
})

app.get('/products/new', (req,res) => {
    res.render('products/new')
})

app.post('/products', async(req,res) => {
    const newProduct = new Product(req.body)
    await newProduct.save();
    res.redirect (`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req,res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("products/details", { product })
})

app.get('/products/:id/edit', async(req,res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate( id, req.body, {runValidators: true, new:true})
    res.redirect(`/products/${Product.id}`)
})

// app.delete('/products/:id', async (req,res) => {
//     const { id } = req.params
//     const deleteproduct = await Product.findByIdAndDelete(id)
//     res.redirect('/products')
// })


app.listen(3000, () =>{
    console.log('APP IS LISTENING ON PORT 3000!')
})