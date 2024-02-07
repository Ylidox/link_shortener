import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface IProp{
  children: React.ReactNode,
}

function RequireAuth({children}: IProp) {
  let {user} = useAuth();
  if(!user?.token){
    return <Navigate to='/login'/>
  }
  return (
    <>
      {children}
    </>
  );
}

export default RequireAuth;