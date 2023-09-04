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