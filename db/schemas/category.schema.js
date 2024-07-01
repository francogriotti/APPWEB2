import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const CategorySchema = new Schema({
    name: {type:String, required: true, unique: true, uppercase: true}
})

const Category = models.category || model('category',CategorySchema)

export default Category