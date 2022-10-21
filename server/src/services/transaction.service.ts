import Cart from "../models/tables/Cart";
import CommonResponse from "../utils/response.util";
import { Op } from "sequelize";
import sequelize from "sequelize/types/sequelize";
import { AddTransactionDTO } from "../models/dto/TransactionDTO";
import Shop from "../models/tables/Shop";
import Transaction from "../models/tables/Transaction";

class TransactionService extends CommonResponse {
  //create
  async createTr(dto: AddTransactionDTO["requestObject"]) {
    try {
      //cart items is zero
      let existCart = await Cart.findOne({
        where: { id: dto.cart_id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (existCart?.id == 0) {
        return this.RESPONSE(200, existCart, 0, "Cart items is zero.");
      }

      //transaction in progress
      let status = await Transaction.findOne<any>({
        where: {
          transaction_status: { [Op.iLike]: `%${dto.transaction_status}%` },
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (status) {
        return this.RESPONSE(200, status, 0, "Transaction is still ongoing.");
      }

      //check if shop is available
      let active = await Shop.findOne({
        where: { [Op.and]: [{ id: dto.shop_id }, { is_active: true }] },
      });

      if (!active) {
        return this.RESPONSE(
          200,
          active,
          0,
          "Transaction failed because shop is deactivated/not exist."
        );
      }

      let date = await Transaction.findAll({
        attributes: [
          "id",
          [
            sequelize.fn("date_format", sequelize.col("date_col"), "%Y-%m-%d"),
            "date_col_formed",
          ],
        ],
      });

      let exist = await Transaction.findOne();
      let count: number = await Transaction.count();

      if (exist != null) {
        let response = await Transaction.create({
          ...dto,

          transaction_date: date,
          transaction_status: status,
          is_active: true,
        });

        if (response !== null) {
          return this.RESPONSE(200, response, count, "Added to transaction.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to add transaction.");
        }
      } else {
        return this.RESPONSE(200, exist, 0, "Transaction not exist.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //cart
  async transactions() {
    try {
      let exist = await Cart.findAll();
      let count: number = await Cart.count();
      if (exist.length != 0) {
        return this.RESPONSE(200, exist, count, "Transactions found.");
      } else {
        return this.RESPONSE(404, [], 0, "No transaction found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //remove by id
  async deleteTr(dto: AddTransactionDTO["requestObject"]) {
    try {
      let exist = await Transaction.findOne({ where: { id: dto } });
      let count: number = await Transaction.count();
      if (exist != null) {
        let removeData = await Transaction.destroy({ where: { id: dto } });
        if (removeData != null) {
          return this.RESPONSE(200, {}, count, "Transaction deleted.");
        } else {
          return this.RESPONSE(400, {}, 0, "Failed to delete transaction.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Transaction not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }

  //update
  async updateTr(dto: AddTransactionDTO["requestObject"]) {
    try {
      let exist = await Transaction.findOne({ where: { id: dto.id } });
      let count: number = await Transaction.count();
      if (exist != null) {
        let updateData = await Transaction.update(dto, {
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
          return this.RESPONSE(400, {}, 0, "Failed to update transaction.");
        }
      } else {
        return this.RESPONSE(404, {}, 0, "Transaction not found.");
      }
    } catch (error) {
      return this.RESPONSE(500, error, 0, "Internal Server Error.");
    }
  }
}

export default new TransactionService();
