import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
    name: string;
    description: string;
    price: number;
    stock: number;
    featuredImage: string;
}

export interface IProductModel extends IProduct, Document {}

const BookSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        featuredImage: { type: String }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IProductModel>('Product', BookSchema);
