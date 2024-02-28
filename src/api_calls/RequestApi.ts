import axios from "axios";

export const  setExpiryHours = async({hours} : any) =>{
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    try {
            const response = await axios.post('https://api.pruuf.pro/admin/set-expiredHours',
            {hours},
            config);
    
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


export const getAllRequest =async ()=>{

  try {
    const response = await axios.get('https://api.pruuf.pro/admin/allServiceRequest');
    
    return response
  } catch (error) {
    console.error('Error fetching data:', error);
  }

}


export const  setRequestExpiry = async({expirydays,id} : any) =>{
  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  try {
          const response = await axios.post(`https://api.pruuf.pro/admin/set-expiryDays/${id}`,
          {expirydays},
          config);
  
          return response
        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
  
  }