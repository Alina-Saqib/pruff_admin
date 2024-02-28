

import axios from "axios";

export const createGroup = async({name,users,grouptype} : any) =>{
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    try {
            const response = await axios.post('https://api.pruuf.pro/contact/create-group',
            {name,users,grouptype},
            config);
            
            return response
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    
    
    }


export const getGroups = async() =>{

        try {
                    const response = await axios.get('https://api.pruuf.pro/contact/groups');
                    
                    return response
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
            
            
            }
    
    
    export const getGroupById = async(id: any) =>{
               
                try {
                        const response = await axios.get(`https://api.pruuf.pro/contact/groups-by-id/${id}`);
                        
                        return response
                      } catch (error) {
                        console.error('Error fetching data:', error);
                      }
                
                
                }
    
    
    export const updateGroup = async({name,users,grouptype,id} : any) =>{
                    const config = {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      };
                    try {
                            const response = await axios.put(`https://api.pruuf.pro/contact/update-group/${id}`,
                            {name,users,grouptype},
                            config);
                            
                            return response
                          } catch (error) {
                            console.error('Error fetching data:', error);
                          }
                    
                    
                    }
    
    
    export const deleteGroup = async(id : any) =>{
                      
                        try {
                                const response = await axios.delete(`https://api.pruuf.pro/contact/delete-group/${id}`);
                                
                                return response
                              } catch (error) {
                                console.error('Error fetching data:', error);
                              }
                        
                        
                        }