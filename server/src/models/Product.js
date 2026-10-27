import mongoose from 'mongoose';

export const CATEGORIES = [
  'Textbooks and Notes', 'Calculators and Electronics', 'Lab Equipment', 'Stationery',
  'Hostel Essentials', 'Clothing and Accessories', 'Sports Equipment', 'Other',
];
export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, required: true },
    condition: { type: String, enum: CONDITIONS, required: true },
    imageUrl: { type: String, default: '' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isSold: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
