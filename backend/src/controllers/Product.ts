import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const createProduct = (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /products/create hit');
    const { name, description, price, stock, featuredImage } = req.body;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        description,
        price,
        stock,
        featuredImage
    });

    return product
        .save()
        .then((product) => res.status(201).json({ product }))
        .catch((error) => res.status(500).json({ error }));
};

const readProduct = (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;

    return Product.findById(productId)
        .then((product) => (product ? res.status(200).json({ product }) : res.status(404).json({ message: 'Product not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllProducts = (req: Request, res: Response, next: NextFunction) => {
    return Product.find()
        .then((products) => res.status(200).json({ products }))
        .catch((error) => res.status(500).json({ error }));
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;

    return Product.findById(productId)
        .then((product) => {
            if (product) {
                product.set(req.body);

                return product
                    .save()
                    .then((updatedProduct) => res.status(201).json({ updatedProduct }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;

    return Product.findByIdAndDelete(productId)
        .then((product) => (product ? res.status(200).json({ message: 'Product deleted', product }) : res.status(404).json({ message: 'Product not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createProduct, readProduct, readAllProducts, updateProduct, deleteProduct };
