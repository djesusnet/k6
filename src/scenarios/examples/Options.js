import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  // Define o cenário de teste
  scenarios: {
    my_scenario: {
      executor: 'constant-arrival-rate',
      rate: 50,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 0,
      maxVUs: 100,
    },
  },
  
  // Limiares (thresholds) para falha do teste
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // 95% das solicitações devem completar abaixo de 500ms
  },

  // Variáveis de ambiente
  env: {
    MY_ENV_VAR: 'some value',
  },

  // Configurações de tempo limite
  httpDebug: 'full',  // Mostra informações detalhadas sobre cada solicitação HTTP.
  
  // Outras opções como certificados TLS podem ser definidas aqui
  tlsAuth: [
    { domains: ['example.com'], cert: open('./cert.pem'), key: open('./key.pem') },
  ],
};

export default function () {
  const res = http.get('http://test.k6.io');
  sleep(1);
}
