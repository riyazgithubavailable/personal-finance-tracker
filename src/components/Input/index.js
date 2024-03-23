import React from "react";
import "./style.css"

const Input = ({label,state,setState,placeholder,type}) => {
    return(
        <div>
          <p className="label">{label}</p>
          <input 
          type={type}
          value={state}
          placeholder={placeholder} 
          onChange={(e)=>setState(e.target.value)}
          className="input"/>
      </div>
    )
}
export default Input