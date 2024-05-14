import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {

    const [data, setData] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect( () => {

        // after component is mounted we want to do something 
        let isMounted = true;

        // actually cancel the request if for whatever reason the component is unmounted
        const source = axios.CancelToken.source();

        const fetchData = async (url) => {
            setIsLoading(true);
            try {

                // we need to set the cancelToken, then we can use it in the cleanUp function
                const response = await axios.get(url, {
                    cancelToken: source.token
                });

                if(isMounted) {
                    setData(response.data);
                    setFetchError(null);
                }
            } catch (err) {
                if(isMounted) {
                    setFetchError(err.message);
                    setData([]);
                }
            } finally {
                isMounted && setTimeout(() => setIsLoading(false), 2000);
            }
        }

        fetchData(dataUrl);

        return () => {
            isMounted = false;
            source.cancel();
        }

    }, [dataUrl]);

    return { data, fetchError, isLoading };
}

export default useAxiosFetch;