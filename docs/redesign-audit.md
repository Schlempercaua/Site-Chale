# Auditoria e direção de arte — Amanhecer da Serra

## Ajuste de direção solicitado pelo usuário
A paleta editorial inicial foi substituída pela identidade original: verde profundo #1A2218, verde #2C3A2A, terroso #5C4A32 e dourado #C9A96E. Hero, navegação e galerias usam verdes; recantos e estatísticas usam terroso; seções de leitura alternam areia quente e creme. O usuário pediu explicitamente mais natureza, cor e aconchego, evitando a predominância de branco. Conteúdo e composição permanecem preservados. Contrastes dos rótulos foram ajustados para os novos fundos.

## Escopo e preservação
Site estático: uma página HTML, CSS e JavaScript sem framework. Dez seções: início, sobre, galeria, recantos, comodidades, lazer, experiências, tarifas, como chegar e contato. Não há outras páginas HTML. Documento PDF de hospedagem mantido sem alterações.
O inventário anterior à implementação está em `artifacts/content-before.json`: textos, links, imagens, campos e seções. A comparação final usa os nós textuais do HTML original no Git, sem depender de caixa alta aplicada por CSS ou animação de contadores.

## Conteúdo e navegação
Cabeçalho: início, chalé, galeria, comodidades, tarifas e reserva. Rodapé também oferece localização. Links externos: WhatsApp com mensagens específicas por CTA/tarifa, Instagram da hospedagem e quatro estabelecimentos, e-mail, mapa incorporado e download do guia. Todos serão preservados.
Tarifas: R$ 750 e R$ 680, vantagens, observação sobre valores/check-in e exclusividade. Formulário: nome, entrada, saída, hóspedes (seis opções), telefone e mensagem; mensagens de erro/sucesso e texto enviado ao WhatsApp preservados.
Contato, descrições, localização, dados estruturados, metadados e copyright não serão corrigidos nem atualizados.

## Fotografias
28 fotos JPEG com alternativas WebP. Inventário visual: `artifacts/photo-inventory.jpg`.
Hidro/neblina: melhor imagem de abertura pela janela, vista e conforto combinados; proporção vertical preservada na composição lateral. Interior panorâmico e deck: dupla de escala arquitetônica na seção sobre. Galeria: nove imagens, hierarquia para hidro, ambiente e fachada; recantos: quatro vistas complementares em sequência horizontal acessível. Lazer: oito imagens em composição alternada; balanço, fogueira e trilha têm maior força narrativa. Quatro recomendações mantêm suas próprias fotografias, com descrições fora da imagem para leitura. Pórtico mantém função de contextualização geográfica. Nenhuma imagem de stock ou gerada.

## Diagnóstico
- Mesma linguagem de títulos centralizados e grades repetida; pouca distinção entre capítulos.
- Três famílias tipográficas, corpo serifado e muitos rótulos pequenos com espaçamento excessivo.
- Predominância verde/marrom/dourado, sombras e ornamentações competindo com fotos.
- Hero escurece excessivamente a fotografia vertical ao ampliá-la em toda a tela.
- Loader bloqueia acesso até o evento load e ainda adiciona espera artificial.
- Animações laterais em muitos elementos; parallax por background-position provoca pintura; contadores alteram números durante leitura.
- Lightbox sem foco inicial efetivo, contenção de Tab ou devolução de foco; controles invisíveis ainda podem receber foco.
- Menu mobile precisa fechamento por Escape e tratamento de foco.
- Validação não associa mensagens ao campo nem move foco ao primeiro erro.
- Envio contém logs de dados pessoais e fallback que pode duplicar navegação, pois noopener pode retornar null mesmo com janela aberta.
- Layout mobile precisa preservar todas as informações e compensar CTA fixo.

## Sistema e arquitetura visual
Paleta: porcelana #f4f2ec, carvão #202725, cobre #92533e, cinza #59605c. Tipografia: Cormorant Garamond para títulos expressivos, Manrope para leitura/interface. Escala de espaços baseada em 8px; largura máxima 1360px e margens fluidas.
Hero editorial dividido, imagem com grande altura, título à esquerda, preço legível sobre a foto. Estatísticas como faixa de leitura. Sobre assimétrico com sobreposição de fotografias. Galeria clara em mosaico; recantos em capítulo carvão com sequência fotográfica horizontal. Comodidades em lista com divisórias. Lazer em mosaico espaçado. Experiências como pares foto/texto. Tarifas como comparação editorial; localização escura, mapa sem filtro; contato claro com formulário explícito. Rodapé amplo e navegação consistente.
Motion: entrada de 650ms com deslocamento vertical de 18px, imagem de abertura com aproximação única, hover 240ms, profundidade máxima de poucos pixels somente com ponteiro fino. Sem scroll hijacking, partículas ou dependências 3D. Redução de movimento desativa transforms/animações e mantém conteúdo visível.

## QA planejado
Comparar todos os nós textuais e destinos com original. Validar assets e âncoras; desktop 1440/1920, notebook 1024, tablet 768, mobile 390/320. Inspecionar screenshots de todas as seções. Testar teclado/menu/lightbox, erros e URL de reserva com interceptação local (sem envio), reduced-motion e ausência de JS. Conferir overflow, contraste, peso dos assets e erros de console.
