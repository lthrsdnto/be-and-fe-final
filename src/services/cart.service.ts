import CommonResponse from "../utils/response.util";
import Cart from "../models/tables/Cart";
import { AddCartDTO } from "../models/dto/CartDTO";
import { Op } from "sequelize";
import Product from "../models/tables/Product";
import User from "../models/tables/User";
import Shop from "../models/tables/Shop";

class CartService extends CommonResponse {
  //create
  async addTocart(dto: AddCartDTO["requestObject"]) {
    try {
      let exist = await Product.findOne({
        where: { id: dto.product_id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      //check if user is exists
      let userActive = await User.findOne({
        where: { id: dto.user_id },
      });

      if (userActive == null) {
        return this.RESPONSE(200, userActive, 0, "User does not exist.");
      }

      //check if shop is available
      let shopActive = await Shop.findOne({
        where: { [Op.and]: [{ id: dto.shop_id }, { is_active: true }] },
      });

      if (!shopActive) {
        return this.RESPONSE(
          200,
          shopActive,
          0,
          "Cannot add items because shop is deactivated/not exist."
        );
      }

      //check if product is available
      let productActive = await Product.findOne({
        where: { [Op.and]: [{ id: dto.product_id }, { is_active: true }] },
      });

      if (!productActive) {
        return this.RESPONSE(
          200,
          productActive,
          0,
          "Cannot add items because product is deactivated/not exist."
        );
      }

      //must be same shop when adding items to cart
      if (shopActive?.id != productActive?.shop_id) {
        return this.RESPONSE(
          200,
          {},
          0,
          "You must add items from the same shop."
        );
      }

      //limit item to 5 per shop
      let cartLimit = await Cart.count({
        where: { shop_id: dto.shop_id },
      });

      if (cartLimit > 4) {
        return this.RESPONSE(200, cartLimit, 0, "Only 5 items per shop.");
      }

      //already in cart
      let prodExist = await Cart.findOne({
        where: { product_id: dto.product_id },
      });

      if (prodExist) {
        return this.RESPONSE(200, {}, 0, "Item already added in cart.");
      }

      let count: number = await Cart.count();
      if (exist != null) {
        let response = await Cart.create({
          ...dto,
          user_id: userActive ? userActive.id : dto.user_id,
          shop_id: shopActive ? shopActive.id : dto.shop_id,
          product_id: productActive ? productActive.id : dto.product_id,
          is_active: true,
          quantity: 1,
        });

        if (response !== null) {
          return this.RESPONSE(200, response, count, "Item added to cart.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to add item in cart.");
        }
      } else {
        return this.RESPONSE(200, exist, 0, "Item not exist.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //cart
  async cart() {
    try {
      let exist = await Cart.findAll({
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: Product,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Shop,
                attributes: {
                  exclude: [
                    "address",
                    "business_type",
                    "createdAt",
                    "updatedAt",
                  ],
                },
              },
            ],
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      let count: number = await Cart.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Cart items found.");
      } else {
        return this.RESPONSE(404, [], 0, "No items found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //remove by id
  async deleteItem(dto: AddCartDTO["requestObject"]) {
    try {
      let exist = await Cart.findOne({ where: { id: dto } });
      let count: number = await Cart.count();
      if (exist != null) {
        let removeData = await Cart.destroy({ where: { id: dto } });
        if (removeData != null) {
          return this.RESPONSE(200, {}, count, "Item deleted.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete item.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Item not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //empty cart
  async emptyCart() {
    try {
      let exist = await Cart.findAll();
      let count: number = await Cart.count();
      if (exist != null) {
        let removeData = await Cart.destroy({
          where: {},
          truncate: true,
        });
        if (removeData != null) {
          return this.RESPONSE(200, {}, count, "Items deleted/ Cart empty.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete item.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Item not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //update
  async updateItem(dto: AddCartDTO["requestObject"]) {
    try {
      let exist = await Cart.findOne({ where: { id: dto.id } });
      let count: number = await Cart.count();
      if (exist != null) {
        let updateData = await Cart.update(dto, {
          where: { id: dto.id },
        });
        if (updateData != null) {
          return this.RESPONSE(
            202,
            updateData,
            count,
            "Item information updated."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to update item.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Item not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }
}

export default new CartService();
