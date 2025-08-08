i# Mapa de Festivais da Amazônia

Um projeto interativo que celebra e difunde a riqueza cultural dos festivais folclóricos da Região Amazônica.

## 🌟 Características

- **Mapa Interativo**: Visualização geográfica dos festivais com marcadores personalizados
- **Busca e Filtros**: Encontre festivais por nome, cidade ou mês
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Tema Amazônico**: Cores e elementos visuais inspirados na cultura regional
- **Efeitos Visuais**: Glassmorphism e animações suaves

## 🛠️ Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Leaflet** - Biblioteca de mapas interativos
- **Lucide Vue** - Ícones SVG modernos

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd mapa-festivais-amazonia
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── App.vue          # Componente principal
│   ├── main.js          # Ponto de entrada
│   └── style.css        # Estilos globais
├── public/              # Arquivos estáticos
├── index.html           # Template HTML principal
├── package.json         # Configurações do projeto
├── vite.config.js       # Configuração do Vite
├── tailwind.config.js   # Configuração do Tailwind
└── postcss.config.js    # Configuração do PostCSS
```

## 🎨 Personalização

### Cores do Tema

As cores podem ser personalizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  'theme-bg': '#FDF8F0',        // Fundo principal
  'theme-text': '#3C2A21',      // Texto principal
  'theme-primary': '#285C4D',    // Cor primária
  'theme-secondary': '#8A6F55',  // Cor secundária
  'theme-accent': '#E77728',     // Cor de destaque
}
```

### Adicionando Novos Festivais

Edite o array `festivals` no arquivo `src/App.vue`:

```javascript
{
  id: 9,
  name: 'Nome do Festival',
  city: 'Cidade, Estado',
  date: 'Período do evento',
  month: 6, // Mês numérico (1-12)
  coords: [-latitude, -longitude],
  description: 'Descrição do festival',
  icon: 'music' // Ícone do Lucide
}
```

## 🗺️ Mapas

O projeto usa o Leaflet com tiles do CartoDB Voyager. Para usar outros provedores de mapas, modifique a configuração no método `initMap()`.

## 📱 Responsividade

O layout é totalmente responsivo, adaptando-se a:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

- [ ] Adicionar mais festivais da região
- [ ] Implementar filtros por tipo de festival
- [ ] Adicionar fotos dos festivais
- [ ] Criar página individual para cada festival
- [ ] Implementar compartilhamento de festivais
- [ ] Adicionar modo offline

## 📞 Contato

Feito com ❤️ para celebrar a cultura amazônica.

Para dúvidas ou sugestões, abra uma issue no repositório.