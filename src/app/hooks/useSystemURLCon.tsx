export default function useSystemURLCon() {
    const urlWithApi = 'http://192.168.255.127:8000/api';
    const urlWithoutApi = 'http://192.168.255.127:8000';

    return { urlWithApi, urlWithoutApi };
}