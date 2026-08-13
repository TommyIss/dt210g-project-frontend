import { useState } from "react";
import type { User } from "../types/auth.types";
import './UserForm.css'
import * as Yup from 'yup';

interface UserFormProps {
  createUser: (user: Omit<User, "id" | "role">) => void;
  setFormType?: (type: string | null) => void;
  formType?: string | null
}

interface ErrorUser {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
}

function UserForm({ createUser, setFormType, formType }: UserFormProps) {
  const [newUser, setNewUser] = useState<Omit<User, "id" | "role">>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorUser>({});

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .required("Fyll i förnamn")
      .min(2, "Förnamn måste vara minst 2 tecken långt")
      .max(20, "Förnamn får inte vara längre än 20 tecken"),
    lastname: Yup.string()
      .required("Fyll i efternamn")
      .min(2, "Efternamn måste vara minst 2 tecken långt")
      .max(20, "Efternamn får inte vara längre än 20 tecken"),
    email: Yup.string()
      .required('Fyll i e-post').email('Ogiltig e-post'),
    password: Yup.string()
      .required('Fyll i lösenord')
      .min(6, 'Lösenord måste vara minst 6 tecken')
  });
  async function handleSubmit( event: React.FormEvent<HTMLFormElement> ) {
    
    event.preventDefault();
    try {
      await validationSchema.validate(newUser, { abortEarly: false});
      createUser(newUser);

      if(setFormType) {

        setTimeout(() => {
          setFormType(null)
        }, 1500 );
      
      }
    } catch (errors) {
      const validatiosErrors: ErrorUser = {};
      
          if(errors instanceof Yup.ValidationError) {
              errors.inner.forEach((error) => {
                  const prop = error.path as keyof ErrorUser;
                  validatiosErrors[prop] = error.message;
              });
          }
      
          setErrors(validatiosErrors);
    }
    
    
  }

  return (
    <fieldset>
      <legend>Skapa ett nytt konto för {formType === 'user' && 'användare'}{formType === 'admin' && 'admin'}</legend>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">Förnamn:</label>
        <input
          type="text"
          value={newUser.firstname}
          onChange={(event) =>
            setNewUser({ ...newUser, firstname: event.target.value })
          }
        />
        {errors.firstname && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.firstname}</span>}

        <br />

        <label htmlFor="lastname">Efternamn:</label>
        <input
          type="text"
          value={newUser.lastname}
          onChange={(event) =>
            setNewUser({ ...newUser, lastname: event.target.value })
          }
        />
        {errors.lastname && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.lastname}</span>}

        <br />

        <label htmlFor="email">E-post:</label>
        <input
          type="email"
          value={newUser.email}
          onChange={(event) =>
            setNewUser({ ...newUser, email: event.target.value })
          }
        />
        {errors.email && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.email}</span>}

        <br />

        <label htmlFor="password">Lösenord:</label>
        <input
          type="password"
          value={newUser.password}
          onChange={(event) =>
            setNewUser({ ...newUser, password: event.target.value })
          }
        />
        {errors.password && <span style={{ color: 'red', marginLeft: '5px'}}>{errors.password}</span>}
          
        <br />
        
        {
          !setFormType && <button type="submit">Skapa konto</button>
        }
        

        {/* Om det inte är kontoregistrering */}
        {
          setFormType && 
          (
            <>
              <button type="submit">Spara</button> 
              <button type="button" onClick={() => setFormType(null)}>Avbryt</button>
            </>
          
        )
        }
        
      </form>
    </fieldset>
  );
}

export default UserForm;
