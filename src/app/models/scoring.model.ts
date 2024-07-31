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

export interface GetCurrentScore {
    municipality_id: string;
    contest_id: string;
    res: any;
    [0]: any;
    s_id: string;
    s_score: string;
}

export interface CurrentScoreToBeSent {
    rec_id: string;
    current_score: string;
    score_to_be_added: string;
    municipality: string;
    contest: string;
    res: object;
    [0]: any;
    status: string;
}
