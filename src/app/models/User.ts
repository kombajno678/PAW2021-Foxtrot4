export class User {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;

    constructor(
        id: number = null,
        login: string = null,
        first_name: string = null,
        last_name: string = null,
        email: string = null,

    ) {

        this.id = id;
        this.login = login;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = null;

    }

}