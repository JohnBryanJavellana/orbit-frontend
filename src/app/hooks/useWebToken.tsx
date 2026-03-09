export default function useWebToken() {
    const setToken = (tokenName: string, tokenValue: string) => localStorage.setItem(tokenName, tokenValue);
    const getToken = (tokenName: string) => localStorage.getItem(tokenName);
    const removeToken = (tokenName: string) => localStorage.removeItem(tokenName);

    return { setToken, getToken, removeToken };
}