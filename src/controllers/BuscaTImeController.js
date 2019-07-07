const axios = require("axios");

const URL = "https://api.cartolafc.globo.com/times?q=";

module.exports = {
    async buscaTime(req, res){
        function paginaTimes(times,max){
            let res = [[]];
            for (let i = 0; i < times.length /max; i++) {
                res[i] = times.slice(i*max,max*(i+1));
            }
            return res;
        }
        
        try {
            const response = await axios.get(`${URL}${req.query.q}`);
            const timesEncontrados = response.data;
            res.send(paginaTimes(timesEncontrados,20));
        } catch (error) {
            console.error(error);
        }
    }
}