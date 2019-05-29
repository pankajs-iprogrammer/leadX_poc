import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";
import Users from "../user/user.model";

const sObj = db.sObj;
const SalesNews = sObj.define(
    "sales_news",
    {
        title: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.HUNDRED]
            }
        },
        cover_image: {
            type: Sequelize.STRING(CONSTANTS.TWOHUNDREDFIFTYFIVE)
            //allowNull: false,
            /*validate: {
      notEmpty: true,
      len: [0, 100],
    },*/
        },
        news_body: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        account_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        underscored: true
    }
);

SalesNews.belongsTo(Users, { foreignKey: "created_by" });
Users.hasMany(SalesNews, { foreignKey: "created_by" });

/*sObj.sync()
    .then(() =>
        console.log(
            "Sales News table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));*/
export default SalesNews;
