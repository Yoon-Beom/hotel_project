// useIPFS.js
import { useState, useCallback } from 'react';
import { uploadToIPFS, getFromIPFS } from './ipfsUtils';

const useIPFS = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const upload = useCallback(async (file) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = await uploadToIPFS(file);
            setIsLoading(false);
            return url;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    const get = useCallback(async (cid) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getFromIPFS(cid);
            setIsLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    return { upload, get, isLoading, error };
};

export default useIPFS;
