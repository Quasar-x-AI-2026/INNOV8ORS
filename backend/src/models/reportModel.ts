import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  userId: string;
  productName: string;
  price: number;
  unit: string;
  marketName: string;
  month: string;
  verificationMethod: 'manual' | 'ml';
  status: 'pending' | 'verified' | 'flagged';

  mlAnalysis?: {
    mandiBenchmark: number;
    expectedPrice: number;
    deviation: string;
    anomaly: boolean;
    reason: string;
  };

  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      enum: ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'liter'],
    },
    marketName: {
      type: String,
      required: true,
      trim: true,
      enum: ['Azadpur', 'Daryaganj', 'Ghazipur', 'INA Market', 'Keshopur', 'Okhla', 'Rohini'],
    },
    month: {
      type: String,
      required: true,
      enum: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
    },
    verificationMethod: {
      type: String,
      enum: ['manual', 'ml'],
      default: 'manual',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'flagged'],
      default: 'pending',
    },

    // 🔥 ML OUTPUT STORED HERE
    mlAnalysis: {
      mandiBenchmark: Number,
      expectedPrice: Number,
      deviation: String,
      anomaly: Boolean,
      reason: String,
    },

    verifiedBy: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ productName: 1, marketName: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
