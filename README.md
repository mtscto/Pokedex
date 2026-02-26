⸻

🧩 Pokédex — Vanilla JS Application

Aplicação web construída com JavaScript puro (ES6+), consumindo a PokéAPI, com arquitetura modular, controle de estado centralizado e renderização dinâmica orientada a performance.

🔗 Live Demo
https://pokedex-lake-delta.vercel.app

⸻

📌 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:
	•	Organização e escalabilidade
	•	Separação clara de responsabilidades
	•	Gerenciamento de estado sem frameworks
	•	Estrutura modular
	•	Experiência de usuário fluida

A proposta foi construir uma aplicação completa utilizando apenas JavaScript Vanilla, simulando responsabilidades que normalmente seriam delegadas a frameworks.

⸻

⚙️ Funcionalidades
	•	🔍 Busca por nome ou número
	•	🎛 Filtro por tipo
	•	📄 Paginação incremental (Load More)
	•	🎨 Alternância de visualização de sprites
	•	📱 Modal com navegação (botões, teclado e swipe)
	•	⚡ Skeleton loading
	•	🎬 Animação progressiva de cards
	•	🧠 Estado global centralizado

⸻

🧱 Arquitetura

O projeto foi estruturado em módulos independentes:

JS/
 ├── api/        → comunicação com a PokéAPI
 ├── state/      → gerenciamento de estado global
 ├── pokemon/    → renderização e animações
 ├── list/       → controle de paginação, busca e filtros
 ├── modal/      → lógica de navegação e exibição
 ├── ui/         → interações de interface

🔹 Gerenciamento de Estado

Um store centraliza:
	•	Lista completa de dados
	•	Lista visível
	•	Filtros ativos
	•	Página atual
	•	Estado do modal
	•	Modo de visualização

Isso evita dependências cruzadas e facilita manutenção.

⸻

🔹 Separação de Responsabilidades
	•	Renderização não manipula estado.
	•	Estado não manipula DOM.
	•	UI não contém regra de negócio.

Essa divisão torna o projeto previsível e escalável.

⸻

🛠 Tecnologias
	•	HTML5
	•	CSS3 modularizado
	•	JavaScript ES6+
	•	Fetch API
	•	PokéAPI
	•	Vercel (Deploy)

⸻

📈 Pontos Técnicos Trabalhados
	•	Manipulação performática de DOM (DocumentFragment)
	•	Controle manual de estado (sem frameworks)
	•	Estrutura modular baseada em responsabilidade
	•	Tratamento de erros na camada de API
	•	Deploy em ambiente real com debug de rede

⸻

🚀 Próximos Passos
	•	Implementação de testes unitários
	•	Otimização de carregamento (lazy loading)
	•	Refatoração para arquitetura baseada em componentes

⸻

👨‍💻 Autor

Matheus Tavares
Desenvolvedor Full Stack

⸻
