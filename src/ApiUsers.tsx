import { useState, useEffect } from "react"
import { getUsers } from "./components/helpers/getUsers"
import { AddUserForm } from "./components/AddUserForm"
import './styles/ApiUsers.css'

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
    const [apiUsers, setApiUsers] = useState<User[]>([]);
    const [localUsers, setLocalUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Carga de usuarios De la API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers(showOnlyActive);
                setApiUsers(data);
                setError('');
            } catch (err) {
                setError('Error al cargar los usuarios');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [showOnlyActive]);

    // Combinar usuarios de la API y locales
    const allUsers = [...apiUsers, ...localUsers];

    // Función para agregar usuario local
    const handleAddUser = (newUser: Omit<User, 'id' | 'avatar'>) => {
        const newLocalUser = {
            ...newUser,
            id: Math.max(...allUsers.map(u => u.id)) + 1,
            avatar: [{ name: 'default.jpg', url: 'https://via.placeholder.com/150' }]
        };
        setLocalUsers([...localUsers, newLocalUser]);
    };

    const handleDeleteUser = (userId: number) => {
        // Verificar si el usuario es local
        const isLocalUser = localUsers.some(user => user.id === userId);
        
        if (isLocalUser) {
            if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                setLocalUsers(localUsers.filter(user => user.id !== userId));
            }
        } else {
            alert('No se pueden eliminar usuarios de la API');
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div className="container-table">
            <div className="actions-container">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="activeUsersSwitch"
                        checked={showOnlyActive}
                        onChange={(e) => setShowOnlyActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="activeUsersSwitch">
                        Mostrar solo usuarios activos
                    </label>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsFormOpen(true)}
                >
                    Agregar Usuario
                </button>
            </div>

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
                        <th scope="col">Origen</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.status ? 'Activo' : 'Inactivo'}</td>
                            <td>{user.skills.join(', ')}</td>
                            <td>
                                {localUsers.some(localUser => localUser.id === user.id) 
                                    ? 'Local' 
                                    : 'API'}
                            </td>
                            <td>
                                {localUsers.some(localUser => localUser.id === user.id) && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddUserForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddUser={handleAddUser}
            />
        </div>
    )
};
