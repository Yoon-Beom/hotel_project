// client/src/hooks/useIPFS.js
import { useState, useCallback } from 'react';
import { uploadToIPFS, getFromIPFS, extractCIDFromURL, getFileMimeType } from '../utils/ipfsUtils';

/**
 * IPFS 관련 기능을 제공하는 커스텀 훅
 * @returns {Object} IPFS 관련 함수와 상태
 */
const useIPFS = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * 파일을 IPFS에 업로드합니다.
     * @async
     * @function upload
     * @param {File|Blob|string} file - 업로드할 파일 또는 데이터
     * @returns {Promise<string>} IPFS URL
     * @throws {Error} 업로드 실패 시 에러
     */
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

    /**
     * IPFS에서 파일을 가져옵니다.
     * @async
     * @function get
     * @param {string} cid - 컨텐츠 식별자 (CID)
     * @returns {Promise<string>} 파일 데이터
     * @throws {Error} 파일 가져오기 실패 시 에러
     */
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

    /**
     * IPFS URL에서 CID를 추출합니다.
     * @function extractCID
     * @param {string} url - IPFS URL
     * @returns {string} CID
     * @throws {Error} 유효하지 않은 IPFS URL일 경우 에러
     */
    const extractCID = useCallback((url) => {
        try {
            return extractCIDFromURL(url);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * 파일의 MIME 타입을 확인합니다.
     * @async
     * @function getMimeType
     * @param {File} file - 확인할 파일
     * @returns {Promise<string>} MIME 타입
     */
    const getMimeType = useCallback(async (file) => {
        try {
            return await getFileMimeType(file);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return { upload, get, extractCID, getMimeType, isLoading, error };
};

export default useIPFS;
