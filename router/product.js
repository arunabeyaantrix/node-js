const { Product } = require('../models/product')
const { Category } = require('../models/category')
const express = require('express')
const { response } = require('express')
const router = express.Router()
const mongoose = require('mongoose')
router.get(`/`, async (req, res) => {
    let filter = {}
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const product = await Product.find(filter).populate('category')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.get(`/one`, async (req, res) => {
    const product = await Product.find().select('name image -_id')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category)

    if (!category) return response.status(400).send('Invalid Catgeory')
    const product = await new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    newProduct = await product.save()
    if (!newProduct) {
        return res.status(500).send({ message: 'Product coudnt be created' })
    }

    return res.send(newProduct)
})

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId( req.params.id)){
        res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category)

    if (!category) return response.status(400).send('Invalid Catgeory')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(product)
})

router.delete('/:id', async (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then((product) => {
            if (product) {
                res.status(200).json({
                    success: true,
                    message: 'Product is deleted',
                })
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'Product not found' })
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err })
        })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)
    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({count:productCount})
})

router.get(`/get/featured`, async (req, res) => {
    const product = await Product.find({isFeatured: true})
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send({data:product})
})


module.exports = router
