const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['debit', 'credit'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['Performance Video', 'Day in the Life', 'Visualizer', 'Report', 'Photography', 'Purchase', 'Rollover', 'Other'],
            default: 'Other',
        },
        reference: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'referenceModel',
        },
        referenceModel: {
            type: String,
            enum: ['Video', 'Project'],
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ user: 1, createdAt: -1 });

const creditBankSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        totalCredits: {
            type: Number,
            default: 10,
        },
        usedCredits: {
            type: Number,
            default: 0,
        },
        rolloverCredits: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

creditBankSchema.virtual('remainingCredits').get(function () {
    return this.totalCredits - this.usedCredits;
});

creditBankSchema.set('toJSON', { virtuals: true });
creditBankSchema.set('toObject', { virtuals: true });

const CreditBank = mongoose.model('CreditBank', creditBankSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { CreditBank, Transaction };
