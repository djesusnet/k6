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

## O que são Métricas no k6?

Métricas no k6 são valores coletados durante os testes de desempenho. Elas permitem analisar a performance do sistema de várias perspectivas, oferecendo insights sobre tempos de resposta, latência, taxas de transferência, erros, entre outros.

### Métricas Integradas

O k6 possui várias métricas internas que são automaticamente coletadas durante os testes. Aqui estão algumas das mais importantes:

- http_reqs: Esta métrica registra o número total de requisições HTTP feitas.

- http_req_duration: Mede o tempo que uma requisição leva para ser completada. Isso inclui o tempo gasto na conexão, enviando a requisição, e recebendo a resposta.

- http_req_blocked: Esta métrica mede o tempo que uma requisição passa bloqueada, aguardando a permissão do sistema operacional para ser enviada.

- http_req_connecting: Registra o tempo gasto estabelecendo a conexão TCP.

- http_req_receiving: Mede o tempo gasto recebendo a resposta do servidor.

- http_req_sending: Esta métrica mede o tempo gasto enviando a requisição ao servidor.

- http_req_waiting: Mede o tempo que a requisição passa em espera no servidor.


### Métricas Personalizadas

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

### Visualização de Métricas

![image](https://github.com/djesusnet/k6/assets/50085026/e5c35c29-b164-4e77-ac26-0bf55ee00d7c)








## Checks (Verificações)

No k6, "checks" são usados para validar o comportamento e o desempenho de um sistema durante um teste de carga. Eles são essencialmente asserções que retornam true ou false dependendo se a condição especificada foi atendida.

### Verificar o Status HTTP

O exemplo mais simples de um "check" é validar o código de status HTTP de uma resposta. Veja o exemplo abaixo:

```js
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  let res = http.get('http://test.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

Neste caso, o "check" verificará se o status HTTP da resposta é 200. Se for, o "check" passará; caso contrário, falhará.

### Verificar o Tempo de Resposta

Você também pode verificar o tempo de resposta. Por exemplo, para verificar se o tempo de resposta é menor que 200 milissegundos:

```js
check(res, {
  'response time is less than 200ms': (r) => r.timings.duration < 200,
});
```

## Verificar Conteúdo da Resposta

Também é possível verificar o conteúdo da resposta para validar se é o esperado:

```js
check(res, {
  'body contains "Welcome"': (r) => r.body.indexOf('Welcome') !== -1,
});
```

### Múltiplos Checks

Você pode ter múltiplos "checks" para uma única resposta:

```js
check(res, {
  'status is 200': (r) => r.status === 200,
  'response time is less than 200ms': (r) => r.timings.duration < 200,
  'body contains "Welcome"': (r) => r.body.indexOf('Welcome') !== -1,
});
```

### Contando Checks Passados e Falhos

Os "checks" são especialmente úteis porque o k6 os contará para você. No final de uma execução de teste, você pode ver quantos dos seus "checks" passaram e quantos falharam, fornecendo um resumo fácil de entender do comportamento do seu sistema sob carga.

Esses são exemplos básicos. A funcionalidade de "checks" é bastante flexível e permite uma ampla gama de asserções para validar o comportamento e desempenho do sistema que você está testando.

![image](https://github.com/djesusnet/k6/assets/50085026/4d2eedcf-79e3-44f6-8974-a02cfe7396c9)


## Thresholds (Limiares) 

Os "Thresholds" (Limiares) em k6 são um mecanismo poderoso para definir critérios de sucesso ou falha de um teste de carga. Enquanto os "checks" fornecem uma maneira de validar a resposta a cada requisição individual, os "thresholds" permitem especificar limites agregados que não devem ser ultrapassados durante a execução do teste inteiro. Se algum desses limites for ultrapassado, o k6 marcará o teste como falho ao terminar a execução.

Isso é útil para impor padrões de qualidade em seu código e infraestrutura, pois você pode configurar seu ambiente de CI/CD para parar o processo de implantação se algum limite for ultrapassado.

### Exemplo 1: Tempo de Resposta Médio

Suponhamos que você queira que o tempo de resposta médio durante o teste inteiro seja menor que 200 milissegundos. Você pode definir um limiar para isso da seguinte forma:

```js
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  thresholds: {
    'http_req_duration': ['avg<200'],  // tempo de resposta médio deve ser menor que 200 ms
  },
};

export default function () {
  let res = http.get('http://test.k6.io');
  check(res, {'status is 200': (r) => r.status === 200});
}
```

### Exemplo 2: Taxa de Sucesso

Digamos que você também queira garantir que pelo menos 95% de todas as requisições sejam bem-sucedidas. Você pode adicionar um novo limiar para a taxa de sucesso:

```js
export let options = {
  thresholds: {
    'checks': ['rate>0.95'],  // taxa de sucesso deve ser maior que 95%
  },
};
```

### Exemplo 3: Múltiplos Limiares

Você também pode combinar múltiplos limiares:

```js
export let options = {
  thresholds: {
    'http_req_duration': ['avg<200', 'p(95)<400'],
    'checks': ['rate>0.95'],
  },
};
```

Neste exemplo, estamos definindo três limiares:

1. O tempo de resposta médio (avg) deve ser menor que 200 ms.
2. O tempo de resposta no percentil 95 (p(95)) deve ser menor que 400 ms.
3. A taxa de sucesso dos "checks" deve ser maior que 95%.

Se algum desses limiares for violado durante a execução do teste, o k6 sairá com um código de saída diferente de zero, indicando falha, o que é útil para integração com sistemas de CI/CD.

Esses são apenas exemplos simples. Os limiares são um recurso muito flexível em k6, permitindo que você defina critérios de sucesso ou falha com base em diversas métricas e estatísticas.

## Options (Opções) 

No k6, "Options" (Opções) são configurações que permitem controlar diversos aspectos de um teste de carga, como o número de Usuários Virtuais (VUs), a duração do teste, os limiares (thresholds) e muitos outros parâmetros. Essas opções podem ser definidas diretamente na linha de comando ou dentro do próprio script de teste. Algumas das opções mais comuns incluem:

### Número de VUs

Define o número de Usuários Virtuais (VUs) que executarão o teste. Exemplo:

```js
export let options = {
  vus: 10,
};
```

### Duração do Teste

Especifica a duração total do teste. Exemplo:

```js
export let options = {
  duration: '30s',
};
```

### Stages (Estágios)

Permite escalonar o número de VUs ao longo do tempo. Isso é útil para simular cenários mais complexos de carga e descarga. Exemplo:

```js
export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};
```

### Thresholds (Limiares)

Permite definir critérios de sucesso ou falha para o teste com base em métricas específicas. Exemplo:

```js
export let options = {
  thresholds: {
    'http_req_duration': ['avg<100', 'p(95)<200'],
  },
};
```

### Tags

Essas opções permitem organizar seus testes e requisições de forma mais significativa. Exemplo:

```js
export let options = {
  tags: { my_custom_tag: 'value' },
};
```

### Outras Opções

Existem muitas outras opções que controlam outros aspectos dos testes, como limites de taxa de requisição, opções de protocolo HTTP e muito mais.

As opções podem também ser combinadas para fornecer um controle muito granular sobre como o teste é executado. Por exemplo:

```js
export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['avg<100'],
  },
};
```

Neste exemplo, o teste será executado com 10 VUs por 30 segundos, e exigirá que o tempo de resposta médio seja menor que 100 milissegundos.

Definir opções é um aspecto fundamental do design de testes de carga com k6, permitindo que você ajuste o comportamento do teste para se adequar às suas necessidades específicas.

## O ciclo de vida de um teste

O ciclo de vida de um teste em k6 é relativamente simples de entender, mas oferece bastante flexibilidade para criar cenários de teste de carga complexos. Aqui estão as etapas básicas:

### 1. Inicialização

Na fase de inicialização, o k6 executa todo o código fora das funções default ou export default. Isso inclui a importação de bibliotecas e a definição de configurações globais e opções de teste (options). A inicialização ocorre apenas uma vez, independentemente do número de VUs (Usuários Virtuais) envolvidos no teste.

### 2. Preparação (Opcional)

Se você definiu uma função setup, o k6 a executará antes de iniciar os VUs. Esta etapa é útil para preparar o estado do teste, como autenticação ou criação de dados que serão usados por todos os VUs.

```js
export function setup() {
  // Código de preparação aqui
}
```

### 3. Teste Principal

Esta é a fase onde os VUs executam a função default (ou a função exportada como default). Esta função contém o "corpo" do seu teste: as requisições HTTP, os "checks", as métricas personalizadas e assim por diante. Cada VU executa esta função repetidamente durante o tempo definido nas opções ou até que outras condições de término sejam atendidas.

```js
export default function() {
  // Código de teste aqui
}
```

### 4. Limpeza (Opcional)

Se você definiu uma função teardown, o k6 a executará após todos os VUs terem completado a execução. Essa etapa é útil para limpar qualquer estado ou recurso que você tenha configurado.

```js
export function teardown() {
  // Código de limpeza aqui
}
```

### 5. Resultados e Relatórios

Depois que o teste é concluído, o k6 exibe um resumo das métricas coletadas durante o teste. Se você estiver usando a versão em nuvem do k6, esses resultados podem ser enviados para a nuvem para análise mais detalhada.

Observações Importantes:
A função setup e a função teardown são executadas apenas uma vez durante o ciclo de vida do teste, independentemente do número de VUs.
As variáveis globais definidas na fase de inicialização não são compartilhadas entre VUs. Cada VU tem seu próprio espaço de memória isolado.
Compreender o ciclo de vida do teste em k6 é crucial para escrever testes eficazes e interpretar corretamente os resultados.


## Importando módulos

É comum importar módulos, ou partes de módulos, para usar em scripts de teste. No k6, você pode importar três tipos diferentes de módulos:

- Módulos integrados
- Módulos de sistema de arquivos locais
- Módulos HTTP(S) remotos

### Módulos integrados

k6 fornece muitos módulos integrados para funcionalidades principais. Por exemplo, ohttpcliente faz solicitações no sistema em teste. Para obter a lista completa de módulos integrados, consulte a documentação da API .

```js
import http from 'k6/http';
```

### Módulos de sistema de arquivos locais

Esses módulos são armazenados no sistema de arquivos local e acessados ​​por meio de caminhos relativos ou absolutos do sistema de arquivos. Para tornar os módulos do sistema de arquivos locais compatíveis com k6, o próprio módulo pode usar apenas importações relativas ou absolutas do sistema de arquivos para acessar suas dependências.

```js
//helpers.js
export function someHelper() {
  // ...
}
```

```js
//my-test.js
import { someHelper } from './helpers.js';

export default function () {
  someHelper();
}
```

### Módulos HTTP(S) remotos

Esses módulos são acessados ​​por HTTP(S), de uma fonte como o k6 JSLib ou de qualquer servidor web acessível publicamente. Os módulos importados são baixados e executados em tempo de execução, por isso é extremamente importante ter certeza de que você confia no código antes de incluí-lo em um script de teste .

```js
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
  randomItem();
}

```
### Módulo k6 reporter

Esta extensão para K6 deve ser usada adicionando-se ao código de teste K6 (JavaScript) e utiliza o gancho de retorno de chamada handleSummary , adicionado ao K6 v0.30.0. Quando o seu teste for concluído, um arquivo HTML será gravado no sistema de arquivos, contendo uma versão formatada e fácil de consumir dos dados de resumo do teste.

Para usar, adicione este módulo ao seu código de teste.

Importe a htmlReportfunção do módulo incluído hospedado remotamente no GitHub

```js
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
```

Então, fora da função padrão do teste, envolva-o com a handleSummary(data)função que K6 chama no final de qualquer test , como segue:

```js
import GetContacts from "./scenarios/contacts.js";
import GetNews from "./scenarios/news.js";
import {group , sleep} from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default() =>{

  group('Endpoint Get Contacts - API k6', () => {
    GetContacts();
  });

  group('Endpoint Get News - API k6', () => {
    GetNews();
 });

}
```

![image](https://github.com/djesusnet/k6/assets/50085026/c816f4be-4654-4af6-af35-cf7601d1d9ab)

![image](https://github.com/djesusnet/k6/assets/50085026/ac6425b0-5ddf-406e-a5c1-aca841508232)

Video: https://www.youtube.com/watch?v=8S9fxDqJlng&ab_channel=DanielJesus

código: https://github.com/benc-uk/k6-reporter

## Tags

Tags são pares chave-valor que podem ser anexados a métricas específicas para fornecer contexto adicional ou para facilitar a filtragem e análise posterior dos dados coletados durante um teste.

Por exemplo, você pode adicionar uma tag para indicar o ambiente em que o teste foi executado (como "produção" ou "desenvolvimento"), o tipo de recurso que está sendo testado (como "API" ou "UI"), entre outros.

Aqui está um exemplo de como você poderia adicionar tags a uma requisição HTTP em k6:

```js
import http from 'k6/http';

export default function () {
  const res = http.get('https://example.com', {
    tags: { nome: 'requisicaoPrincipal', ambiente: 'producao' },
  });
}
```

## Groups

Groups são uma maneira de organizar partes do seu código de teste em blocos lógicos. Isso facilita a leitura do código e também ajuda na organização das métricas coletadas durante o teste.

Por exemplo:

```js
import { group } from 'k6';
import http from 'k6/http';

export default function () {
  group('grupoPrincipal', function () {
    http.get('https://example.com');
  
    group('subgrupo', function () {
      http.get('https://example.com/subpagina');
    });
  });
}
```

Neste exemplo, todas as métricas coletadas dentro do bloco grupoPrincipal serão agrupadas sob essa etiqueta. O mesmo acontece para o subgrupo. Isso facilita a visualização e análise das métricas depois que o teste foi executado.

## Cookies

No k6, você pode manipular cookies de diversas formas. A biblioteca possui um objeto http.cookieJar() que permite que você obtenha ou defina cookies para um domínio específico. Além disso, os cookies definidos em respostas HTTP são automaticamente armazenados e enviados em solicitações subsequentes, imitando o comportamento de um navegador web.

Aqui estão alguns exemplos de como você pode trabalhar com cookies no k6:

### Definindo cookies manualmente

Você pode definir cookies usando o método jar.set():

```js
import http from 'k6/http';
import { CookieJar } from 'k6/http';

const jar = new CookieJar();

export default function () {
  jar.set('https://example.com', 'meuCookie', 'meuValor', { domain: 'example.com' });

  const res = http.get('https://example.com', { cookies: jar.cookiesForURL('https://example.com') });
}
```

### Utilizando cookies definidos pelo servidor

Se um servidor definir um cookie, ele será automaticamente armazenado e enviado nas próximas requisições:

```js
import http from 'k6/http';

export default function () {
  // Suponha que esta requisição defina um cookie
  http.get('https://example.com/set-cookie');

  // O cookie será incluído automaticamente nesta requisição
  http.get('https://example.com/use-cookie');
}
```

### Lendo cookies de uma resposta

Você também pode ler os cookies a partir da resposta de uma requisição HTTP:

```js
import http from 'k6/http';

export default function () {
  const res = http.get('https://example.com');

  const cookies = res.cookies;
  const meuCookie = cookies['meuCookie'][0];
  console.log(`Meu cookie: ${meuCookie.value}`);
}
```

Note que o campo cookies na resposta é um objeto onde cada chave é o nome de um cookie e o valor associado é uma matriz, já que é possível ter múltiplos cookies com o mesmo nome, mas diferentes atributos (como domínio ou caminho).

## Protocolos

O k6 oferece suporte a vários protocolos comuns usados em testes de desempenho web. Aqui estão alguns dos protocolos mais notáveis:

### HTTP/1.1 e HTTP/2

O k6 possui um excelente suporte para HTTP/1.1 e HTTP/2, permitindo testes abrangentes de APIs REST, sites e outras aplicações web.

Testar um endpoint HTTP é simples. O código abaixo faz uma requisição GET para o site example.com.

```js
import http from 'k6/http';

export default function () {
  http.get('http://example.com');
}
```

### WebSocket

O k6 também oferece suporte a WebSockets, o que é útil para testar aplicações em tempo real.
Para testar um WebSocket, você usaria o módulo k6/ws. Aqui está um exemplo que se conecta a um WebSocket e envia/recebe uma mensagem:

```js
import ws from 'k6/ws';

export default function () {
  const url = 'ws://example.com/socket';
  const params = { tags: { my_tag: 'hello' } };

  ws.connect(url, params, function (socket) {
    socket.on('open', function () {
      console.log('Connected.');
      socket.send('Hello, server!');
    });

    socket.on('message', function (data) {
      console.log(`Received message: ${data}`);
    });

    socket.on('close', function () {
      console.log('Disconnected.');
    });
  });
}
```

### gRPC

Recentemente, o k6 adicionou suporte para testes gRPC, que é um protocolo de alto desempenho para comunicações de sistema distribuído.
O suporte a gRPC foi introduzido em versões mais recentes do k6 e permite testar serviços gRPC. A biblioteca k6/net/grpc fornece as ferramentas necessárias.


```js
import grpc from 'k6/net/grpc';
import { check } from 'k6';

const client = new grpc.Client();
client.load(['../path/to/protobuf/files'], 'ServiceName');

export default () => {
  client.connect('grpc://localhost:8080', {
    // Configurações opcionais
  });

  const response = client.invoke('packageName.ServiceName/MethodName', {
    // dados da requisição
  });

  check(response, {
    'status is OK': (r) => r && r.status === grpc.StatusOK,
  });

  client.close();
};
```

### Outros protocolos e integrações

Além dos protocolos mencionados, o k6 tem um ecossistema de plugins e integrações que podem estender suas capacidades para suportar outros protocolos como MQTT, Apache Kafka, e mais. No entanto, essas extensões geralmente vêm da comunidade ou são contribuições externas e podem não ter o mesmo nível de suporte ou integração que os protocolos nativamente suportados.

Docc : https://k6.io/docs/using-k6/protocols/

## Scenarios (Cenários)

O k6 introduziu um novo conceito chamado "Scenarios" em versões mais recentes (v0.27.0 e posteriores) que permite uma configuração mais rica e flexível dos testes. Com Scenarios, você pode especificar múltiplos fluxos de execução em um único script de teste, cada um com suas próprias configurações, como VUs (Virtual Users), duração, etapas e outros.

Aqui estão alguns dos tipos de cenários que você pode usar:

### exec

O tipo de cenário mais simples, onde você apenas especifica uma função a ser executada.

```js
export const options = {
  scenarios: {
    my_simple_scenario: {
      exec: 'simple_function',
      executor: 'shared-iterations',
      vus: 10,
      iterations: 100,
    },
  },
};

export function simple_function() {
  // Seu código de teste aqui
}
```

### constant-vus

Mantém um número constante de VUs durante todo o teste.

```js
export const options = {
  scenarios: {
    constant_vus_scenario: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
    },
  },
};

export default function () {
  // Seu código de teste aqui
}
```

### ramping-vus

Permite que você aumente ou diminua o número de VUs durante o teste.

```js
export const options = {
  scenarios: {
    ramping_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 },
      ],
    },
  },
};

export default function () {
  // Seu código de teste aqui
}
```

### per-vu-iterations

Cada VU executa um número específico de iterações.


```js
export const options = {
  scenarios: {
    per_vu_iterations_scenario: {
      executor: 'per-vu-iterations',
      vus: 2,
      iterations: 10,
    },
  },
};

export default function () {
  // Seu código de teste aqui
}
```

### constant-arrival-rate

Mantém uma taxa constante de novas iterações iniciadas por unidade de tempo.

```js
export const options = {
  scenarios: {
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 1,
      maxVUs: 100,
    },
  },
};

export default function () {
  // Seu código de teste aqui
}
```

### ramping-arrival-rate

Permite aumentar ou diminuir a taxa de chegada de novas iterações durante o teste.

```js
export const options = {
  scenarios: {
    ramping_arrival_rate: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 },
      ],
      preAllocatedVUs: 1,
      maxVUs: 100,
    },
  },
};

export default function () {
  // Seu código de teste aqui
}

```

Esses são apenas alguns exemplos. O recurso de Scenarios é muito flexível e permite que você combine diferentes estratégias para modelar o comportamento do usuário de maneira mais precisa. Consulte a documentação oficial para mais detalhes e opções.

Doc: https://k6.io/docs/using-k6/scenarios/


## Saída de dados (Out)

O termo "out" no contexto do k6 refere-se à saída de dados, ou seja, onde o k6 enviará as métricas coletadas durante a execução dos testes. Por padrão, o k6 exibirá um resumo das métricas no terminal após a execução do teste. No entanto, em casos de uso mais avançados, você pode querer exportar essas métricas para um sistema externo para análise posterior, alertas ou integração com outras ferramentas.

O k6 suporta vários "outputs" (saídas), que podem ser especificados através da opção --out na linha de comando ou dentro do seu script de teste. Alguns dos outputs mais comuns são:

### InfluxDB

InfluxDB é um banco de dados de séries temporais popular para armazenar métricas. Você pode executar o k6 para enviar métricas diretamente para um banco de dados InfluxDB.

```
k6 run --out influxdb=http://localhost:8086/myk6db script.js
```

### Grafana

Embora o Grafana em si não seja um output, ele é frequentemente usado em conjunto com o InfluxDB para visualizar as métricas do k6 em um painel de controle.

### JSON

No k6, você pode exportar as métricas coletadas para um arquivo JSON usando a opção --out json=<nome_do_arquivo>. Isso permite que você armazene os dados para análises mais detalhadas posteriormente. O arquivo JSON resultante terá um objeto JSON por linha para cada ponto de dados de métrica.

```
k6 run --out json=resultado.json script.js
```

#### Exemplo de um script de teste k6 simples (script.js):

```js
import http from 'k6/http';

export default function () {
  http.get('http://example.com');
}
```

#### Exemplo simplificado de saída JSON (resultado.json)

```js
{"type":"Point","data":{"time":"2023-09-03T14:25:43.511Z","value":200,"tags":{"group":"","method":"GET","name":"http://example.com","proto":"HTTP/1.1","scenario":"default","status":"200","url":"http://example.com","vu":1}},"metric":"http_req_status"}
{"type":"Point","data":{"time":"2023-09-03T14:25:43.511Z","value":123.45,"tags":{"group":"","method":"GET","name":"http://example.com","proto":"HTTP/1.1","scenario":"default","status":"200","url":"http://example.com","vu":1}},"metric":"http_req_duration"}
```

Este é um exemplo muito simplificado e a saída real conteria muitos mais pontos de dados para diversas métricas, como http_req_blocked, http_req_connecting, http_req_tls_handshaking, http_req_waiting, etc.

Cada objeto JSON representa um ponto de dados para uma métrica específica. O campo metric especifica o nome da métrica, e o campo data contém detalhes como o tempo em que a medição foi feita, o valor da métrica e várias tags para fornecer contexto adicional (URL, método HTTP, etc.).

Você pode então importar este arquivo JSON para ferramentas de análise de dados, bancos de dados ou até mesmo processá-lo manualmente para extrair informações úteis.


### Testes de Stress com K6 e Monitoramento Visual no Grafana + InfluxDB


















