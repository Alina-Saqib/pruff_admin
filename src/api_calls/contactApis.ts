import axios from "axios";


export const getContacts = async() =>{
try {
        const response = await axios.get('https://api.pruuf.pro/contact');

        return response
      } catch (error) {
        console.error('Error fetching data:', error);
      }


}

export const getLeads = async() =>{
    try {
            const response = await axios.get('https://api.pruuf.pro/contact/leads');
    
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


    export const uploadLeads = async({name, email, phone} : any) =>{
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
        try {
                const response = await axios.post('https://api.pruuf.pro/contact/leads',
                {name, email, phone},
                config);
        
                return response
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        
        
        }

        export const sendEmails = async({toEmails, subject, emailContent, scheduledTime, frequency,attachments} : any) =>{
            const config = {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              };
              const formData = new FormData();
              formData.append('subject', subject);
              formData.append('emailContent', emailContent);
              formData.append('toEmails', JSON.stringify(toEmails));
          
            if(attachments)
             { attachments.forEach((file: File) => {
                formData.append(`attachments`, file);
              });}

            if(scheduledTime){
              formData.append('scheduledTime', scheduledTime);
            }

            if(frequency){
              formData.append('frequency', frequency); 
            }
             
            try {
              // 'https://api.pruuf.pro/contact/send-Email'
                    const response = await axios.post('https://api.pruuf.pro/contact/send-Email',
                    formData,
                    config);
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }