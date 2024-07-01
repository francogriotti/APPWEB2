import mongoose from 'mongoose';

const { Schema, models, model, ObjectId} = mongoose;

const ProductSchema = new Schema({
    name: {type: String, required:true, unique: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, default:0},
    category: {type: ObjectId, required: true, ref:"category"}   //adaptar codigo al JSON
})

const Product = models.product || model('product',ProductSchema)

export default Product