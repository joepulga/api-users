import { useState, useEffect } from "react"
import { getUsers } from "./components/helpers/getUsers"

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

export const ApiUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers();
                setUsers(data);
                setError('');
            } catch (err) {
                setError('Error al cargar los usuarios');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <>
            <h1>Listado de usuarios</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Habilidades</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.status ? 'Activo' : 'Inactivo'}</td>
                            <td>{user.skills.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
