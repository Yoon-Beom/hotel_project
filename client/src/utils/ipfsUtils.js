// client/src/utils/ipfsUtils.js
import { create } from 'ipfs-http-client';

/**
 * IPFS 관련 유틸리티 함수들
 * @module ipfsUtils
 */

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

/**
 * IPFS에 파일을 업로드합니다.
 * @async
 * @function uploadToIPFS
 * @param {File|Blob|string} file - 업로드할 파일 또는 데이터
 * @returns {Promise<string>} IPFS URL
 * @throws {Error} 업로드 실패 시 에러
 */
export const uploadToIPFS = async (file) => {
    try {
        const added = await ipfs.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        return url;
    } catch (error) {
        throw new Error(`IPFS 파일 업로드 실패: ${error.message}`);
    }
};

/**
 * IPFS에서 파일을 가져옵니다.
 * @async
 * @function getFromIPFS
 * @param {string} cid - 컨텐츠 식별자 (CID)
 * @returns {Promise<string>} 파일 데이터
 * @throws {Error} 파일 가져오기 실패 시 에러
 */
export const getFromIPFS = async (cid) => {
    try {
        const stream = ipfs.cat(cid);
        let data = '';
        for await (const chunk of stream) {
            data += chunk.toString();
        }
        return data;
    } catch (error) {
        throw new Error(`IPFS 파일 가져오기 실패 (CID: ${cid}): ${error.message}`);
    }
};

/**
 * IPFS URL에서 CID를 추출합니다.
 * @function extractCIDFromURL
 * @param {string} url - IPFS URL
 * @returns {string} CID
 * @throws {Error} 유효하지 않은 IPFS URL일 경우 에러
 */
export const extractCIDFromURL = (url) => {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('유효하지 않은 IPFS URL입니다.');
};

/**
 * 파일의 MIME 타입을 확인합니다.
 * @async
 * @function getFileMimeType
 * @param {File} file - 확인할 파일
 * @returns {Promise<string>} MIME 타입
 */
export const getFileMimeType = async (file) => {
    return file.type;
};
