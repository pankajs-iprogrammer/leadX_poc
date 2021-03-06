import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";
import Users from "../user/user.model";
import Companies from "../contact/company.model";
import LeadStatus from "../master/leadStatus.model";
import Person from "../contact/person.model";
import Currency from "../master/currency.model";
import LeadSource from "../master/leadSource.model";

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
            type: Sequelize.STRING(CONSTANTS.TWENTY),
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
            type: Sequelize.STRING(CONSTANTS.TWENTY),
            allowNull: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        is_won: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        is_bell_ringed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_hand_over: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: CONSTANTS.ZERO
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

Lead.belongsTo(Users, { foreignKey: "created_by", as: "createdBy" });
Users.hasMany(Lead, { foreignKey: "created_by" });
Lead.belongsTo(Users, { foreignKey: "assigned_to", as: "assignedTo" });
Users.hasMany(Lead, { foreignKey: "assigned_to" });

Lead.belongsTo(Companies, { foreignKey: "company_id" });
Companies.hasMany(Lead, { foreignKey: "company_id" });

Lead.belongsTo(LeadStatus, { foreignKey: "lead_current_status_id" });
LeadStatus.hasMany(Lead, { foreignKey: "lead_current_status_id" });

Lead.belongsTo(Person, { foreignKey: "contact_id" });
Person.hasMany(Lead, { foreignKey: "contact_id" });

LeadStatusLog.belongsTo(Lead, { foreignKey: "lead_id" });
Lead.hasMany(LeadStatusLog, { foreignKey: "lead_id" });

Lead.belongsTo(Currency, { foreignKey: "currency_id" });
Currency.hasMany(Lead, { foreignKey: "currency_id" });

LeadStatusLog.belongsTo(LeadStatus, { foreignKey: "lead_status_id" });
LeadStatus.hasMany(LeadStatusLog, { foreignKey: "lead_status_id" });

Lead.belongsTo(LeadSource, { foreignKey: "lead_source_id" });
LeadSource.hasMany(Lead, { foreignKey: "lead_source_id" });

/*sObj.sync()
    .then(() =>
        console.log(
            "Lead table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));*/
export default { Lead, LeadAssignmentLog, LeadStatusLog };
