interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: boolean;
    birthday: string;
    skills: string[];
    avatar: {
        name: string;
        url: string;
    }[];
}

export const getUsers = async () => {
    const response = await fetch('https://api.fake-rest.refine.dev/users');
    if (!response.ok) throw new Error('Error al obtener los usuarios');
    const users: User[] = await response.json();
    return users;
}; 