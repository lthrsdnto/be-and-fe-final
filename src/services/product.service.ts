import CommonResponse from "../utils/response.util";
import Product from "../models/tables/Product";
import { Op } from "sequelize";
import { AddProductDTO } from "../models/dto/ProductDTO";

class ShopService extends CommonResponse {
  //get all product
  async products() {
    try {
      let exist = await Product.findAll();
      let count: number = await Product.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Products found.");
      } else {
        return this.RESPONSE(404, [], 0, "No product found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //get all active product
  async activeProducts() {
    try {
      let exist = await Product.findAll({ where: { is_active: true } });
      let count: number = await Product.count({ where: { is_active: true } });
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Active product found.");
      } else {
        return this.RESPONSE(404, [], 0, "No product found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //get one product
  async oneProduct(dto: AddProductDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({
        where: { [Op.and]: [{ id: dto }, { is_active: true }] },
      });
      let count: number = await Product.count({
        where: { [Op.and]: [{ id: dto }, { is_active: true }] },
      });
      if (exist !== null) {
        return this.RESPONSE(200, exist, count, "Product record found.");
      } else {
        return this.RESPONSE(404, {}, 0, "No product found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //create
  async create(dto: AddProductDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({
        where: { product_name: dto.product_name },
      });
      let count: number = await Product.count();
      if (exist == null) {
        let response = await Product.create({ ...dto });
        if (response !== null) {
          return this.RESPONSE(200, response, count, "Product added.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to create product.");
        }
      } else {
        return this.RESPONSE(200, exist, 0, "Product already exist.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //update
  async update(dto: AddProductDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({ where: { id: dto.id } });
      let count: number = await Product.count();
      if (exist != null) {
        let updateData = await Product.update(dto, {
          where: { id: dto.id },
        });
        if (updateData != null) {
          return this.RESPONSE(
            202,
            updateData,
            count,
            "Product information updated."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to update product.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Product not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //activate and de-activate
  async isActive(dto: AddProductDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({ where: { id: dto.id } });
      let count: number = await Product.count();
      if (exist != null) {
        let updateData = await Product.update(
          { id: dto.id, is_active: dto.is_active },
          {
            where: { id: dto.id },
          }
        );
        if (updateData != null) {
          return this.RESPONSE(
            202,
            updateData,
            count,
            "Product active state updated."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to activate.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Product not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //delete
  async delete(dto: AddProductDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({ where: { id: dto } });
      let count: number = await Product.count();
      if (exist != null) {
        let removeData = await Product.destroy({ where: { id: dto } });
        if (removeData != null) {
          return this.RESPONSE(200, {}, count, "Product deleted.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete product.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Product not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }
}

export default new ShopService();
