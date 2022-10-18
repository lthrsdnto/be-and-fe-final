// import { Transaction } from "sequelize";
// import {
//   Table,
//   Column,
//   DataType,
//   Model,
//   PrimaryKey,
//   BelongsTo,
//   ForeignKey,
//   AutoIncrement,
//   BelongsToMany,
//   HasOne,
//   HasMany,
// } from "sequelize-typescript";
// import Product from "./Product";
// import Shop from "./Shop";
// import User from "./User";
// import Transaction from "./Transaction";
// import Cart from "./Cart";

// @Table({ tableName: "TransactionOrders" })
// export default class TransactionOrders extends Model<TransactionOrders> {
//   @PrimaryKey
//   @AutoIncrement
//   @Column(DataType.INTEGER)
//   id!: Number;

//   @ForeignKey(() => Transaction)
//   @Column(DataType.INTEGER)
//   transaction_id?: Number;

//   @ForeignKey(() => Cart)
//   @Column(DataType.INTEGER)
//   cart_id?: Number;
// }
