import { IData } from '../types';
import axios from 'axios';

async function useGetDataFromServer(userID: number) : Promise<IData> {

    const getDataFromServer = async () => {
       const axiosResult = await axios.get(`${import.meta.env.VITE_MAIN_SERVER_URL}/user/${userID}`);
  
       console.log("getDataFromServer");

       return axiosResult.data as IData;
    }
  

    return await getDataFromServer();
}

export default useGetDataFromServer