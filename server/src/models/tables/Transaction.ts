import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  ForeignKey,
} from "sequelize-typescript";
import Cart from "./Cart";
import Shop from "./Shop";

@Table({ tableName: "User" })
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: Number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id?: Number;

  @ForeignKey(() => Shop)
  @Column(DataType.INTEGER)
  shop_id?: Number;
  @Column(DataType.DATE) transaction_data?: String;
  @Column(DataType.FLOAT) total_price?: Number;
  @Column(DataType.STRING) transaction_status?: String;
  @Column(DataType.BOOLEAN) is_active?: Boolean;
}
