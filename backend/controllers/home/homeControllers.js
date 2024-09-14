const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const reviewModel = require("../../models/reviewModel");
const { responseReturn } = require("../../utiles/response");
const queryProducts = require("../../utiles/queryProducts");
const moment = require("moment");
const {
  mongo: { ObjectId },
} = require("mongoose");

class homeControllers {
  formateProduct = (products) => {
    const productArray = [];
    for (let i = 0; i < products.length; i += 3) {
      const chunk = products.slice(i, i + 3);
      productArray.push(chunk);
    }
    return productArray;
  };

  get_categorys = async (req, res) => {
    try {
      const categorys = await categoryModel.find({});
      const response = {
        categorys,
      };
      console.log("get_categorys response:", response);
      responseReturn(res, 200, response);
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  get_products = async (req, res) => {
    try {
      const [
        products,
        allProductLatest,
        allProductTopRated,
        allProductDiscount,
      ] = await Promise.all([
        productModel.find({}).limit(12).sort({ createdAt: -1 }), // Main products
        productModel.find({}).limit(9).sort({ createdAt: -1 }), // Latest products
        productModel.find({}).limit(9).sort({ rating: -1 }), // Top-rated products
        productModel.find({}).limit(9).sort({ discount: -1 }), // Discounted products
      ]);
      const latest_product = this.formateProduct(allProductLatest);
      const topRated_product = this.formateProduct(allProductTopRated);
      const discount_product = this.formateProduct(allProductDiscount);
      const response = {
        products,
        latest_product,
        topRated_product,
        discount_product,
      };
      console.log("get_products response:", response);
      responseReturn(res, 200, response);
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  price_range_product = async (req, res) => {
    try {
      const [latestProducts, priceSortedProducts] = await Promise.all([
        productModel.find({}).limit(9).sort({ createdAt: -1 }),
        productModel.find({}).sort({ price: 1 }),
      ]);
      const latest_product = this.formateProduct(latestProducts);
      const priceRange = {
        low: priceSortedProducts.length > 0 ? priceSortedProducts[0].price : 0,
        high:
          priceSortedProducts.length > 0
            ? priceSortedProducts[priceSortedProducts.length - 1].price
            : 0,
      };
      const response = { latest_product, priceRange };
      responseReturn(res, 200, response);
    } catch (error) {
      console.log(error.message);
    }
  };

  // end method

  query_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    console.log(req.query);
    try {
      const products = await productModel.find({}).sort({
        createdAt: -1,
      });
      const queryProduct = new queryProducts(products, req.query);
      const totalProduct = queryProduct
        .categoryQuery()
        .ratingQuery()
        .searchQuery()
        .priceQuery()
        .sortByPrice()
        .countProducts();

      const result = queryProduct
        .categoryQuery()
        .ratingQuery()
        .priceQuery()
        .searchQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      const [totalProductCount, paginatedProducts] = await Promise.all([
        totalProduct,
        result,
      ]);

      const response = {
        products: paginatedProducts,
        totalProduct: totalProductCount,
        parPage,
      };

      console.log("Response:", response);
      responseReturn(res, 200, response);
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  product_details = async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await productModel.findOne({ slug });

      if (!product) {
        return responseReturn(res, 404, { message: "Product not found" });
      }

      const [relatedProducts, moreProducts] = await Promise.all([
        productModel
          .find({
            _id: { $ne: product.id },
            category: product.category,
          })
          .limit(12),

        productModel
          .find({
            _id: { $ne: product.id },
            sellerId: product.sellerId,
          })
          .limit(3),
      ]);

      const response = {
        product,
        relatedProducts,
        moreProducts,
      };
      console.log(response);

      responseReturn(res, 200, response);
    } catch (error) {
      console.error(error.message);
      responseReturn(res, 500, { message: "Server error" });
    }
  };

  // end method

  submit_review = async (req, res) => {
    const { productId, rating, review, name } = req.body;
    try {
      await reviewModel.create({
        productId,
        name,
        rating,
        review,
        date: moment(Date.now()).format("LL"),
      });

      const aggregatedData = await reviewModel.aggregate([
        { $match: { productId: new ObjectId(productId) } },
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);
      if (aggregatedData.length > 0) {
        const { averageRating } = aggregatedData[0];
        await productModel.findByIdAndUpdate(productId, {
          rating: averageRating.toFixed(1),
        });
      }

      responseReturn(res, 201, {
        message: "Review added successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  get_reviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    pageNo = parseInt(pageNo) || 1;
    const limit = 5; 
    const skipPage = limit * (pageNo - 1);

    try {
      const reviews = await reviewModel
        .find({ productId })
        .skip(skipPage)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalReview = await reviewModel.countDocuments({ productId });
      const ratingDistribution = await reviewModel.aggregate([
        { $match: { productId: new ObjectId(productId) } },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]);

      const rating_review = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        sum: ratingDistribution.find((item) => item._id === rating)?.count || 0,
      }));
      const response = {
        reviews,
        totalReview,
        rating_review,
      };
      responseReturn(res, 200, response);
    } catch (error) {
      console.error(error.message);
    }
  };
  // end method
}

module.exports = new homeControllers();
