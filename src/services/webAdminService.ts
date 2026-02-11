import api from "./api";

export const getCards = () => {
    return api.get('http://10.82.241.156:8080/api/v1/core/cards')
}