import axios from "axios";

export const sendPhoneSms = async({text, phoneNumber, scheduledTime, frequency} : any) =>{
    const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
     
    try {
      // 'https://api.pruuf.pro/contact/send-Email'
            const response = await axios.post('https://api.pruuf.pro/phone/send-sms',
            {text, phoneNumber, scheduledTime, frequency},
            config);
            
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


    export const getSms = async() =>{
      // https://api.pruuf.pro/contact/get-Emails
        try {
                    const response = await axios.get('https://api.pruuf.pro/phone/get-sms');
                    
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }
    
    
    export const getSmsById = async(id: any) =>{
               
                try {
                        const response = await axios.get(`https://api.pruuf.pro/phone/get-sms-Byid/${id}`);
                        
                        return response
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                
                
                }
    
    
                export const deleteSms = async(id : any) =>{
                          
                    try {
                            const response = await axios.delete(`https://api.pruuf.pro/phone/delete-sms/${id}`);
                            
                            return response
                          } catch (error) {
                            console.error('Error deleting data:', error);
                          }
                    
                    
                    }