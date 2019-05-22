import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";
import Users from "../user/user.model";

const sObj = db.sObj;
const Lead = sObj.define(
    "lead",
    {
        lead_source_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lead_title: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.HUNDRED]
            }
        },
        company_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        expected_closing_date: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        lead_value: {
            type: Sequelize.FLOAT(CONSTANTS.TEN, CONSTANTS.TWO),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        currency_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        is_confidential: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        contact_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        contact_person_phone: {
            type: Sequelize.BIGINT(CONSTANTS.TWENTY),
            allowNull: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        is_won: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        is_bell_ringed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_hand_over: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        lead_current_status_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        assigned_to: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        account_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        underscored: true
    }
);

const LeadAssignmentLog = sObj.define(
    "lead_assignment_log",
    {
        lead_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
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
        assigned_from: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        assigned_to: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        underscored: true
    }
);

const LeadStatusLog = sObj.define(
    "lead_status_log",
    {
        lead_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
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
        lead_status_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    },
    {
        underscored: true
    }
);
//SalesNews.belongsTo(Users);
//Users.hasMany(SalesNews);
sObj.sync()
    .then(() =>
        console.log(
            "Lead table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default { Lead, LeadAssignmentLog, LeadStatusLog };
