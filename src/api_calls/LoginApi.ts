import axios from "axios";

export const adminLogin = async({email,password,role}: any) =>{

   try{

    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://api.pruuf.pro/auth/login",
        {email,password,role},
        config
      );
      // store user's token in local storage
      localStorage.setItem("userToken", data?.token);
      console.log(data)

      return data;

   }catch(error: any){
    if (error.response && error.response.data.message) {
        return error.response.data.message;
      } else {
        return error.message;
      }

   }


}