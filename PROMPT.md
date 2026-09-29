Você é um desenvolvedor front-end criativo sênior, especialista em scrollytelling e
sites premiados (nível Awwwards). Construa o site do espaço de estética descrito
abaixo, com experiência de scroll imersiva, usando as fotos reais da pasta ./imagens.

=== REGRA DE PASTA (OBRIGATÓRIA) ===
Este é um projeto NOVO e INDEPENDENTE. Trabalhe SOMENTE dentro da pasta
"curvas-estetica" (a pasta onde este PROMPT.md está). Se você não estiver dentro
dela, crie-a em um local separado de qualquer outro projeto e trabalhe lá.
NÃO leia, reutilize, copie ou modifique arquivos de outros projetos (por exemplo,
Melhor Opção, Produtos da Terra, Studio Salute, Lubelly Boutique, Iniciativa
Contabilidade ou Stormyz). Todo código, imagem otimizada e arquivo gerado fica
dentro de "curvas-estetica".
====================================

=== O ESPAÇO ===
Nome: Curvas Estética – Jozzy Lima
Profissional responsável: Jozzy Lima [CONFIRMAR formação e registro profissional,
ex.: esteticista, biomédica, fisioterapeuta dermatofuncional]
Segmento: estética [CONFIRMAR foco: corporal, facial ou ambos]
Procedimentos: [PREENCHER com a lista real, ex.: drenagem linfática, massagem
modeladora, limpeza de pele, tratamentos para gordura localizada, celulite,
flacidez, pós-operatório]
Localização: próximo à CSB 7 – Taguatinga Sul, Brasília – DF
Endereço completo: [PREENCHER]
WhatsApp: [PREENCHER] → link: https://wa.me/55[NUMERO]
Instagram: [PREENCHER]
Horário: [PREENCHER — atendimento com hora marcada?]
Formas de pagamento: [PREENCHER]
Diferenciais: [ex.: atendimento individual com a própria Jozzy, avaliação
personalizada, ambiente reservado — PREENCHER]
Público: principalmente mulheres de Taguatinga e região que buscam cuidar do corpo
e da pele com acompanhamento de perto.
Identidade visual: [descrever a partir do logo e das fotos; se não houver logo,
proponha uma paleta coerente com o ambiente real do espaço]
Objetivo do site: quem procura "estética em Taguatinga Sul" ou vê o Instagram
confiar na Jozzy, entender os procedimentos e agendar uma avaliação pelo WhatsApp.

Fotos disponíveis em ./imagens:
- [listar os arquivos que eu colocar na pasta]
=================

PASSO 0 — ANTES DE CODAR
1. Confirme em qual pasta você está e que ela é a "curvas-estetica".
2. Liste e abra todas as imagens em ./imagens. Descreva cada uma e decida em qual
   cena ela entra. Se a pasta estiver sem fotos, PARE e me avise antes de seguir.
3. Otimize as imagens: converta para WebP em 3 larguras (640, 1280, 1920), salve
   em ./imagens/otimizadas e use srcset + lazy loading.
4. Apresente o plano e ESPERE minha aprovação:
   - paleta final em hex e 1 ou 2 fontes, com justificativa
   - storyboard cena por cena dizendo o que o scroll faz em cada uma
   Revise o plano e troque tudo que parecer genérico ou "cara de IA".

CLIMA DA EXPERIÊNCIA
Acolhedor, feminino sem clichê, e profissional. O nome "Curvas" é o fio condutor:
linhas curvas e contornos que se desenham com o scroll, movimentos fluidos e
suaves como uma massagem. Transmitir cuidado e confiança, nunca pressão estética.

ARQUITETURA DA EXPERIÊNCIA
O site é uma sequência de cenas. Cada cena ocupa de 200vh a 400vh e fica fixa
(pinned) enquanto o scroll controla o que acontece dentro dela, com scrub (a
animação avança e volta junto com a rolagem).

STORYBOARD SUGERIDO (adapte ao que as fotos permitirem)
1. Preloader: uma única linha curva contínua se desenha em traço (SVG com
   stroke-dashoffset) acompanhando o carregamento real de 0% a 100% e forma o "C"
   de Curvas; ao completar, abre a cena 1.
2. Abertura: o nome "Curvas Estética" entra por letras; uma curva orgânica recorta
   (clip-path) a foto do espaço e se expande com o scroll até ocupar a tela.
3. Quem cuida de você: cena sobre a Jozzy Lima, com foto dela, formação real e
   uma frase curta na voz dela sobre como atende. Gera confiança antes dos
   procedimentos.
4. Procedimentos: cena pinned em que cada procedimento ocupa a tela por vez, com
   foto, o que é, para quem é indicado e quanto tempo dura a sessão, em linguagem
   simples. Uma linha curva liga um procedimento ao outro conforme o scroll.
5. Momento principal (só este no site inteiro): uma frase sobre autocuidado
   [propor ou PREENCHER], em tipografia grande, com curvas atravessando a tela
   lentamente por scrub.
6. O espaço: scroll horizontal pelas salas, recepção e aparelhos, com legendas.
7. Como funciona: avaliação → plano de tratamento → sessões (sequência real,
   pode ser numerada).
8. Localização e agendamento: endereço, horário, mapa incorporado (iframe do
   Google Maps) e CTA grande "Agendar avaliação pelo WhatsApp".

MECÂNICAS FIXAS DE INTERFACE
- Indicador de progresso fixo em forma de linha curva, clicável para navegar.
- Botão fixo de menu que abre um overlay "mapa do site" marcando "você está aqui".
- Botão flutuante de WhatsApp sempre acessível, discreto.
- Cada transição entre cenas usa um recurso diferente. Nunca repetir o mesmo efeito.
- Imagens reveladas com clip-path em formas curvas; textos entrando por palavra.

CUIDADOS DE CONTEÚDO (IMPORTANTES)
- Não prometer resultados ("perca X cm", "resultado garantido") nem usar
  linguagem que gere vergonha do corpo.
- Fotos de antes e depois SOMENTE se eu fornecer, com autorização da cliente, e
  seguindo as regras do conselho profissional da Jozzy; na dúvida, não usar.
- Não inventar depoimentos, números de clientes, prêmios ou formações.

STACK TÉCNICA
- Projeto estático: index.html, css/style.css, js/main.js.
- GSAP + ScrollTrigger (pin, scrub, uma timeline por cena), Lenis para rolagem
  suave e SplitType para texto, via CDN.
- Animar apenas transform, opacity, clip-path e stroke-dashoffset.

MOBILE
- Experiência redesenhada para o celular (a maioria vai abrir pelo Instagram ou
  WhatsApp): cenas pinned funcionando, scroll horizontal vira empilhamento com
  scrub, toques no lugar de hover.

SEO LOCAL
- Title e meta description com "estética em Taguatinga Sul" [ajustar aos
  procedimentos principais].
- Schema.org LocalBusiness (BeautySalon / HealthAndBeautyBusiness) em JSON-LD com
  nome, endereço, telefone, horário e geolocalização.
- Open Graph com uma foto do espaço, para o link ficar bonito no WhatsApp.

ACESSIBILIDADE
- prefers-reduced-motion com versão estática legível, foco visível, contraste AA,
  alt descritivo em todas as fotos.

PARA NÃO PARECER FEITO POR IA
- Proibido: rosa com dourado genérico, gradientes decorativos, cards idênticos
  arredondados com sombra cinza, ícones de folhinha/gota em grade, rótulos em caixa
  alta espaçada acima de títulos, destacar uma única palavra do título em outra
  cor, emojis, Inter/Roboto/Arial, o mesmo fade-up em todas as seções, frases
  genéricas ("realce sua beleza", "autoestima elevada"), fotos de banco de imagem.
- Textos curtos e calorosos, como a Jozzy falaria com uma cliente nova.

VERIFICAÇÃO (econômica)
- Rode um servidor local e tire no máximo 4 screenshots (390px e 1440px, no início
  e no meio do site). Faça só uma rodada de correção. Não repita o ciclo.

ENTREGA
- Site funcionando dentro da pasta "curvas-estetica".
- Lista do que ainda preciso preencher ou trocar.
