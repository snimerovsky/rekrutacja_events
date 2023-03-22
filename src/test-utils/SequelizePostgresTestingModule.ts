import {SequelizeModule} from "@nestjs/sequelize";

export const SequelizePostgresTestingModule = (models: any[]) => SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST_TEST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_TEST,
    models: [...models],
    autoLoadModels: true,
})
