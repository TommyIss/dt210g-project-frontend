import { useState } from "react";
import UserForm from "../components/UserForm";
import type { User } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  

  async function createNewUser(newData: Omit<User, "id" | "role">) {
    try {

      let url =
        "http://localhost:3000/auth/register";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {

        setTimeout(() => {
          navigate("/login");
        }, 1500);
        return;
      }

      
    } catch (error) {
      
      throw error;
    }
  }

  return (
    <div>
      <h2>Skapa konto</h2>
      <p>
        I denna sida kan du skapa ett användarkonto genom att fylla i formuläret och trycka på skapa konto
      </p>
      
      <UserForm createUser={createNewUser} />
    </div>
  );
}

export default RegisterPage;
