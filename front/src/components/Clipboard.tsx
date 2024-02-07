import { FC, useEffect, useState } from "react";
import { BsClipboard2, BsClipboard2CheckFill} from "react-icons/bs";
import styles from '../styles/Clipboard.module.scss'

interface IClipboardProp{
  text: string,
}

export const Clipboard: FC<IClipboardProp> = ({text}) => {
  let [click, setClick] = useState(false);
  useEffect(() => {
    setClick(false);
  }, [text]);

  const copy = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // textarea.style.display = 'none';
    
      // Move the textarea outside the viewport to make it invisible
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px'
    
      document.body.prepend(textarea);
    
      // highlight the content of the textarea element
      textarea.select();
    
      try {
        document.execCommand('copy');
      } catch (err) {
        console.log(err);
      } finally {
        textarea.remove();
      }
    }
  }

  return (
    <div className={styles.container}
      onClick={() => {
        setClick(true);
        // navigator.clipboard.writeText(text);
        copy(text);
      }}
    >
      {text}
      <div className={click ? styles.click : ''}>
        {click ? <BsClipboard2CheckFill/> : <BsClipboard2/>}
      </div>
    </div>
  )
}
