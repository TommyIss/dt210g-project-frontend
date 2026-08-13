import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminView from "./AdminView";
import UserView from "./UserView";
import type { User } from "../types/auth.types";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import Breadcrumbs from "../components/Breadcrumbs";

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState<User[] | []>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const location = useLocation();
  const baseUrl = "https://tois-dt210g-project-webservice.onrender.com/";

  useEffect(() => {
    if (user?.role === "admin") {
      getUsers();
    }
    localStorage.setItem("pathname", location.pathname);
  }, []);

  // Visa notis
  function showNotification(
    message: string,
    type: "success" | "error" = "success",
  ) {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function getUsers() {
    try {
      let token = localStorage.getItem("token");

      const response = await fetch(baseUrl + "users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const otherUser = data.filter(
          (otherUser: User) => otherUser.id !== user?.id,
        );
        setUsers(otherUser);
      }
    } catch (error) {
      throw error;
    }
  }

  async function createNewUser(newData: Omit<User, "id" | "role">) {
    try {
      if (!newData.firstname || newData.firstname === "") {
        showNotification("Förnamn saknas!", "error");
        return;
      }
      if (!newData.lastname || newData.lastname === "") {
        showNotification("Efternamn saknas!", "error");
        return;
      }
      if (!newData.email || newData.email === "") {
        showNotification("E-post saknas!", "error");
        return;
      }
      if (!newData.password || newData.password === "") {
        showNotification("Lösenord saknas!", "error");
        return;
      }

      const response = await fetch(baseUrl + "users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();

        const newUser = data.body;

        showNotification("Ny användare har skapats");

        setUsers((prev) =>
          [...prev, newUser].sort((a: User, b: User) =>
            a.firstname > b.firstname ? 1 : -1,
          ),
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async function createNewAdmin(newData: Omit<User, "id" | "role">) {
    try {
      if (!newData.firstname || newData.firstname === "") {
        showNotification("Förnamn saknas!", "error");
        return;
      }
      if (!newData.lastname || newData.lastname === "") {
        showNotification("Efternamn saknas!", "error");
        return;
      }
      if (!newData.email || newData.email === "") {
        showNotification("E-post saknas!", "error");
        return;
      }
      if (!newData.password || newData.password === "") {
        showNotification("Lösenord saknas!", "error");
        return;
      }
      let token = localStorage.getItem("token");

      const response = await fetch(baseUrl + "admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();
        const newAdmin = data.body;
        showNotification("Ny admin har skapats");
        setUsers((prev) =>
          [...prev, newAdmin].sort((a: User, b: User) =>
            a.firstname > b.firstname ? 1 : -1,
          ),
        );
      }
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  }

  async function updateUser(id: number, newData: Omit<User, "id" | "role">) {
    try {
      let token = localStorage.getItem("token");

      const payload: any = {
        firstname: newData.firstname,
        lastname: newData.lastname,
        email: newData.email,
      };

      // If-sats för att kontrollera att lösenord är inte tomt!
      if (newData.password?.trim() !== "") {
        payload.password = newData.password;
      }

      const response = await fetch(baseUrl + "users/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        const updatedUser = data.updatedUser;

        // Om användare uppdaterar sig själv uppdaterar kontext
        if (updatedUser.id === user?.id) {
          showNotification("Ditt konto har uppdaterats");
          setUser({
            ...user,
            ...updatedUser,
          });
        }

        showNotification("Användaren har uppdaterats");

        setUsers((prev) =>
          prev
            .map((user) => (user.id === id ? updatedUser : user))
            .sort((a: User, b: User) => (a.firstname > b.firstname ? 1 : -1)),
        );

        setEditingId(null);
      }
    } catch (error) {
      showNotification("Ett fel uppstod vid radering", "error");
      localStorage.removeItem("token");
      throw error;
    }
  }

  async function deleteUser(id: number) {
    try {
      // Visa dialogruta
      const confirmed = window.confirm(
        "Är du säker att du vill radera kontot?",
      );
      if (!confirmed) return;

      let token = localStorage.getItem("token");

      const response = await fetch(baseUrl + "users/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        // If-sats om användaren har raderat sig
        if (id === user?.id) {
          localStorage.removeItem("token");
          setUser(null);
          showNotification("Ditt konto har raderats!");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          return;
        }
        showNotification("Användaren har raderats!", "error");
        setUsers((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  }

  async function startEditing(id: number | null) {
    setEditingId(id);
  }

  return (
    <div>
      <Breadcrumbs pageLabel="Min sida" />
      <h2>Användarprofil</h2>
      <h3>Välkommen {user?.firstname}</h3>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {user?.role === "admin" && (
        <AdminView
          inloggedUser={user}
          otherUsers={users}
          updateUser={updateUser}
          deleteUser={deleteUser}
          createUser={createNewUser}
          createAdmin={createNewAdmin}
          startEditing={startEditing}
          editingId={editingId}
        />
      )}
      {user?.role === "user" && (
        <UserView
          inloggedUser={user}
          updateUser={updateUser}
          deleteUser={deleteUser}
          startEditing={startEditing}
          editingId={editingId}
        />
      )}
    </div>
  );
}

export default ProfilePage;
