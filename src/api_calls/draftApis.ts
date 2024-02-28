import axios from "axios";

export const saveDraft = async({toEmails, subject, emailContent, scheduledTime} : any) =>{
  console.log(toEmails, subject, emailContent, scheduledTime)
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    try {
            const response = await axios.post('https://api.pruuf.pro/draft/save',
            {toEmails, subject, emailContent, scheduledTime},
            config);
            
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


export const getDraft = async() =>{

        try {
                    const response = await axios.get('https://api.pruuf.pro/draft');
                    
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }
    
    
    export const getDraftById = async(id: any) =>{
               
                try {
                        const response = await axios.get(`https://api.pruuf.pro/draft/getByid/${id}`);
                        
                        return response
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                
                
                }
    
    
    export const editDraft = async({toEmails, subject, emailContent, scheduledTime,id} : any) =>{
                    const config = {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      };
                    try {
                            const response = await axios.put(`https://api.pruuf.pro/draft/update/${id}`,
                            {toEmails, subject, emailContent, scheduledTime},
                            config);
                            
                            return response
                          } catch (error) {
                            console.error('Error fetching data:', error);
                          }
                    
                    
                    }
    
    
    export const deleteDraft = async(id : any) =>{
                      
                        try {
                                const response = await axios.delete(`https://api.pruuf.pro/draft/delete/${id}`);
                                
                                return response
                              } catch (error) {
                                console.error('Error fetching data:', error);
                              }
                        
                        
                        }


//phone draft Apis

export const savePhoneDraft = async({phoneNumber, text, scheduledTime,frequency} : any) =>{
  scheduledTime = scheduledTime === '' ? null:scheduledTime 
    frequency = frequency ==='' ?null : frequency
 
  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  try {
          const response = await axios.post('https://api.pruuf.pro/draft/phone-save',
          {phoneNumber, text, scheduledTime,frequency},
          config);
         
          return response
        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
  
  }


export const getPhoneDraft = async() =>{

      try {
                  const response = await axios.get('https://api.pruuf.pro/draft/phone');
                 
                  return response
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
          
          
          }
  
  
  export const getPhoneDraftById = async(id: any) =>{
             
              try {
                      const response = await axios.get(`https://api.pruuf.pro/draft/phone-getByid/${id}`);
                     
                      return response
                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
              
              
              }
  
  
  export const editPhoneDraft = async({phoneNumber, text, scheduledTime ,frequency,id} : any) =>{
    scheduledTime = scheduledTime === '' ? null:scheduledTime 
    frequency = frequency ==='' ?null : frequency

                  const config = {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    };
                  try {
                          const response = await axios.put(`https://api.pruuf.pro/draft/phone-update/${id}`,
                          {phoneNumber, text, scheduledTime,frequency},
                          config);
                          
                          return response
                        } catch (error) {
                          console.error('Error fetching data:', error);
                        }
                  
                  
                  }
  
  
  export const deletePhoneDraft = async(id : any) =>{
                    
                      try {
                              const response = await axios.delete(`https://api.pruuf.pro/draft/phone-delete/${id}`);
                              
                              return response
                            } catch (error) {
                              console.error('Error fetching data:', error);
                            }
                      
                      
                      }