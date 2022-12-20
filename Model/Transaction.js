import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema({
    accountName: {
        type: String,
    },

    accountId: {
        type: Schema.Types.ObjectId,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    transactionType: {
        type: String,
    },

    transactionCurrency: {
        type: String,
    },

    transactionAmount: {
        type: String,
    },

    accountBalance: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

    transactionTime: {
        type: Date,
        default: Date.now
    }
})

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;