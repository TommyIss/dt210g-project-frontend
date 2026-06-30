import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminView from "./AdminView";
import UserView from "./UserView";
import type { User } from "../types/auth.types";
import { useLocation, useNavigate } from "react-router-dom";

function ProfilePage() {

    const {user, setUser} = useAuth();
    const [users, setUsers] = useState<User[] | []>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const navigate = useNavigate();
    

    const location = useLocation();

    useEffect(() => {
        if(user?.role === 'admin') {
            getUsers();
        }
        localStorage.setItem('pathname', location.pathname);
    }, []);

    async function getUsers() {
        try {
            let token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if(response.ok) {
                const data = await response.json();

                const otherUser = data.filter((otherUser: User) => otherUser.id !== user?.id);
                setUsers(otherUser);
            }

        } catch (error) {
            throw error;
        }
    }

    async function createNewUser(newData: Omit<User, 'id' | 'role'>) {
        try {
            
            let url = 'http://localhost:3000/users';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });

            if(response.ok) {
                const data = await response.json();

                const newUser = data.body;

                setUsers((prev) => [...prev, newUser].sort((a: User, b: User) => (a.firstname > b.firstname) ? 1: -1));
            }

        } catch (error) {
            throw error;
        }
    }

    async function createNewAdmin(newData: Omit<User, 'id' | 'role'>) {
        try {
            
            let token = localStorage.getItem('token');

            let url = 'http://localhost:3000/admin/create-admin';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(newData)
            });

            if(response.ok) {
                const data = await response.json();
                const newAdmin = data.body;
                
                setUsers((prev) => [...prev, newAdmin].sort((a: User, b:User) => (a.firstname > b.firstname) ? 1: -1));
                
            }

        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    }

    async function updateUser(id: number, newData: Omit<User, "id" | "role">) {
        try {
            
            let url = 'http://localhost:3000/users/' + id;
            let token = localStorage.getItem('token');

            const payload: any = {
                firstname: newData.firstname,
                lastname: newData.lastname,
                email: newData.email
            };

            // If-sats för att kontrollera att lösenord är inte tomt!
            if(newData.password?.trim() !== '') {
                payload.password = newData.password;
            }

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            });

            if(response.ok) {
                const data = await response.json();

                console.log(data);

                const updatedUser = data.updatedUser;

                // Om användare uppdaterar sig själv uppdaterar kontext
                if(updatedUser.id === user?.id) {
                    
                    setUser({
                        ...user,
                        ...updatedUser
                    });
                }

                

                setUsers((prev) => 
                    prev.map(user => (user.id === id ? updatedUser : user) ).sort((a: User, b: User) => (a.firstname > b.firstname) ? 1: -1)
                );

                
                setEditingId(null);
            }

        } catch (error) {
            
            localStorage.removeItem('token');
            throw error;
        }
    }

    async function deleteUser(id: number) {
        try {

            // Visa dialogruta
            const confirmed = window.confirm('Är du säker att du vill radera kontot?');
            if(!confirmed) return;
            
            let url = 'http://localhost:3000/users/' + id;
            let token = localStorage.getItem('token');

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if(response.ok) {
                
                // If-sats om användaren har raderat sig
                if(id === user?.id) {
                    localStorage.removeItem('token');
                    setUser(null);
                    
                    setTimeout(() => {
                        navigate('/login')
                    }, 1500);
                    return;
                }
                
                setUsers((prev) => prev.filter((user) => user.id !== id));
            }

        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    }

    async function startEditing(id: number | null) {
        setEditingId(id);
    }

    return(
        <div>
            
            {
                user?.role === 'admin' && <AdminView inloggedUser={user} otherUsers={users}  updateUser={updateUser} deleteUser={deleteUser} createUser={createNewUser} createAdmin={createNewAdmin}
                startEditing={startEditing}
                editingId={editingId}
                />
            }
            {
                user?.role === 'user' && <UserView inloggedUser={user}
                updateUser={updateUser}
                deleteUser={deleteUser}
                startEditing={startEditing}
                editingId={editingId}
                />
            }
        </div>
    )
}

export default ProfilePage;