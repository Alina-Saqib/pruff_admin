import axios from "axios";

export const saveTemplate = async({content, subject} : any) =>{
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    try {
            const response = await axios.post('https://api.pruuf.pro/template/save',
            {content, subject},
            config);
            
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


export const getTemplates = async() =>{

    try {
                const response = await axios.get('https://api.pruuf.pro/template');
                
                return response
              } catch (error) {
                console.error('Error fetching data:', error);
              }
        
        
        }


export const getTemplateById = async(id: any) =>{
           
            try {
                    const response = await axios.get(`https://api.pruuf.pro/template/getByid/${id}`);
                    
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }


export const editTemplate = async({content, subject,id} : any) =>{
                const config = {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  };
                try {
                        const response = await axios.put(`https://api.pruuf.pro/template/update/${id}`,
                        {content, subject},
                        config);
                        
                        return response
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                
                
                }


export const deleteTemplate = async(id : any) =>{
                  
                    try {
                            const response = await axios.delete(`https://api.pruuf.pro/template/delete/${id}`);
                            
                            return response
                          } catch (error) {
                            console.error('Error fetching data:', error);
                          }
                    
                    
                    }



//phone templates Apis

export const savePhoneTemplate = async({content} : any) =>{
  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  try {
          const response = await axios.post('https://api.pruuf.pro/template/phone-save',
          {content},
          config);
          
          return response
        } catch (error) {
          console.error('Error fetching data:', error);
        }
  
  
  }


export const getPhoneTemplates = async() =>{

  try {
              const response = await axios.get('https://api.pruuf.pro/template/phone');
              
              return response
            } catch (error) {
              console.error('Error fetching data:', error);
            }
      
      
      }


export const getPhoneTemplateById = async(id: any) =>{
         
          try {
                  const response = await axios.get(`https://api.pruuf.pro/template/phone-getByid/${id}`);
                  
                  return response
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
          
          
          }


export const editPhoneTemplate = async({content,id} : any) =>{
              const config = {
                  headers: {
                    "Content-Type": "application/json",
                  },
                };
              try {
                      const response = await axios.put(`https://api.pruuf.pro/template/phone-update/${id}`,
                      {content},
                      config);
                      
                      return response
                    } catch (error) {
                      console.error('Error fetching data:', error);
                    }
              
              
              }


export const deletePhoneTemplate = async(id : any) =>{
                
                  try {
                          const response = await axios.delete(`https://api.pruuf.pro/template/phone-delete/${id}`);
                          
                          return response
                        } catch (error) {
                          console.error('Error fetching data:', error);
                        }
                  
                  
                  }