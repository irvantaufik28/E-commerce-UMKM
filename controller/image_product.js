const resData = require("../helper/response");
const url = require("../libs/handle_upload");

module.exports = {
  getImageProductByProductID: async (req, res, next) => {
    let product_id = req.params.product_id;
    try {
      let resImage = await req.productImageUC.getImageProductByProductID(
        product_id
      );
      if (resImage.isSuccess !== true) {
        return res
          .status(resImage.status)
          .json(resData.failed(resImage.reason));
      }
      res.status(resImage.status).json(resData.success(resImage.data));
    } catch (e) {
      next(e);
    }
  },

  addProductImage: async (req, res, next) => {
    try {
      let dataImage = {
        url: await url.uploadCloudinaryProduct(req.file.path),
        product_id: req.body.product_id,
      };
      let resImage = await req.productImageUC.createImageProduct(dataImage);
      if (resImage.isSuccess !== true) {
        return res.status(resImage.status).json(resData.failed(resImage.reason, null));
      }
      res.status(200).json(resData.success(resImage.data));
    } catch (e) {
      next(e);
    }
  },
  updateImageProduct: async (req, res, next) => {
    try {
      let id  = req.params.id;
      let dataImage = {
        url: await url.uploadCloudinaryProduct(req.file.path),
        product_id: req.body.product_id,
      };
      let resImage = await req.productImageUC.updateImageProduct(dataImage, id);
      if (resImage.isSuccess !== true) {
        return res.status(resImage.status).json(resData.failed(resImage.reason));
      }
      res.status(resImage.status).json(resData.success());
    } catch (e) {
      next(e);
    }
  },
  deleteImageProduct: async (req, res, next) => {
    try {
      let id = req.params.id;

      let resImage = await req.productImageUC.deleteImageProduct(id);
      if (resImage.isSuccess !== true) {
        return res.status(resImage.status).json(resData.failed(resImage.reason));
      }
      res.status(resImage.status).json(resData.success());
    } catch (e) {
      next(e);
    }
  },
};