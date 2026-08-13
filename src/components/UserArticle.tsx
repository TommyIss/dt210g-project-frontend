import { useEffect, useState } from "react";
import type { User } from "../types/auth.types";
import * as Yup from "yup";

interface UserArticleProps extends User {
  editUser: (id: number, updatedData: Omit<User, "id" | "role">) => void;
  removeUser: (id: number) => void;
  isEditing: boolean;
  startEditing: (id: number | null) => void;
}

interface ErrorUser {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}

function UserArticle({
  id,
  firstname,
  lastname,
  email,
  role,
  editUser,
  removeUser,
  isEditing,
  startEditing,
}: UserArticleProps) {
  const [editData, setEditData] = useState<Omit<User, "id" | "role">>({
    firstname,
    lastname,
    email,
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
    email: Yup.string().required("Fyll i e-post").email("Ogiltig e-post"),
    password: Yup.string()
      .transform((value) => (value === "" ? undefined : value))
      .min(6, "Lösenord måste vara minst 6 tecken")
      .notRequired(),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await validationSchema.validate(editData, { abortEarly: false });

      const dataToSend = { ...editData };

      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      editUser(id, dataToSend);
    } catch (errors) {
      const validatiosErrors: ErrorUser = {};

      if (errors instanceof Yup.ValidationError) {
        errors.inner.forEach((error) => {
          const prop = error.path as keyof ErrorUser;
          validatiosErrors[prop] = error.message;
        });
      }

      setErrors(validatiosErrors);

      setTimeout(() => {
        setErrors({})
      }, 5000);
    }
  }

  useEffect(() => {
    if (isEditing) {
      setEditData({
        firstname,
        lastname,
        email,
        password: "",
      });
    }
  }, [isEditing, firstname, lastname, email]);

  if (isEditing) {
    return (
      <article key={id}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstname">Förnamn:</label>
          <input
            type="text"
            value={editData.firstname}
            onChange={(event) =>
              setEditData({ ...editData, firstname: event.target.value })
            }
          />
          {errors.firstname && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.firstname}
            </span>
          )}

          <br />

          <label htmlFor="lastname">Efternamn:</label>
          <input
            type="text"
            value={editData.lastname}
            onChange={(event) =>
              setEditData({ ...editData, lastname: event.target.value })
            }
          />
          {errors.lastname && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.lastname}
            </span>
          )}

          <br />

          <label htmlFor="email">E-post:</label>
          <input
            type="email"
            value={editData.email}
            onChange={(event) =>
              setEditData({ ...editData, email: event.target.value })
            }
          />
          {errors.email && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.email}
            </span>
          )}

          <br />

          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            value={editData.password}
            onChange={(event) =>
              setEditData({ ...editData, password: event.target.value })
            }
          />
          {errors.password && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.password}
            </span>
          )}

          <br />
          <button type="submit">Spara</button>
          <button type="button" onClick={() => startEditing(null)}>
            Avbryt
          </button>
        </form>
      </article>
    );
  }

  return (
    <article key={id}>
      <h5>
        {firstname} {lastname}
      </h5>
      <p>E-post: {email}</p>
      <p>Roll: {role}</p>
      <button onClick={() => startEditing(id)}>Ändra</button>
      <button onClick={() => removeUser(id)}>Radera</button>
    </article>
  );
}

export default UserArticle;
