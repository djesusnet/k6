import http from 'k6/http';
import { group } from 'k6';

// Etiquetas em nível de teste
export let options = {
    tags: { 'projeto': 'meu-projeto', 'tipoDeTeste': 'carga' }
};

export default function() {
    // Grupo: Homepage
    group('Homepage', function() {
        // Solicitação com etiqueta personalizada
        let res = http.get('https://example.com', { tags: { 'nome': 'Homepage' } });
    });
  
    // Grupo: Produto
    group('Página do Produto', function() {
        // Solicitação com etiqueta personalizada
        let res = http.get('https://example.com/produto', { tags: { 'nome': 'Página do Produto' } });
    });
}
