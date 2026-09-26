import mongoose from "mongoose";
import WeeklyStock from "../models/WeeklyStock.model.js";
import Product from "../models/Product.model.js";
import ApiError from "../utils/ApiError.js";

const serializeStockItem = (item) => ({
    id: item._id,
    day: item.day,
    productId: item.product?._id?.toString() || item.product?.toString() || "",
    productName: item.product?.name || "",
    productImage: item.product?.image || "",
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    availability: item.availability,
    enabled: item.enabled,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
});

const assertStockAccess = async (farmerId, stockId) => {
    if (!mongoose.isValidObjectId(stockId)) {
        throw new ApiError(404, "Weekly stock item not found");
    }

    const item = await WeeklyStock.findOne({
        _id: stockId,
        farmer: farmerId,
    });

    if (!item) {
        throw new ApiError(404, "Weekly stock item not found");
    }

    return item;
};

const assertProductBelongsToFarmer = async (farmerId, productId) => {
    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Please select a valid product");
    }

    const product = await Product.findOne({ _id: productId, farmer: farmerId });

    if (!product) {
        throw new ApiError(
            400,
            "Please select one of your own products for weekly stock"
        );
    }

    return product;
};

const assertNoDuplicateForDay = async (farmerId, day, productId, exceptId) => {
    const duplicate = await WeeklyStock.findOne({
        farmer: farmerId,
        day,
        product: productId,
        _id: { $ne: exceptId },
    });

    if (duplicate) {
        throw new ApiError(
            400,
            "This product is already scheduled for this day. Edit the existing entry instead."
        );
    }
};

const listWeeklyStock = async (farmerId) => {
    const items = await WeeklyStock.find({ farmer: farmerId })
        .populate("product", "name image")
        .sort({ day: 1, createdAt: 1 });

    return items.map(serializeStockItem);
};

const createStockItem = async (farmerId, input) => {
    await assertProductBelongsToFarmer(farmerId, input.productId);
    await assertNoDuplicateForDay(
        farmerId,
        input.day,
        input.productId,
        null
    );

    const item = await WeeklyStock.create({
        farmer: farmerId,
        day: input.day,
        product: input.productId,
        quantity: input.quantity,
        unit: input.unit,
        price: input.price,
        availability: input.availability,
        enabled: input.enabled ?? true,
    });

    return listWeeklyStock(farmerId);
};

const updateStockItem = async (farmerId, stockId, input) => {
    const item = await assertStockAccess(farmerId, stockId);

    if (
        input.productId &&
        input.productId.toString() !== item.product.toString()
    ) {
        await assertProductBelongsToFarmer(farmerId, input.productId);
        await assertNoDuplicateForDay(
            farmerId,
            input.day,
            input.productId,
            item._id
        );
    }

    item.day = input.day;
    item.product = input.productId;
    item.quantity = input.quantity;
    item.unit = input.unit;
    item.price = input.price;
    item.availability = input.availability;

    if (typeof input.enabled === "boolean") {
        item.enabled = input.enabled;
    }

    await item.save();

    return listWeeklyStock(farmerId);
};

const toggleStockItem = async (farmerId, stockId, enabled) => {
    const item = await assertStockAccess(farmerId, stockId);

    item.enabled = enabled;
    await item.save();

    return listWeeklyStock(farmerId);
};

const deleteStockItem = async (farmerId, stockId) => {
    const item = await assertStockAccess(farmerId, stockId);

    await WeeklyStock.deleteOne({ _id: item._id, farmer: farmerId });

    return listWeeklyStock(farmerId);
};

const replaceWeeklyStock = async (farmerId, items) => {
    const handledIds = [];

    for (const entry of items) {
        await assertProductBelongsToFarmer(farmerId, entry.productId);

        const serializedEntry = {
            ...entry,
            product: entry.productId,
            farmer: farmerId,
        };

        if (entry.id && mongoose.isValidObjectId(entry.id)) {
            const existing = await WeeklyStock.findOne({
                _id: entry.id,
                farmer: farmerId,
            });

            if (existing) {
                await assertNoDuplicateForDay(
                    farmerId,
                    entry.day,
                    entry.productId,
                    existing._id
                );

                existing.day = entry.day;
                existing.product = entry.productId;
                existing.quantity = entry.quantity;
                existing.unit = entry.unit;
                existing.price = entry.price;
                existing.availability = entry.availability;
                existing.enabled = entry.enabled ?? true;
                await existing.save();

                handledIds.push(existing._id);
                continue;
            }
        }

        await assertNoDuplicateForDay(
            farmerId,
            entry.day,
            entry.productId,
            null
        );

        const created = await WeeklyStock.create(serializedEntry);
        handledIds.push(created._id);
    }

    await WeeklyStock.deleteMany({
        farmer: farmerId,
        _id: { $nin: handledIds },
    });

    return listWeeklyStock(farmerId);
};

export {
    listWeeklyStock,
    createStockItem,
    updateStockItem,
    toggleStockItem,
    deleteStockItem,
    replaceWeeklyStock,
};