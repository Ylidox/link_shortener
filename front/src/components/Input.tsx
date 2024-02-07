import { FC } from 'react'
import styles from '../styles/Input.module.scss';

interface IInputProps{
  type?: string,
  placeholder?: string,
  onInput?: React.FormEventHandler<HTMLInputElement>
}

export const Input: FC<IInputProps> = (prop) => {
  return (
    <input 
      className={styles.self}
      type={prop.type} 
      placeholder={prop.placeholder } 
      onInput={prop.onInput}
    />
  )
}
