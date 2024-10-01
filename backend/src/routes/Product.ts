import express from 'express';
import controller from '../controllers/Product';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.product.create), controller.createProduct);
router.get('/get/:productId', controller.readProduct);
router.get('/get/', controller.readAllProducts);
router.patch('/update/:productId', ValidateJoi(Schemas.product.update), controller.updateProduct);
router.delete('/delete/:productId', controller.deleteProduct);

export = router;
