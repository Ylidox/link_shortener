import { useNavigate } from "react-router-dom";
import { UserInput } from "../components/UserInput"
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../contexts/AuthContext";

export const Login = () => {
  const {signIn} = useAuth();
  const navigate = useNavigate();
  const submit = (user: IUser) => {
    if(signIn) signIn(user,  () => navigate('/'));
  }

  return (
    <UserInput 
      link_path="/register"
      link_content="Нет аккаунта? Регистрация"
      header="Вход"
      onSubmit={submit}
    />
  );
}
