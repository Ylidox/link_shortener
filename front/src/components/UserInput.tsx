import { FC, useEffect, useState } from 'react';
import styles from '../styles/UserInput.module.scss'
import { Input } from '../components/Input';
import { NavLink } from 'react-router-dom';
import { IUser } from '../contexts/AuthContext';

interface IUserInput{
  header: string,
  link_path: string,
  link_content: string,
  onSubmit?: (user: IUser) => any
}

export const UserInput: FC<IUserInput> = (prop) => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [valid, setValid] = useState(false);

  const validateInput = () => {
    if(username && password) setValid(true);
    else setValid(false);
  }

  const setClassButton = () => {
    return valid ? styles.fill : styles.blank;
  }

  const usernameHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  }

  const passwordHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  }

  useEffect(() => {
    validateInput();
  }, [username, password])

  const submitHandler = () => {
    if(valid && prop.onSubmit) prop.onSubmit({
      username,
      password,
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.enter}>
        <h2>{prop.header}</h2>
      </div>
      <div className={styles.box}>
        <Input type='text' placeholder='Username:' onInput={usernameHandler}/>
        <Input type='password' placeholder='Password:' onInput={passwordHandler}/>
        <button 
          className={setClassButton()}
          onClick={submitHandler}
        >Отправить</button>
      </div>

      <div className={styles.link_block}>
        <NavLink to={prop.link_path}>{prop.link_content}</NavLink>
      </div>
    </div>
  )
}
