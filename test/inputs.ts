const getAllDetails = {
    arrayFilters: [{}],
    selectFilters: [],
    sort: {
        field: "name",
        sortOrder: "ASC"
    },
    paginate: {
        page: 0,
        limit: 100
    }
};
const deleteDetails = {
    id: "10",
    is_deleted: "1"
};
class InputstoTest {
    public getAllContactPerson() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0 };
        const req = getAllDetails;
        return req;
    }
    public getContactPersonOne() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0, id: 2 };
        const req = getAllDetails;
        return req;
    }
    public addContactPerson() {
        const req = {
            name: "AshwiniB",
            company_id: "2",
            phone_number: "122225555",
            email: "xyz@gmail.com",
            address_line_1: "BH Road1",
            address_line_2: "Near FG chaouk",
            country_id: "36",
            state_id: "311",
            city_id: "55",
            notes: "noted"
        };
        return req;
    }
    public deleteContactPerson() {
        return deleteDetails;
    }
    public updateContactPerson() {
        const req = {
            id: "27",
            name: "Monika M",
            company_id: "15",
            phone_number: "122225555",
            email: "xyz@gmail.com",
            address: "ddd qqq eee",
            country_id: "3",
            state_id: "311",
            notes: "frr dvnh f"
        };
        return req;
    }
    public getAllContactCompany() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0 };
        getAllDetails.sort.field = "company_name";
        const req = getAllDetails;
        getAllDetails.sort.field = "name";
        return req;
    }
    public getContactCompanyOne() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0, id: 2 };
        const req = getAllDetails;
        return req;
    }
    public addContactCompany() {
        const req = {
            company_name: "Yahoo",
            company_code: "11Y",
            office_address_line_1: "sdafs dsgdbh dfgh",
            office_address_line_2: "dfg dfsg",
            postal_address: "vbgh",
            country_id: "3",
            state_id: "311",
            city_id: "444",
            website: "www.idea.com",
            contact_person_name: "Mr Ashutosh Nayar",
            contact_person_phone: "555555777",
            contact_person_email: "asd@gmail.com",
            notes: "fgfdg"
        };
        return req;
    }
    public deleteContactCompany() {
        return deleteDetails;
    }
    public updateContactCompany() {
        const req = {
            id: 4,
            company_name: "MasterG",
            company_code: "M0",
            office_address_line_1: "sdafs dsgdbh dfgh",
            office_address_line_2: "dfg dfsg",
            postal_address: "vbgh",
            country_id: "3",
            state_id: "311",
            city_id: "444",
            website: "www.idea.com",
            contact_person_name: "Mr Ashutosh Nayar",
            contact_person_phone: "555555777",
            contact_person_email: "asd@gmail.com",
            notes: "fgfdg"
        };
        return req;
    }
    public getAllMasterCountry() {
        return getAllDetails;
    }
    public getAllMasterState() {
        getAllDetails.arrayFilters[0] = { country_id: 5 };
        const req = getAllDetails;
        return req;
    }
    public getAllMasterCity() {
        getAllDetails.arrayFilters[0] = { country_id: 5, state_id: 11 };
        const req = getAllDetails;
        return req;
    }
    public getAllMasterLeadStatus() {
        return getAllDetails;
    }
    public getAllMasterActivityType() {
        return getAllDetails;
    }
    public getAllMasterCurrency() {
        return getAllDetails;
    }
    public getAllMasterLeadSource() {
        return getAllDetails;
    }
    public getAllMAsterRoles() {
        return getAllDetails;
    }
    public getAllMasterlicenseType() {
        return getAllDetails;
    }
    public addNewLead() {
        const req = {
            lead_source_id: 1,
            lead_title: "sasasa",
            company_id: 1,
            expected_closing_date: "2019-05-20",
            lead_value: 1000,
            currency_id: 1,
            is_confidential: 0,
            contact_id: 1,
            contact_person_phone: 1234567894,
            notes: "This is a notes123",
            is_won: null,
            is_bell_ringed: 0,
            is_hand_over: 0,
            assigned_to: null
        };
        return req;
    }
    public updateLead() {
        const req = {
            id: 2,
            lead_source_id: 1,
            lead_title: "sasasa",
            company_id: 1,
            expected_closing_date: "2019-05-20",
            lead_value: 1000,
            currency_id: 1,
            is_confidential: 0,
            contact_id: 1,
            contact_person_phone: 1234567894,
            notes: "This is a notes123",
            is_won: null,
            is_bell_ringed: 0,
            is_hand_over: 0,
            assigned_to: null
        };
        return req;
    }
    public getAllLeadList() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0 };
        const req = getAllDetails;
        return req;
    }
    public getLeadOne() {
        getAllDetails.arrayFilters[0] = { id: 2, is_deleted: 0 };
        const req = getAllDetails;
        return req;
    }
    public getAllSalesFeed() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0 };
        const req = getAllDetails;
        return req;
    }
    public getAllSalesNewsList() {
        getAllDetails.arrayFilters[0] = { is_deleted: 0 };
        const req = getAllDetails;
        return req;
    }
    public addNewSalesNews() {
        const req = {
            title: "html sub",
            news_body: "test body",
            attachment: {
                fileName: "logo_new.png",
                fileExtension: "image/png",
                fileBody:
                    "data:image/png;base64,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",
                parentFolder: "sales_news"
            }
        };
        return req;
    }
    public updateSalesNews() {
        const req = {
            id: 1,
            title: "html sub",
            news_body: "test1 body",
            attachment: {
                fileName: "logo_new.png",
                fileExtension: "image/png",
                fileBody:
                    "data:image/png;base64,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",
                parentFolder: "sales_news"
            }
        };
        return req;
    }
    public deleteSalesNews() {
        return deleteDetails;
    }
    public getSalesNewsOne() {
        getAllDetails.arrayFilters[0] = { id: 1 };
        const req = getAllDetails;
        return req;
    }
    public getSalesNewsById() {
        const req = {
            id: 1
        };
        return req;
    }
}

export default InputstoTest;
