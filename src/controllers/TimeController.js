const axios = require('axios');

const URL = 'https://api.cartolafc.globo.com/time/id/';

const URL_MERCADO_STATUS = 'https://api.cartolafc.globo.com/mercado/status';

const URL_MERCADO_ATLETAS = "https://api.cartola.globo.com/atletas/mercado";

const URL_PONTUADOS = 'https://api.cartolafc.globo.com/atletas/pontuados';

const URL_CLUBES = 'https://api.cartola.globo.com/clubes';

module.exports = {
    async infoTime(req, res) {
        function encurtaNome(nome){
            if(nome.length > 10){
                
                let nomeSeparado = nome.split(' ');

                /* Para remover valores em em branco */
                for (let i = 0; i < nomeSeparado.length; i++) {
                    if(!nomeSeparado[i]){
                        nomeSeparado.splice(i,1);
                    }                    
                }
                for (let i = 0; i < nomeSeparado.length-1; i++) {
                    nomeSeparado[i] = nomeSeparado[i][0]+". ";                
                }
                return nomeSeparado.join(' ');
            } else {
                return nome;
            }
        }

        function isCapitao(atletaId,capitaoId,pontosNomais){
           return  capitaoId === atletaId ? 2*parseFloat(pontosNomais.toFixed(1)) : parseFloat(pontosNomais.toFixed(1))
        }

        function esquema(esquemaId){
            const esquemas = [
                "",
                "3-4-3",
                "3-5-2",
                "4-3-3",
                "4-4-2",
                "4-5-1",
                "5-3-2",
                "5-4-1",
            ]
            if(esquemaId) {
                return esquemas[esquemaId];
            } else {
                return esquemas[4]
            }
        }
        
        async function getStatusMercado(){
            let response = await axios.get(URL_MERCADO_STATUS);
            let statusMercado = response.data.status_mercado;
            return statusMercado;
        }

        async function pegaPontuados(){
            let response = await axios.get(URL_PONTUADOS);
            let pontuados = response.data;
            return pontuados;
        } 

        try {
            let response = await axios.get(`${URL}${req.params.id}`); 
            let responseMercado = await axios.get(`${URL_MERCADO_ATLETAS}`);
            let responseClubes = await axios.get(`${URL_CLUBES}`);
            let clubes = responseClubes.data;
            let time = response.data;
            let posicoes = responseMercado.data.posicoes;
            let statusMercado = await getStatusMercado();
            // se o mercado estiver aberto
            let pontuadosJSON = (statusMercado != 2 ) ? '' : await pegaPontuados();
            // console.log
            let somatorioJogadoresPontuando = 0;
            if(time['atletas']){
                for (let i = 0; i < time['atletas'].length; i++) {
                    let posicao_id = time['atletas'][i]['posicao_id']
                    let posicao = posicoes[posicao_id]['abreviacao'];
                    
                    
                    time['atletas'][i].nome = undefined;
                    time['atletas'][i].apelido = encurtaNome(time['atletas'][i].apelido);
                    time['atletas'][i].slug = undefined;
                    // time['atletas'][i].foto = undefined;
                    // time['atletas'][i].clube_id = undefined;
                    time['atletas'][i].preco_num = undefined;
                    time['atletas'][i].variacao_num = undefined;
                    time['atletas'][i].jogos_num = undefined;
                    time['atletas'][i].media_num= undefined;

                    if(statusMercado === 2){
                        let atletaJogando = pontuadosJSON['atletas'][time['atletas'][i].atleta_id] ? true : false;
                        let idAtleta = time['atletas'][i].atleta_id;
                        time['atletas'][i].pontos_num = atletaJogando ? isCapitao(time['capitao_id'], idAtleta, pontuadosJSON['atletas'][time['atletas'][i].atleta_id]['pontuacao']) : 0;
                        time['atletas'][i].scout = atletaJogando ? pontuadosJSON['atletas'][time['atletas'][i].atleta_id]['scout'] : null;
                        somatorioJogadoresPontuando += time['atletas'][i].pontos_num;
                    }else{
                        time['atletas'][i].pontos_num = isCapitao(time['capitao_id'], time['atletas'][i].atleta_id, time['atletas'][i].pontos_num);
                    }
                    time['atletas'][i].posicao = posicao
                    time['atletas'][i].posicao_classe = `pos-${posicao}`;
                    time['atletas'][i].capitao = time['capitao_id'] === time['atletas'][i].atleta_id ? true : false;

                    time['atletas'][i].reserva = false;
                }
                // ordena os jogadores de acordo com suas posições
                time.atletas = time.atletas.sort((a,b) => {return a['posicao_id']-b['posicao_id']});
            }else {
                time['atletas'] = [];
                for (let i = 0; i < 12; i++) {
                    time['atletas'][i] = {};
                    time['atletas'][i].apelido = "N�o Escalado";
                    time['atletas'][i].pontos_num = "-";
                    time['atletas'][i].posicao = "x";
                    time['atletas'][i].posicao_classe = `pos-gol`;
                    time['atletas'][i].capitao = false;
                    time['atletas'][i].scout = {};
                }
                time['montou_time'] = false;
                time['time_info'] = {};
                time['time_info']['escudo_url'] = time['time']['url_escudo_png'];
                time['time_info']['nome_completo'] = time['time']['nome'];
                time['time_info']['nome'] = encurtaNome(time['time']['nome']);
                
                time['pontos'] = 0;
                time['esquema'] = "-";
                time['valor_time'] = undefined;
                time['patrimonio'] = 0;
                time['rodada_atual'] = undefined;
            }
            if(time['reservas']) {
                let qtdAtletasReserva = time['reservas'].length;

                for (let i = 0; i < qtdAtletasReserva; i++) {
                    let posicao_id = time['reservas'][i]['posicao_id']
                    let posicao = posicoes[posicao_id]['abreviacao'];
                    let jogador = time['reservas'][i];
                    
                    jogador.nome = undefined;
                    jogador.apelido = encurtaNome(jogador.apelido);
                    jogador.slug = undefined;
                    // jogador.foto = undefined;
                    // jogador.clube_id = undefined;
                    jogador.preco_num = undefined;
                    jogador.variacao_num = undefined;
                    jogador.jogos_num = undefined;
                    jogador.media_num= undefined;

                    if(statusMercado === 2){
                        let atletaJogando = pontuadosJSON['atletas'][jogador.atleta_id] ? true : false;
                        let idAtleta = jogador.atleta_id;
                        jogador.pontos_num = atletaJogando ? isCapitao(time['capitao_id'], idAtleta, pontuadosJSON['atletas'][jogador.atleta_id]['pontuacao']) : 0;
                        jogador.scout = atletaJogando ? pontuadosJSON['atletas'][jogador.atleta_id]['scout'] : null;
                        somatorioJogadoresPontuando += jogador.pontos_num;
                    }else{
                        jogador.pontos_num = isCapitao(time['capitao_id'], jogador.atleta_id, jogador.pontos_num);
                    }
                    jogador.posicao = posicao
                    jogador.posicao_classe = `pos-${posicao}`;
                    jogador.capitao = time['capitao_id'] === jogador.atleta_id ? true : false;

                    jogador.reserva = true;
                }
            }

            time['posicoes'] = undefined;
            time['status'] = undefined;
            time['capitao_id'] = undefined;
            time['montou_time'] = true;
            time['time_info'] = {};
            time['time_info']['escudo_url'] = time['time']['url_escudo_png'];
            time['time_info']['nome_completo'] = time['time']['nome'];
            time['time_info']['nome'] = encurtaNome(time['time']['nome']);
            
            time['time'] = undefined;
            time['pontos'] = statusMercado === 2 ? parseFloat(somatorioJogadoresPontuando.toFixed(1)) : parseFloat( time['pontos'].toFixed(1));
            time['esquema'] = esquema(time['esquema_id']);
            time['valor_time'] = undefined;
            time['patrimonio'] = parseFloat( time['patrimonio'].toFixed(1));
            time['rodada_atual'] = undefined;
            time["clubes"] = clubes;
            
            res.send({
                time
            })
        } catch (error) {
            console.log(error)
        }
    }
}