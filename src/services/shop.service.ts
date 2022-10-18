import CommonResponse from "../utils/response.util";
import Shop from "../models/tables/Shop";
import { AddShopDTO } from "../models/dto/ShopDTO";
import { Op } from "sequelize";
import Product from "../models/tables/Product";

class ShopService extends CommonResponse {
  //get all shop with products
  async shopsAnditems() {
    try {
      let exist = await Shop.findAll({
        include: [
          {
            model: Product,
            attributes: {
              exclude: ["shop_id", "createdAt", "updatedAt"],
            },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Shops found.");
      } else {
        return this.RESPONSE(404, [], 0, "No shop found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //get shops
  async shops() {
    try {
      let exist = await Shop.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Shops found.");
      } else {
        return this.RESPONSE(404, [], 0, "No shop found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //get all active shop
  async activeShops() {
    try {
      let exist = await Shop.findAll({
        where: { is_active: true },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count({ where: { is_active: true } });
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Active shop found.");
      } else {
        return this.RESPONSE(404, [], 0, "No shop found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //get one shop
  async oneShop(dto: AddShopDTO["requestObject"]) {
    try {
      let exist = await Shop.findOne({
        where: { [Op.and]: [{ id: dto }, { is_active: true }] },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count({
        where: { [Op.and]: [{ id: dto }, { is_active: true }] },
      });
      if (exist !== null) {
        return this.RESPONSE(200, exist, count, "Shop record found.");
      } else {
        return this.RESPONSE(404, {}, 0, "No shop found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //create
  async create(dto: AddShopDTO["requestObject"]) {
    try {
      let exist = await Shop.findOne({
        where: { name: dto.name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist == null) {
        let response = await Shop.create({ ...dto });
        if (response !== null) {
          return this.RESPONSE(200, response, count, "Shop added.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to create shop.");
        }
      } else {
        return this.RESPONSE(200, exist, 0, "Shop already exist.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //update
  async update(dto: AddShopDTO["requestObject"]) {
    try {
      let exist = await Shop.findOne({
        where: { id: dto.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist != null) {
        let updateData = await Shop.update(dto, {
          where: { id: dto.id },
        });
        if (updateData != null) {
          return this.RESPONSE(
            202,
            updateData,
            count,
            "Shop information updated."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to update shop.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Shop not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //activate and de-activate
  async isActive(dto: AddShopDTO["requestObject"]) {
    try {
      let exist = await Shop.findOne({
        where: { id: dto.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist != null) {
        let updateData = await Shop.update(
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
            "Shop active state updated."
          );
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to activate.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Shop not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //delete
  async delete(dto: AddShopDTO["requestObject"]) {
    try {
      let exist = await Shop.findOne({
        where: { id: dto },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      let count: number = await Shop.count();
      if (exist != null) {
        let removeData = await Shop.destroy({ where: { id: dto } });
        if (removeData != null) {
          return this.RESPONSE(200, {}, count, "Shop deleted.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete shop.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Shop not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }
}

export default new ShopService();
