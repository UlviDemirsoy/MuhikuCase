import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';

import Logging from '../library/Logging';
import { IProduct } from '../models/Product';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);

            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    product: {
        create: Joi.object<IProduct>({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().positive().required(),
            stock: Joi.number().integer().min(0).required(),
            featuredImage: Joi.string().uri().optional()
        }),
        update: Joi.object<IProduct>({
            name: Joi.string().optional(),
            description: Joi.string().optional(),
            price: Joi.number().positive().optional(),
            stock: Joi.number().integer().min(0).optional(),
            featuredImage: Joi.string().uri().optional()
        })
    }
};
