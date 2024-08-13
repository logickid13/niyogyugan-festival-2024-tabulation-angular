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

export interface FloatStanding {
    town: string;
    votes: number;
}

export interface VoterData {
    town: string;
    votes: number;
  }

export interface ContestsAutocomplete {
    c_id: string;
    c_name: string;
    option: object;
	toLowerCase: any;
	includes: any;
}

export interface ConsolationTable {
    municipality_id: string;
    municipality: string;
    contest_id: string;
    contest: string;
}

export interface UpdateConsolationFinalScores {
    municipality_name: string;
    contest_name: string;
    municipality_id: string;
    contest_id: string;
    munic_arr: string;
    score_to_be_added: string;
    res: object;
    [0]: any;
    status: string;
}
