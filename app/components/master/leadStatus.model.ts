import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const LeadStatus = sObj.define(
    "lead_status",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.FIFTY]
            }
        }
    },
    {
        underscored: true
    }
);

LeadStatus.sync()
    .then(function() {
        // Table created
        LeadStatus.create({
            name: "New"
        });
        LeadStatus.create({
            name: "Lead"
        });
        LeadStatus.create({
            name: "Negotiation"
        });
        LeadStatus.create({
            name: "Proposal"
        });
        LeadStatus.create({
            name: "Close"
        });
    })
    .then(c => {
        console.log("Created user Stat", c.toJSON());
    })
    .catch(e => console.error(e));
export default LeadStatus;
