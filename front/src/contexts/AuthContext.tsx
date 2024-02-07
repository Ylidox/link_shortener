import axios from 'axios';
import {FC, createContext, useState} from 'react';

interface IAuthProvider{
  children: React.ReactNode
}

export interface IUser{
  username: string,
  password: string,
}

type ICallback = (prop?: any) => any;

interface IAuthContext{
  user?: {
    username: string,
    token: string,
  },
  signIn?: (user: IUser, cb: ICallback, path?: string) => Promise<boolean>,
  signOut?: (cb: ICallback) => Promise<void>,
}

export const AuthContext = createContext<IAuthContext>({});

export const AuthProvider: FC<IAuthProvider> = ({children}) => {
  let [user, setUser] = useState({
    username: localStorage.username,
    token: localStorage.token
  });

  const signIn = async (user: IUser, cb: ICallback, path: string = '/api/login') => {
    let {username} = user;
    axios.post(path, user)
      .then((resp: any) => {
        let {access_token} = resp.data;
        let token = access_token;
        setUser({username, token});
        localStorage.username = username;
        localStorage.token = token;
        cb();
      })
      .catch((err: any) => console.log(err.response.data))
    return true;
  }

  const signOut = async (cb: ICallback) => {
    setUser({username: '', token: ''});
    localStorage.clear();
    cb();
  }


  return (
    <AuthContext.Provider value={{user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}