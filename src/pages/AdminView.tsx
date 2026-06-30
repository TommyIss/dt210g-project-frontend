import { useState } from "react";
import type { User } from "../types/auth.types";
import UserForm from "../components/UserForm";
import UserArticle from "../components/UserArticle";

interface AdminViewProps {
    inloggedUser: User,
    otherUsers: User[] |[],
    createUser: (newUser: Omit<User, 'id' | 'role'>) => void,
    createAdmin:(newAdmin: Omit<User, 'id' | 'role'>) => void,
    updateUser: (id: number, newData: Omit<User, "id" | "role">) => void,
    deleteUser: (id: number) => void,
    startEditing: (id: number | null) => void,
    editingId: number | null
}

function AdminView({inloggedUser, otherUsers, createAdmin, createUser, updateUser, deleteUser, startEditing, editingId}: AdminViewProps) {

    const [formType, setFormType] = useState<string | null>(null);

    return(
        <section>
            <p>
                Som inloggad admin har du möjlighet att skapa en ny användare eller admin och se samt hantera andras konton.
            </p>
            <UserArticle 
                    key={inloggedUser.id}
                    id={inloggedUser.id}
                    firstname={inloggedUser.firstname}
                    lastname={inloggedUser.lastname}
                    email={inloggedUser.email}
                    role={inloggedUser.role}
                    password={inloggedUser.password}
                    startEditing={startEditing}
                    editUser={updateUser}
                    removeUser={deleteUser}
                    isEditing={editingId === inloggedUser.id}
                    />
            <div>
                <button onClick={() => setFormType('user')}>Skapa en ny användare</button>
                <button onClick={() => setFormType('admin')}>Skapa en ny admin</button>

                {
                    formType === 'user' && <UserForm createUser={createUser} setFormType={setFormType} formType={formType}/>
                }
                {
                    formType === 'admin' && <UserForm createUser={createAdmin} setFormType={setFormType} formType={formType}/>
                }
            </div>
            
            <h3>Andras konton</h3>
            <div className="flex-container">
                {
                    otherUsers.length === 0 && <p>Inga andra användare har lagts till...</p>
                }
                
                {
                    otherUsers.map((user) => 
                        <UserArticle 
                        key={user.id}
                        id={user.id}
                        firstname={user.firstname}
                        lastname={user.lastname}
                        email={user.email}
                        role={user.role}
                        password={user.password}
                        startEditing={startEditing}
                        editUser={updateUser}
                        removeUser={deleteUser}
                        isEditing={editingId === user.id}
                        />
                    )
                }
            </div>
        </section>
    )
}

export default AdminView;