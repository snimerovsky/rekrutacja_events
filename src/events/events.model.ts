import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

@Table({tableName: 'event'})
export class Event extends Model<Event>{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    start_date: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    end_date: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    @BelongsTo(() => User)
    user: User;
}
