import { useState } from 'react';

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

interface AddUserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAddUser: (user: Omit<User, 'id' | 'avatar'>) => void;
}

export const AddUserForm = ({ isOpen, onClose, onAddUser }: AddUserFormProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        status: true,
        birthday: new Date().toISOString().split('T')[0],
        skills: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            ...formData,
            skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
            birthday: new Date().toISOString()
        };
        onAddUser(newUser);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            status: true,
            birthday: new Date().toISOString().split('T')[0],
            skills: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Nuevo Usuario</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="skills" className="form-label">Habilidades (separadas por comas)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="react, javascript, typescript"
                                    required
                                />
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="status"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="status">Usuario Activo</label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Agregar Usuario</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}; 