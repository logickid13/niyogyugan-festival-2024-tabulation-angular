export interface Municipalities {
    munic_id: string;
    munic_name: string;
}

export interface MunicipalitiesAutocomplete {
    munic_id: string;
    munic_name: string;
    option: object;
	toLowerCase: any;
	includes: any;
}

export interface Contests {
    c_id: string;
    c_name: string;
}

export interface ContestsAutocomplete {
    c_id: string;
    c_name: string;
    option: object;
	toLowerCase: any;
	includes: any;
}
