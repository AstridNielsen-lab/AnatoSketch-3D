# AnatoSketch 3D - IA Desenhista Anatomista

## 🧠 Sobre o Projeto

AnatoSketch 3D é um site educacional interativo que incorpora uma IA especialista em anatomia humana, focada em gerar simulações em estilo wireframe (malha de arame). O projeto oferece uma experiência imersiva de aprendizado anatômico com desenho em tempo real e explicações detalhadas.

## ✨ Funcionalidades Principais

### 🎨 Canvas Interativo
- **Lousa digital HTML5** com desenho em tempo real
- **Ferramentas de desenho** (caneta, borracha)
- **Controles de cor e espessura** personalizáveis
- **Grid de referência** para precisão anatômica
- **Suporte a touch** para dispositivos móveis

### 🤖 IA Anatomista (AnatoSketch)
- **Integração com Google Gemini 1.5 Flash**
- **Explicações técnicas detalhadas** sobre estruturas anatômicas
- **Respostas em tempo real** a comandos de texto
- **Conhecimento especializado** em anatomia humana

### 🦴 Partes Anatômicas Disponíveis
- **Crânio** - Caixa craniana, cavidades oculares, mandíbula
- **Tórax** - Caixa torácica, costelas, esterno
- **Braços** - Úmero, rádio, ulna, mãos e dedos
- **Pernas** - Fêmur, tíbia, fíbula, pés e dedos
- **Esqueleto** - Estrutura óssea completa
- **Sistema Muscular** - Principais grupos musculares
- **Sistema Nervoso** - Cérebro, medula, nervos principais
- **Sistema Cardiovascular** - Coração, artérias, veias
- **Sistema Linfático** - Vasos linfáticos, linfonodos

### 📚 Modo Estudo Guiado
- **Tour anatômico passo-a-passo** (10 etapas)
- **Progressão automática** com explicações detalhadas
- **Barra de progresso** visual
- **Desenho automático** de estruturas durante o tour

### 💾 Exportação
- **Formato SVG** - Gráficos vetoriais escaláveis
- **Formato PNG** - Imagens rasterizadas
- **Preservação de desenhos** feitos manualmente e pela IA

## 🚀 Como Usar

### 1. Comandos de Texto
Digite comandos no chat da IA:
```
- "desenhe o esqueleto humano em wireframe"
- "explique a estrutura do crânio"
- "mostre o sistema cardiovascular"
- "adicione músculos ao desenho"
```

### 2. Botões de Atalho
Clique nos botões da barra lateral esquerda:
- 💀 Crânio
- ❤️ Tórax
- 🤚 Braços
- 🦵 Pernas
- 🦴 Esqueleto
- 💪 Músculos
- 🧠 Sistema Nervoso
- 💓 Cardiovascular
- 🌊 Linfático

### 3. Desenho Manual
- Selecione a ferramenta **caneta** ou **borracha**
- Escolha **cor** e **espessura** do traço
- **Desenhe diretamente** no canvas
- Use **Ctrl+S** para exportar rapidamente

### 4. Estudo Guiado
1. Clique em "**Iniciar Tour**"
2. Acompanhe as **10 etapas** do tour anatômico
3. Observe os **desenhos automáticos** e **explicações**
4. Use "**Pausar Tour**" para interromper quando necessário

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura da aplicação
- **CSS3** - Design moderno e responsivo
- **JavaScript ES6+** - Lógica da aplicação
- **Canvas API** - Desenho vetorial em tempo real
- **Font Awesome** - Ícones da interface

### IA e API
- **Google Gemini 1.5 Flash** - Processamento de linguagem natural
- **Fetch API** - Comunicação com a API externa
- **Prompt Engineering** - Otimização das respostas da IA

### Design
- **Tema científico** com fundo escuro
- **Cores neon** (verde, azul, roxo)
- **Gradientes** e **sombras** modernas
- **Responsividade** para desktop e mobile

## 📋 Estrutura dos Arquivos

```
AnatoSketch3D/
├── index.html          # Página principal
├── styles.css          # Estilos e tema visual
├── script.js           # Lógica principal da aplicação
└── README.md           # Documentação do projeto
```

## 🔧 Configuração da API

O projeto usa a API do Google Gemini com as seguintes configurações:

```javascript
API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
API_KEY: "SUA API AQUI"
```

## 💡 Exemplos de Uso

### Comandos Básicos
```
"Desenhe o crânio humano em wireframe"
"Explique as proporções do corpo humano"
"Mostre a coluna vertebral"
"Adicione o sistema circulatório"
```

### Comandos Avançados
```
"Compare a anatomia do braço direito e esquerdo"
"Explique as conexões entre músculos e ossos"
"Desenhe o sistema nervoso central"
"Mostre as articulações principais"
```

## 🎯 Casos de Uso

### 👨‍🎓 Estudantes de Medicina
- Visualização de estruturas anatômicas
- Estudo guiado passo-a-passo
- Anotações visuais personalizadas

### 👨‍🏫 Professores de Anatomia
- Ferramenta de ensino interativa
- Demonstrações em tempo real
- Material didático exportável

### 🎨 Artistas e Ilustradores
- Referência anatômica precisa
- Proporções clássicas
- Estilo wireframe moderno

### 💻 Desenvolvedores
- Exemplo de integração com IA
- Canvas API avançado
- Design responsivo moderno

## 🔮 Funcionalidades Futuras

- [ ] **Camadas anatômicas** sobrepostas
- [ ] **Animações 3D** com rotação
- [ ] **Realidade aumentada** (AR)
- [ ] **Colaboração em tempo real**
- [ ] **Biblioteca de poses** anatômicas
- [ ] **Quiz interativo** com a IA
- [ ] **Modo professor** com apresentações
- [ ] **Exportação 3D** (OBJ, STL)

## 📱 Compatibilidade

### Desktop
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 13+

## 🤝 Contribuições

Este projeto é educacional e pode ser expandido com:
- Novos sistemas anatômicos
- Melhorias na IA
- Recursos de acessibilidade
- Traduções para outros idiomas

## 📄 Licença

Projeto educacional desenvolvido para demonstração de integração entre Canvas API e IA generativa.

---

**AnatoSketch 3D** - Transformando o aprendizado de anatomia através da tecnologia! 🧠✨
