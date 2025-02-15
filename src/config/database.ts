import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME!,
//   process.env.DB_USER!,
//   process.env.DB_PASSWORD!,
//   {
//     host: process.env.DB_HOST!,
//     dialect: "postgres",
//     port: Number(process.env.DB_PORT),
//     logging: console.log,
//   }
// );

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ Database connection successful!",
      sequelize.getDatabaseName()
    );
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

export default sequelize;
