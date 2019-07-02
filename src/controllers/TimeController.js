const axios = require('axios');

const URL = 'https://api.cartolafc.globo.com/time/id/'

module.exports = {
    async infoTime(req, res) {
        function encurtaNome(nome){
            if(nome.length > 10){
                let nomeSeparado = nome.split(' ');
                for (let i = 0; i < nomeSeparado.length-1; i++) {
                    nomeSeparado[i] = nomeSeparado[i][0]+". ";                
                }
                return nomeSeparado.join(' ');
            } else {
                return nome;
            }
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
                time['atletas'][i].pontos_num = parseFloat(time['atletas'][i].pontos_num.toFixed(1));
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
            time['time_info']['nome'] = encurtaNome(time['time']['nome']);

            
            time['time'] = undefined;
            time['pontos'] = parseFloat( time['pontos'].toFixed(2));
            time['esquema_id'] = undefined;
            time['valor_time'] = undefined;
            // time['patrimonio'] = undefined;
            time['rodada_atual'] = undefined;

            // ordena os jogadores de acordo com suas posições
            time.atletas = time.atletas.sort((a,b) => {return a['posicao_id']-b['posicao_id']});

            res.send({
                time
            })
        } catch (error) {
            console.log(error)
        }
    }
}