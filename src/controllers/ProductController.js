const { Op } = require('sequelize');
const Product = require('../models/product');
const Category = require('../models/category');
const Sequelize = require('sequelize');
const ProductVariant = require('../models/productVariant')
const ProductPicture = require('../models/productPicture');

let create = async (req, res, next) => {
    //POST và PUT trong Create hay Update thường sẽ dùng req.body
  let name = req.body.name;
    if (name === null || name === undefined || name.trim() === '') {
        return res.status(400).send('Trường name không được rỗng');
      }
      
    let categoryID = parseInt(req.body.categoryID);
    if (categoryID === undefined) 
      return res.status(400).send('Trường categoryID không tồn tại');
    
  
    let price = parseFloat(req.body.price);
    if (price === undefined) return res.status(400).send('Trường price không tồn tại');
  
    let description = req.body.description || '';
   
    
   
    try {
      let newProduct = await Product.create({ name, description, categoryID, price, });
      return res.send(newProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Gặp lỗi khi tạo dữ liệu vui lòng thử lại');
    }
  }
  let update = async (req, res, next) => {
    let productID = req.body.productID;
    if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let categoryID = req.body.categoryID;
    if (categoryID === undefined) return res.status(400).send('Trường categoryID không tồn tại');
    let price = parseFloat(req.body.price);
    if (price === undefined) return res.status(400).send('Trường price không tồn tại');
    let description = req.body.description || '';
    
    
    try {
        let category = await Category.findOne({ where: { categoryID } });
        if (category == null) return res.status(400).send('Danh mục này không tồn tại');
        let product = await Product.findOne({ where: { productID } });
        if (product == null) return res.status(400).send('Sản phẩm này không tồn tại');

        
        await product.update({ name, categoryID, description,price,})

        return res.send("Success")
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}


let listAdminSide = async (req, res, next) => {
  let listProductVariant = await ProductVariant.findAll({
      attributes: ['productVariantID', 'quantity', 'created_at','colour','size'],
      include: [
          {
              model: Product, attributes: ['productID', 'name','price'],
             
          },
          
          
      ],
      order: [['created_at', 'DESC']]
  });
  listProductVariant = listProductVariant.map((productVariant) => {
      let newProductVariant = {
          productID: productVariant.Product.productID,
          productVariantID: productVariant.productVariantID,
          name: productVariant.Product.name,
          colourName: productVariant.colour,
          sizeName: productVariant.size,
          
          price: productVariant.Product.price,
          quantity: productVariant.quantity,
          
          created_at: productVariant.created_at
      }
      return newProductVariant;
  });
  return res.send(listProductVariant);
}
let listCustomerSide = async (req, res, next) => {
  let categoryID = Number(req.query.category);
  let whereClause = {};

  if (categoryID != undefined && Number.isInteger(categoryID)) {
    whereClause.categoryID = categoryID;
  }

  try {
    let listProduct = await Product.findAll({
      attributes: ['productID', 'name', 'rating', 'sold', 'price'],
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [
        { model: ProductVariant, attributes: ['productVariantID'], where: { quantity: { [Op.gt]: 0 } } }, // Chỉ lấy biến thể có số lượng > 0
        { model: Category, attributes: ['name'] }
      ]
    });
   
    listProduct = listProduct.map(product => {
      let productVariantIDs = product.productVariants?.map(variant => variant.productVariantID) || [];
      return {
        productID: product.productID,
        name: product.name,
        rating: product.rating,
        sold: product.sold,
        
        price: product.price,
        categoryName: product.Category.name,
        productVariantIDs: productVariantIDs // Thêm mảng productVariantIDs
      };
    });

    return res.send(listProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
  }
}

let detailCustomerSide = async (req, res, next) => {
  let productID = req.params.productID;
  if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');

  try {
      let productDetail = await Product.findOne({
          attributes: ['productID', 'name', 'description', 'rating', 'sold','price'],
          where: { productID },
          raw: true
      });
      return res.send(productDetail);
  } catch (err) {
      console.log(err);
      return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
  }
}
let detailAdminSide = async (req, res, next) => {
  let productID = req.params.productID;
  if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');

  try {
      let productDetail = await Product.findOne({
          attributes: ['productID', 'name', 'categoryID', 'description','price'],
          include: [
              { model: Category, attributes: ['name'] },
              
              {
                  model: ProductVariant, attributes: ['productVariantID', 'colour', 'size', 'quantity'],
                 
              }
          ],
          where: { productID },
      });

      if (productDetail) {
          let productVariantList = productDetail.productVariants.map((productVariant) => {
              
              return {
                  productVariantID: productVariant.productVariantID,
                  
                  colour: productVariant.colour,
                  
                  size: productVariant.size,
                  quantity: productVariant.quantity,
                
              }
          })
          productDetail = {
              productID: productDetail.productID,
              name: productDetail.name,
              categoryID: productDetail.categoryID,
              CategoryName: productDetail.Category.name,
              price: productDetail.price,
              description: productDetail.description,
              productVariantList: productVariantList
          }
          return res.send(productDetail);
      } else {
          return res.status(400).send('Biến thể sản phẩm này không tồn tại');
      }
  } catch (err) {
      console.log(err);
      return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
  }
}
let listColour = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined) {
      return res.status(400).send("Trường productID không tồn tại");
    }
  let Size = req.params.size;
  if (Size === undefined) {
      return res.status(400).send("Trường productID không tồn tại");
  }
    try {
      let listColour = await ProductVariant.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("colour")), "colour"],
        ], // Lấy danh sách các màu duy nhất
        where: { productID,Size },
      });
  
      listColour = listColour.map((item) => item.get("colour")); // Chuyển đổi thành mảng các màu
  
      return res.send(listColour);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
  };
  
  let listSize = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined) {
      return res.status(400).send("Trường productID không tồn tại");
    }
    
  
    try {
      let listSize = await ProductVariant.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("size")), "size"], // Lấy danh sách size duy nhất
        ],
        where: { productID },
      });
  
      listSize = listSize.map((item) => item.get("size")); // Chuyển đổi thành mảng size
  
      return res.send(listSize);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
  };
  


  module.exports={
    create,update,listAdminSide,listCustomerSide,detailAdminSide,detailCustomerSide,listColour,listSize
  }