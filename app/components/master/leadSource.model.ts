import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const LeadSource = sObj.define(
    "lead_source",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.HUNDRED]
            }
        }
    },
    {
        underscored: true
    }
);
/*
LeadStatus.sync()
    .then(function() {
        // Table created
        LeadStatus.create({
            name: "Lead"
        });
        LeadStatus.create({
            name: "Opportunity"
        });
        LeadStatus.create({
            name: "Negotiation"
        });
        LeadStatus.create({
            name: "Proposal"
        });
        LeadStatus.create({
            name: "Closed"
        });
    })
    .then(c => {
        console.log("Created user Stat", c.toJSON());
    })
    .catch(e => console.error(e));*/
export default LeadSource;
