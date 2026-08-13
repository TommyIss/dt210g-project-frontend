import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";

interface LoginError {
  email?: string;
  password?: string;
}
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<LoginError>({});
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().required("Fyll i e-post").email("Ogiltig e-post"),
    password: Yup.string().required("Fyll i lösenord"),
  });

  // Kontrollera användaren
  useEffect(() => {
    if (user) {
      let pathname = localStorage.getItem('pathname');
      if(pathname) {
        navigate(pathname);
        return;
      }
      navigate("/profile");
    }
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false },
      );

      await login({ email, password });
      navigate("/profile");
    } catch (errors) {
      const validatiosErrors: LoginError = {};

      if (errors instanceof Yup.ValidationError) {
        errors.inner.forEach((error) => {
          const prop = error.path as keyof LoginError;
          validatiosErrors[prop] = error.message;
        });

        setErrors(validatiosErrors);
        return;
      }

      setError(
        "Inloggningen misslyckades. Kontrollera att du har korrekt e-post och lösenord.",
      );
    }
  }

  return (
    <div>
      <h2>Logga in</h2>
      <p>I denna sida kan du logga in till ditt konto.</p>
      <p>
        Har du inget konto? Klicka{" "}
        <NavLink className="reg-link" to={"/register"}>
          Här
        </NavLink>{" "}
        för att skapa
      </p>
      <fieldset>
        <legend>Logga in</legend>
        <form onSubmit={handleSubmit}>
          

          <label htmlFor="email">E-post:</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.email}
            </span>
          )}

          <br />

          <label htmlFor="password">Lösenord:</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <span style={{ color: "red", marginLeft: "5px" }}>
              {errors.password}
            </span>
          )}

          <br />
          <input type="submit" value="Logga in" />
          {error && (
            <span style={{ color: "red", marginLeft: "5px" }}>{error}</span>
          )}
        </form>
      </fieldset>
    </div>
  );
}

export default LoginPage;
