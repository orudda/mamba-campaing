# Sistema de Gerenciamento de Campanhas

API RESTful para gerenciamento de campanhas desenvolvida com NestJS, SQLite.

## Funcionalidades

- CRUD completo de campanhas
- Validações de datas
- Soft delete
  - Possibilidade de listar campanhas deletadas
  - Rastreamento da data de deleção
- Atualização automática de status para campanhas expiradas
  - Verificação automática a cada minuto
  - Atualização em tempo real do status
- Documentação Swagger
- Testes unitários

## Pré-requisitos

- Docker
- Docker Compose

## Instalação e Execução

1. Clone o repositório:
```bash
git clone <repository-url>
cd mamba-campaign
```

2. Inicie a aplicação com Docker Compose:
```bash
docker compose build
```
```bash
docker compose up
```

A API estará disponível em `http://localhost:3000`
A documentação Swagger estará disponível em `http://localhost:3000/api`

## Estrutura do Projeto

O projeto segue uma arquitetura em camadas (n-layer):

- `domain/`: Contém as entidades e DTOs que definem o domínio da aplicação
  - `entities/`: Definições das entidades do banco de dados
  - `dto/`: Objetos de transferência de dados para entrada e saída da API

- `application/`: Contém a lógica de negócio da aplicação
  - `services/`: Serviços que implementam as regras de negócio
    - `campaign.service.ts`: Gerenciamento de campanhas
    - `campaign-scheduler.service.ts`: Agendamento de tarefas automáticas

- `presentation/`: Contém os controllers e a interface da API
  - `controllers/`: Controllers que gerenciam as rotas e requisições HTTP

## Endpoints da API

- `POST /campaigns`: Criar uma nova campanha
- `GET /campaigns`: Listar todas as campanhas ativas
- `GET /campaigns/all`: Listar todas as campanhas (incluindo deletadas)
- `GET /campaigns/:id`: Buscar uma campanha específica
- `PATCH /campaigns/:id`: Atualizar uma campanha
- `DELETE /campaigns/:id`: Remover uma campanha (soft delete)

## Testes

Para executar os testes:

```bash
# Testes unitários
docker compose exec api npm run test

# Testes com coverage
docker compose exec api npm run test:cov
```

## Campos da Campanha

- `id`: Identificador único
- `nome`: Nome da campanha
- `dataCadastro`: Data e hora de criação (gerado automaticamente)
- `dataInicio`: Data de início
- `dataFim`: Data de fim
- `status`: Status da campanha (ativa, pausada ou expirada)
- `categoria`: Categoria da campanha
- `deletedAt`: Data de deleção (apenas para campanhas deletadas)

## Validações

- A data de fim deve ser posterior à data de início
- A data de início deve ser igual ou posterior à data atual
- Campanhas são marcadas automaticamente como expiradas quando a data final é ultrapassada
  - Verificação automática ocorre a cada minuto
  - Status é atualizado sem necessidade de intervenção manual

## Gerenciamento de Campanhas Deletadas

- O sistema utiliza soft delete para manter o histórico de campanhas
- Campanhas deletadas podem ser visualizadas através do endpoint `/campaigns/all`
- O endpoint padrão `/campaigns` mostra apenas campanhas ativas (não deletadas)
- A data de deleção é registrada automaticamente no campo `deletedAt`
