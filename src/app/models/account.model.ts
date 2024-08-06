export interface Account {
	id_no: number;
	username: string;
	fullname: string;
	profile_pic : string;
	active: number;
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
	username: string;
	fullname: string;
}

export interface UserPermission {
	id: string;
	permission: string;
	isSelected: boolean;
    isEditable: boolean;
    sub_permission: UserSubPermission[]
}

export interface UserSubPermission {
    id: string;
	permission: string;
	isSelected: boolean;
    isEditable: boolean;
}

export interface NewAccount {
	username: string;
	password: string;
	confirm_password: string;
	fullname: string;
	permission_arr: number[];
	profile_pic: string;
	response: string;
	res: object;
	[0]: any;
	status: string;
}

export interface UpdateBasicInfo {
	id_no: string;
	username: string;
	fullname: string;
	permission_arr: number[];
	active: string;
	response: string;
	res: object;
	[0]: any;
	status: string;
}

export interface UpdatePassword {
	id_no: string;
	password: string;
	confirm_password: string;
	response: string;
	res: object;
	[0]: any;
	status: string;
}

export interface UnlockAccount {
	accountUsername: string;
	res: object;
	[0]: any;
	status: string;
}
