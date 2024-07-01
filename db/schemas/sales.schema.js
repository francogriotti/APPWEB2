import mongoose from 'mongoose';

const { Schema, models, model, ObjectId } = mongoose;

const SalesSchema = new Schema({
    products: [{type:ObjectId, required: true, ref:"product"}],
    total : {type: Number, required: true},
    user: {type:String, required: true},
},{ timestamps: true })                         //adaptar codigo al JSON

const Sales = models.sales || model('sales',SalesSchema)

export default Sales