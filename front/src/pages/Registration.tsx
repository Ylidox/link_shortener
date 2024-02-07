import { useNavigate } from "react-router-dom";
import { UserInput } from "../components/UserInput";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../contexts/AuthContext";

export const Registration = () => {
  const {signIn} = useAuth();
  const navigate = useNavigate();
  const submit = (user: IUser) => {
    if(signIn) signIn(user,  () => navigate('/'), '/api/register');
  }
  return (
    <UserInput 
      link_path="/login"
      link_content="Есть аккаунт? Войти"
      header="Регистрация"
      onSubmit={submit}
    />
  );
}
