export interface ActivityLogs {
    log_id: string;
	timestamp: string;
	username: string;
	action_type: string;
	action: string;
}

export interface TableParameters {
	query: QueryParameters[];
	sort: string;
	order: string;
	currentPage: string;
	pageSize: string;
	rows: any;
	count: any;
	data: any;
}

export interface QueryParameters {
	query: any;
	start_dt: string;
	end_dt: string;
	username: string;
	action_type: string;
}

export interface UsersListAutocomplete {
	id_no: string;
	username: string;
	fullname: string;
	option: object;
	toLowerCase: any;
	includes: any;
}

export interface ActionType {
	action_id: number;
	action_name: string;
}
