const axios = require('axios');

const URL = 'https://api.cartolafc.globo.com/time/id/'

module.exports = {
    async infoTime(req, res) {
        function encurtaNome(nome){
            let nomeSeparado = nome.split(' ');
            for (let i = 0; i < nomeSeparado.length-1; i++) {
                nomeSeparado[i] = nomeSeparado[i][0]+". ";                
            }
            return nomeSeparado.join(' ');
        }
        try {
            let response = await axios.get(`${URL}${req.params.id}`);
            let time = response.data;
            for (let i = 0; i < time['atletas'].length; i++) {
                let posicao_id = time['atletas'][i]['posicao_id']
                let posicao = time['posicoes'][posicao_id]['abreviacao'];
                
                time['atletas'][i].nome = undefined;
                time['atletas'][i].apelido = encurtaNome(time['atletas'][i].apelido);
                time['atletas'][i].slug = undefined;
                time['atletas'][i].foto = undefined;
                time['atletas'][i].clube_id = undefined;
                time['atletas'][i].preco_num = undefined;
                time['atletas'][i].variacao_num = undefined;
                time['atletas'][i].jogos_num = undefined;
                time['atletas'][i].scout = undefined;
                time['atletas'][i].media_num= undefined;
                time['atletas'][i].posicao = posicao
                time['atletas'][i].posicao_classe = `pos-${posicao}`;
                time['atletas'][i].capitao = time['capitao_id'] === time['atletas'][i].atleta_id ? true : false;
            }
            time['clubes'] = undefined;
            time['posicoes'] = undefined;
            time['status'] = undefined;
            time['capitao_id'] = undefined;
            time['time_info'] = {};
            time['time_info']['esquema'] = time['esquema_id'];
            time['time_info']['escudo_url'] = time['time']['url_escudo_png'];
            time['time_info']['nome'] = time['time']['nome'];

            
            time['time'] = undefined;
            time['esquema_id'] = undefined;
            time['valor_time'] = undefined;
            time['patrimonio'] = undefined;
            time['rodada_atual'] = undefined;

            res.send({
                time
            })
        } catch (error) {
            console.log(error)
        }
    }
}