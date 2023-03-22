import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table({tableName: 'user'})
export class User extends Model<User>{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    refresh_token: string;

    @Column({
        type: DataType.BLOB('long'),
        allowNull: true,
    })
    profile_picture: Buffer;
}
