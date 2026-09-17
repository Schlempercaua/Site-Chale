# Validação do redesign

## Resultado
- Uma página e suas dez seções redesenhadas. PDF e fotografias originais preservados.
- Comparação com o HTML original no Git: **204 nós de texto e 28 links idênticos**, inclusive preços, descrições, contatos, mensagens e rótulos. Nenhuma âncora sem destino.
- Layout validado em **320, 390, 768, 1024, 1440 e 1920 px**, sem overflow horizontal ou fotografias quebradas. Capturas de todas as seções em desktop/mobile em `artifacts/`.
- Menu: abertura, Escape, foco devolvido e links por teclado.
- Galeria: Enter/Espaço, setas, contenção de Tab, Escape, devolução de foco e swipe; conteúdo de fundo inerte enquanto o diálogo está aberto.
- Formulário: erros associados aos campos, primeiro erro focado e URL de WhatsApp capturada em teste, com uma única abertura. Nenhuma solicitação real enviada.
- Axe-core: **zero violações detectadas** nas regras WCAG 2 A/AA e 2.1 AA em 1440 e 390 px. Isso não equivale a uma certificação integral de acessibilidade.
- `prefers-reduced-motion` desliga entrada/profundidade; conteúdo continua disponível sem JavaScript. Navegação mobile tem alternativa sem JavaScript.
- Fontes abertas locais, com licenças OFL. Sem bibliotecas de animação, WebGL ou dependências adicionais no runtime.

## Performance e limites
Medição em Edge/Chromium headless no servidor local, sem simulação de rede: LCP aproximado de **0,57 s**, CLS **0,0002**, **774 KB de recursos locais na abertura**. Valores de laboratório local, não métricas de produção nem garantia em rede móvel. Fotografias abaixo da dobra mantêm lazy loading; todas as fotos juntas transferem aproximadamente 7,7 MB ao percorrer a página inteira.
O ambiente bloqueia recursos externos no navegador, incluindo Google Maps. O iframe e os destinos externos foram preservados, mas a renderização do mapa e a disponibilidade de serviços de terceiros não puderam ser certificadas nesta rede. O redesign não altera a localização nem substitui o mapa por informações inventadas.
Validação visual e automatizada executada em Edge/Chromium com viewports responsivos; Safari/iOS e aparelhos físicos não foram testados.

## Reprodução
1. `node tools/preview.cjs` — abre servidor em `http://127.0.0.1:8085`.
2. Ferramentas de QA precisam de Playwright/Edge e axe-core. Axe instalado em `tools/qa-deps` (somente desenvolvimento; ignorado pelo Git).
3. `node tools/qa.cjs` — comparação de conteúdo, seis viewports, capturas e interações.
4. `node tools/accessibility.cjs` — acessibilidade, movimento reduzido e métricas locais.

Scripts de QA não fazem parte do carregamento do site. Publicação não executada.
