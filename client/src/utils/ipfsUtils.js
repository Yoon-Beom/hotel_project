// ipfsUtils.js
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

// IPFS에 파일 업로드
export const uploadToIPFS = async (file) => {
    try {
        const added = await ipfs.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        return url;
    } catch (error) {
        console.error('IPFS 파일 업로드 오류:', error);
        throw error;
    }
};

// IPFS에서 파일 가져오기
export const getFromIPFS = async (cid) => {
    try {
        const stream = ipfs.cat(cid);
        let data = '';
        for await (const chunk of stream) {
            data += chunk.toString();
        }
        return data;
    } catch (error) {
        console.error('IPFS 파일 가져오기 오류:', error);
        throw error;
    }
};
