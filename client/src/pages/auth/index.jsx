import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const navigate=useNavigate()
    const {setUserInfo}=useAppStore()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin=()=>{
        if(!email.length){
            toast.error("Email is required.")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false
        }
        return true
    }

    const validateSignup=()=>{
        if(!email.length){
            toast.error("Email is required.")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false
        }
        if(password!=confirmPassword){
            toast.error("Password and confirm Password should be same.")
            return false
        }
        return true
    }

    const handleLogin=async ()=>{
        if(validateLogin()){
            const res=await apiClient.post(LOGIN_ROUTE,{email, password},{withCredentials:true})
            if(res.data.user.id){
                setUserInfo(res.data.user)
                if(res.data.user.profileSetup)navigate('/chat')
                else navigate('/profile')
            }
            console.log({res})
        }
    }

    const handleSignup=async ()=>{
        if(validateSignup()){
            const res=await apiClient.post(SIGNUP_ROUTE,{email, password},{withCredentials:true})
            if(res.status===201){
                setUserInfo(res.data.user)
                navigate("/profile")
            }
            console.log({res})
        }
    }


    return (

        <div className="h-screen w-screen flex items-center justify-center bg-indigo-900">
            <div className="h-[80vh] bg-white w-[90vw] md:w-[70vw] xl:w-[55vw] rounded-3xl grid xl:grid-cols-2 
                shadow-[0px_10px_30px_rgba(0,0,0,0.2)] overflow-hidden">

                
                {/* Left Side: Form */}
                <div className="flex flex-col gap-8 items-center justify-center p-6">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                        <img src={Victory} alt="Victory Emoji" className="h-[80px] mx-auto mt-2" />
                        <p className="font-medium text-gray-600 mt-2">Fill in the details to get started!</p>
                    </div>
                    <Tabs className="w-3/4" defaultValue="login">
                        <TabsList className="bg-transparent bg-white rounded-none w-full">
                            <TabsTrigger value="login" className="text-gray-800  border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                            <TabsTrigger value="signup" className="text-gray-800  border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
                        </TabsList>
                        

                        {/* Login Form */}
                        <TabsContent className="flex flex-col gap-5 mt-6" value="login">
                            <Input placeholder="Email" type="email" className="rounded-xl p-5 border-gray-300" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input placeholder="Password" type="password" className="rounded-xl p-5 border-gray-300" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button className="rounded-xl p-5 bg-black hover:bg-gray-800 transition-all duration-300" onClick={handleLogin}>Login</Button>
                        </TabsContent>

                        {/* Signup Form */}
                        <TabsContent className="flex flex-col gap-5 mt-6" value="signup">
                            <Input placeholder="Email" type="email" className="rounded-xl p-5 border-gray-300" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input placeholder="Password" type="password" className="rounded-xl p-5 border-gray-300" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Input placeholder="Confirm Password" type="password" className="rounded-xl p-5 border-gray-300" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Button className="rounded-xl p-5 bg-black hover:bg-gray-800 transition-all duration-300" onClick={handleSignup}>Signup</Button>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side: Image */}
                <div className="hidden xl:flex justify-center items-center ">
                    <img src={Background} alt="background login" className="h-[600px] object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Auth;
