FROM node:20-alpine

WORKDIR /app

# Instalar dependências necessárias para o SQLite
RUN apk add --no-cache python3 make g++ sqlite sqlite-dev

# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Criar diretório para o SQLite e definir permissões
RUN mkdir -p /app/data && \
    chown -R node:node /app

# Mudar para o usuário node
USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 