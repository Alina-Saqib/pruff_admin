import axios from "axios";



export const getEmails = async() =>{
  // https://api.pruuf.pro/contact/get-Emails
    try {
                const response = await axios.get('https://api.pruuf.pro/contact/get-Emails');
                
                return response
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        
        
        }


export const getEmailsById = async(id: any) =>{
           
            try {
                    const response = await axios.get(`https://api.pruuf.pro/draft/contact/get-Emails-Byid/${id}`);
                    
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }


            export const deleteEmails = async(id : any) =>{
                      
                try {
                        const response = await axios.delete(`https://api.pruuf.pro/contact/delete-emails/${id}`);
                        
                        return response
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                
                
                }