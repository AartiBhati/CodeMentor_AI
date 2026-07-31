 import {Routes, Route, Navigate} from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProblemPage from "./pages/ProblemPage"
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from "./components/AdminDelete";


 function App(){

  const dispatch=useDispatch();
  const {user,isAuthenticated}=useSelector((state)=>state.auth);

  

  //check initial authentication
  useEffect(()=>{
    dispatch(checkAuth());
    
  },[dispatch]);

  return(
    <>
      <Routes>
        <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to='/signup'/>}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>
        <Route path="/problem/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} ></Route>
        <Route path="/admin" element={isAuthenticated && user?.role==='admin' ?<Admin/>: <Navigate to ="/"/>}></Route>
        <Route path="/admin/create" element={isAuthenticated && user?.role==='admin' ?<AdminPanel/>: <Navigate to ="/"/>}></Route>
        <Route path="/admin/delete" element={isAuthenticated && user?.role==='admin' ?<AdminDelete/>: <Navigate to ="/"/>}></Route>

        {/* <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/> */}
      </Routes>
    </>
  )
}

export default App;