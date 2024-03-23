import React,{useState} from "react";
import "./style.css"
import Input from "../Input";
import Button from "../Button";
import {  GoogleAuthProvider, createUserWithEmailAndPassword , signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const SignupSignin = () =>{
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [loginForm,setLoginForm] = useState(false)
    const navigate = useNavigate()

    function signupFun() {
        setLoading(true)
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password==confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up  this is 1st function i.e. signup 
    const user = userCredential.user;
    console.log("user>>>",user)
    toast.success(`Account created for ${user.email}`)
    setLoading(false)
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  // function of passing user object
  createDoc(user)
  navigate("/dashboard");
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false)
    // ..
  });
            } else{
                toast.error("Password and ConfirmPassword don't match!")
                setLoading(false)
            }
           
        } else{
            toast.error("All fields are mandatory!");
            setLoading(false)
        }
    }
    
      async function createDoc(user) {
        setLoading(true);
        if(!user) return;

        const userRef = doc(db,"users", user.uid);
        const userData = await getDoc(userRef);

        if(!userData.exists()){
          try{
            // below line come from firebase for creating doc
         await setDoc(doc(db, "users", user.uid), {
           name:user.displayName ? user.displayName : name,
           email,
           photoURL:user.photoURL ? user.photoURL : "",
           createdAt: new Date()
         });
        //  toast.success("Doc created!")
         setLoading(false);
         }
         catch(e){
           toast.error(e.message);
         }
        }else{
          toast.error("Doc already exists");
          setLoading(false);
        }
        
       }
       function loginFun() {
        setLoading(true);
        if( email!="" && password!="" ){
            //this is 2nd function i.e. code of sighn in 
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              toast.success(`User Logged In!Welcome ${user.displayName || user.email}`) //`Signed In! Welcome ${user.displayName || user.email}`
              setLoading(false);
              navigate("/dashboard");
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              setLoading(false);
              toast.error(errorMessage);
            });
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
        }

        function googleAuth() {
          setLoading(true);
          try{
            signInWithPopup(auth, provider)
            .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              console.log("user:",user);
              createDoc(user);
              setLoading(false);
              navigate("/dashboard")
              toast.success("User authenticated!");
              
              // IdP data available using getAdditionalUserInfo(result)
              // ...
            }).catch((error) => {
              setLoading(false);
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage)
              
              // ...
            });
          }catch(e){
            toast.error(e.message)
            setLoading(false);
          }
          

        }
    return(
        <>
        <div className="wrapper">
        {loginForm ?(
            <>
              <div className="signupWrapper">
         <h2 className="title">Login on <span style={{color:"#2970ff"}}>Financely.</span></h2>
         <form>
           <div className="input-wrapper">
             <Input 
             type={"email"}
            label={"Email"} 
            state={email} 
            setState={setEmail} 
            placeholder={"JohnDoe@gmail.com"} 
            />
            </div>
            <div className="input-wrapper">
             <Input 
             type={"password"}
            label={"Password"} 
            state={password} 
            setState={setPassword} 
            placeholder={"Example@123"} 
            />
             </div>
            <Button  
            disabled={loading}
            text={loading?"Loading...":"Login Using Email and Password"} 
            onClick={loginFun}
            />
            <p style={{textAlign:"center",margin:0}}>or</p>
            <Button  
            onClick={googleAuth}
            text={loading?"Loading...":"Login Using Google"} 
            blue={true}
            />
            <p className="p-login" onClick={()=>setLoginForm(!loginForm)}>Or Don't Have An Account ? Click Here</p>
         </form>
      </div>
            </>
        ) : (
            <div className="signupWrapper">
            <h2 className="title">Sign Up on <span style={{color:"#2970ff"}}>Financely.</span></h2>
            <form>
              <div className="input-wrapper">
               <Input 
               type={"text"}
               label={"Full Name"} 
               state={name} 
               setState={setName} 
               placeholder={"John Doe"} 
               />
               </div>
               <div className="input-wrapper">
                <Input 
                type={"email"}
               label={"Email"} 
               state={email} 
               setState={setEmail} 
               placeholder={"JohnDoe@gmail.com"} 
               />
               </div>
               <div className="input-wrapper">
                <Input 
                type={"password"}
               label={"Password"} 
               state={password} 
               setState={setPassword} 
               placeholder={"Example@123"} 
               />
               </div>
               <div className="input-wrapper">
                <Input 
                type={"password"}
               label={"ConfirmPassword"} 
               state={confirmPassword} 
               setState={setConfirmPassword} 
               placeholder={"Example@123"} 
               />
               </div>
               <Button  
               disabled={loading}
               text={loading?"Loading...":"Signup Using Email and Password"} 
               onClick={signupFun}
               />
               <p style={{textAlign:"center",margin:0}}>or</p>
               <Button  
               onClick={googleAuth}
               text={loading?"Loading...":"Signup Using Google"} 
               blue={true}
               />
               <p  className="p-login" onClick={()=>setLoginForm(!loginForm)}>Or  Have An Account Already? Click Here</p>
            </form>
         </div>
        )}
       </div>
      </>
    )
}
export default SignupSignin;