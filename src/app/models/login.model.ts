export interface Login {
	username: string;
	password: string;
	uid: string;
	fullname: string;
	access_token: string;
	refresh_token: string;
	res: object;
	[0]: any;
	status: string;
}

export interface BackendSessionCheck {
	res: object;
	[0]: any;
	status: string;
	access_token: string;
	refresh_token: string;
	uid: string;
	profile_pic: string;
	permission: string;
	fullname: string;
}

export interface UpdateProfilePic {
	res: string;
	response: string;
	profile_pic: string;
}

export interface UpdatePassword {
	uid: string;
	password: string;
	confirm_password: string;
}

export interface RefreshToken {
	token: object;
	[0]: any;
	access_token: string;
}

export interface RefreshTokenExpired {
	res: object;
	[0]: any;
	status: string;
}

export interface Logout {
	res: object;
	[0]: any;
	status: string;
}

