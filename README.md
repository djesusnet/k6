# K6 Performance Testing

Este repositório é dedicado a fornecer recursos, exemplos e melhores práticas para o uso do K6, uma ferramenta de teste de desempenho de código aberto para APIs, microsserviços e sistemas de back-end. K6 foi projetado para ser "como desenvolvedores escrevem testes", fornecendo uma sintaxe simples e eficaz para definir cenários de teste.

## O que é o k6 ?
![k6](https://raw.githubusercontent.com/grafana/k6/master/assets/k6-logo-with-grafana.svg)



O K6 é uma ferramenta de teste de desempenho moderna, projetada para medir a capacidade e a resiliência de sistemas através da simulação de tráfego de usuários virtuais. É uma ferramenta de código aberto e é frequentemente usada para testar back-ends como APIs, microsserviços, servidores e sistemas inteiros.

Principais características do K6:

- Escrita de Scripts em JavaScript: Os cenários de teste são escritos em JavaScript, permitindo a criação de testes altamente personalizados.
- Linha de Comando: A ferramenta é orientada para linha de comando, tornando-a integrável com vários sistemas de CI/CD.
- Desempenho: Projetada para gerar carga alta em sistemas, para avaliar seu desempenho e resiliência sob diferentes condições.
- Extensibilidade: O K6 suporta várias saídas de dados, como InfluxDB e Grafana, para visualização de métricas em tempo real.

O K6 é popular entre os desenvolvedores por ser fácil de usar, permitir a escrita de cenários de teste de forma programática e integrar-se facilmente com outras ferramentas e sistemas.

## Instalação

### Linux

#### Debian/Ubuntu

```sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Fedora/CentOS

Usando dnf (ou yum em versões mais antigas):

```
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6

```

### MacOS

Usando Homebrew:

```
brew install k6

```

### Windows

Se você usar o gerenciador de pacotes Chocolatey, poderá instalar o pacote k6 com:

```
choco install k6
```

Se você usa o Gerenciador de Pacotes do Windows, instale os pacotes oficiais dos manifestos k6 (criados pela comunidade):

```
winget install k6
```

Alternativamente, você pode baixar e executar o instalador oficial mais recente.


### Docker

```
docker pull grafana/k6
```

Também temos uma imagem separada que você pode usar com o chromium instalado para executar testes do navegador k6.

```
docker pull grafana/k6:master-with-browser
```

## Rodando k6

Siga o passo a passo para aprender a:

- Executar um teste.
- Adicionar usuários virtuais.
- Aumentar a duração do teste.
- Ajustar o número de solicitações para cima e para baixo durante a execução do teste.

Com esses exemplos de trechos de código, você executará o teste com os recursos da sua máquina. No entanto, se você tiver uma conta na nuvem do k6, também poderá usar o comando k6 cloud para externalizar o teste para os servidores do k6.

### Executar testes locais

Para executar um script local simples:

1. Copie o código a seguir, cole-o no seu editor de texto favorito e salve-o como script.js.


```js

import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('https://test.k6.io');
  sleep(1);
}

```

Execute k6 com o seguinte comando no seu terminal:

```
k6 run script.js
```

Caso esteja usando Docker, basta executar esse comando abaixo:

```
# Ao usar a imagem docker `k6`, você não pode simplesmente fornecer o nome do script, pois
# o arquivo de script não estará disponível para o contêiner durante a execução. Em vez de
# você deve dizer ao k6 para ler `stdin` passando o nome do arquivo como `-`. Então você
# canaliza o arquivo real para o contêiner com `<` ou equivalente. Isso vai
# faz com que o arquivo seja redirecionado para o contêiner e lido por k6.

docker run --rm -i grafana/k6 run - <script.js

```

Docker no Windows PowerShell:

```

PS C:\> cat script.js | docker run --rm -i grafana/k6 run -

```

## O que são vus no k6 ?

VUs, ou "Usuários Virtuais", são uma abstração usada no K6 para simular usuários reais que interagem com seu sistema durante um teste de carga. Cada usuário virtual executa o script de teste que você definiu, fazendo solicitações HTTP, esperando respostas e executando todas as outras operações especificadas no seu script.

A ideia é que esses VUs gerem carga no sistema como se fossem usuários reais, permitindo que você veja como o seu sistema se comporta sob diferentes níveis de carga. Você pode especificar o número de VUs a serem usados durante o teste, e também pode variar esse número ao longo do tempo para simular diferentes cenários, como picos de tráfego.

Por exemplo, você pode começar um teste com 5 VUs e, ao longo de alguns minutos, aumentar esse número para 50 VUs para ver como o seu sistema se comporta quando a carga aumenta. Depois, você poderia reduzir o número de VUs para simular uma redução na demanda.

Os VUs são independentes entre si e não compartilham estados, ou seja, cada um deles é como um usuário real separado acessando o seu sistema.

É importante observar que, quanto mais VUs você usar, mais recursos (como CPU e memória) serão consumidos na máquina onde o teste está sendo executado. Portanto, é crucial considerar a capacidade do seu hardware ao planejar seus testes.

### Adicionando vus no seu script

Rodar testes com VUs (Usuários Virtuais) em k6 é um processo relativamente direto. Você pode definir o número de VUs diretamente na linha de comando ou dentro do seu script de teste usando a configuração de opções do k6. Abaixo estão alguns métodos para executar testes com VUs:

### Usando a Linha de Comando

Você pode especificar o número de VUs e a duração do teste diretamente na linha de comando. Por exemplo, para executar um script chamado script.js com 10 VUs por um período de 30 segundos, você usaria o seguinte comando:

```
k6 run --vus 10 --duration 30s script.js
```

### Configuração Dentro do Script

Você também pode definir o número de VUs e a duração dentro do próprio script de teste. Por exemplo:

```js
import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://test.k6.io');
}
```

Após termos explorado o processo de execução de testes de carga usando o k6, vamos agora aprofundar nosso entendimento sobre as métricas avançadas que essa ferramenta disponibiliza.

### O que são Métricas no k6?

Métricas no k6 são valores coletados durante os testes de desempenho. Elas permitem analisar a performance do sistema de várias perspectivas, oferecendo insights sobre tempos de resposta, latência, taxas de transferência, erros, entre outros.

## Métricas Integradas

O k6 possui várias métricas internas que são automaticamente coletadas durante os testes. Aqui estão algumas das mais importantes:

- http_reqs: Esta métrica registra o número total de requisições HTTP feitas.

- http_req_duration: Mede o tempo que uma requisição leva para ser completada. Isso inclui o tempo gasto na conexão, enviando a requisição, e recebendo a resposta.

- http_req_blocked: Esta métrica mede o tempo que uma requisição passa bloqueada, aguardando a permissão do sistema operacional para ser enviada.

- http_req_connecting: Registra o tempo gasto estabelecendo a conexão TCP.

- http_req_receiving: Mede o tempo gasto recebendo a resposta do servidor.

- http_req_sending: Esta métrica mede o tempo gasto enviando a requisição ao servidor.

- http_req_waiting: Mede o tempo que a requisição passa em espera no servidor.


## Métricas Personalizadas

O k6 também permite criar métricas personalizadas para capturar dados que não são coletados automaticamente. Isso pode ser feito usando uma das quatro funções de métrica personalizada: Counter, Gauge, Rate e Trend.

Aqui está um exemplo simples usando métricas personalizadas em um script k6:

```js
import http from 'k6/http';
import { Counter, Rate } from 'k6/metrics';

// Definir métricas personalizadas
var myCounter = new Counter('my_custom_counter');
var myRate = new Rate('my_custom_rate');

export default function () {
  // Fazer uma requisição HTTP
  let res = http.get('http://test.k6.io');

  // Incrementar o contador personalizado
  myCounter.add(1);

  // Adicionar valor à métrica de taxa (1 se a requisição for bem-sucedida, 0 caso contrário)
  myRate.add(res.status === 200);
}
```


















