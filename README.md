# 📦 API de Medição de Consumo

Esta API gerencia medições de consumo de água e gás usando IA da Gemini.

## 📑 Índice

1. [Clientes](#clientes)
2. [Leituras](#leituras)
3. [Confirmação de Leituras](#confirmação-de-leituras)
4. [Configuração](#configuração)
5. [Exemplos](#exemplos)
6. [Erros](#erros)

## Clientes

### Criar Cliente

**Endpoint:** `POST /customer/create`  
**Descrição:** Cria um novo cliente.

**Corpo:**

{ "customer_code": "string" }

markdown

**Resposta Sucesso:**

{ "customer_code": "string" }

markdown

**Erro:** 400 Bad Request se `customer_code` estiver ausente ou inválido.

### Buscar Cliente

**Endpoint:** `GET /customer/:customerCode`  
**Descrição:** Recupera detalhes do cliente e leituras associadas.

**Parâmetros:**

- `customerCode` (path): Código do cliente.
- `measure_type` (opcional, query): Tipo de medição (WATER ou GAS).

**Resposta Sucesso:**

{ "customer_code": "string", "measure_type": "WATER" | "GAS", "readings": [ { "measure_uuid": "string", "measure_value": "number", "measure_datetime": "string", "image_url": "string" } ] }

markdown

**Erro:** 404 Not Found se o cliente não for encontrado.

## Leituras

### Upload de Medição

**Endpoint:** `POST /readings/upload`  
**Descrição:** Faz o upload de uma medição.

**Corpo:**

{ "image_url": "imagem_codificada_em_base64", "measure_datetime": "string_data_iso8601", "measure_type": "WATER" | "GAS", "customerId": "string" }

markdown

**Resposta Sucesso:**

{ "image_url": "string", "measure_value": "number", "measure_uuid": "string" }

markdown

**Erro:** 400 Bad Request se a imagem não for válida ou já houver medição para o mês e tipo.

## Confirmação de Leituras

### Confirmar Medição

**Endpoint:** `PATCH /confirm`  
**Descrição:** Confirma uma medição.

**Corpo:**

{ "measure_uuid": "string", "confirmed_value": "number" }

markdown

**Resposta Sucesso:**

{ "success": true }

markdown

**Erro:** 
- 400 Bad Request se `measure_uuid` ou `confirmed_value` estiver ausente.
- 404 Not Found se a medição não for encontrada.
- 409 Conflict se a medição já estiver confirmada.

## Configuração

### API Key

Defina a variável de ambiente `API_KEY` com a chave fornecida pela Gemini antes de iniciar o servidor.

## Exemplos

### Criar Cliente

**Requisição:**

POST /customer/create Content-Type: application/json

{ "customer_code": "1234" }

makefile

**Resposta:**

{ "customer_code": "1234" }

makefile

### Upload de Medição

**Requisição:**

POST /readings/upload Content-Type: application/json

{ "image_url": "base64_image_data", "measure_datetime": "2024-08-28T12:00:00Z", "measure_type": "WATER", "customerId": "5678" }

makefile

**Resposta:**

{ "image_url": "http://localhost:3005/temp/uuid.jpg", "measure_value": 25.6, "measure_uuid": "uuid" }

markdown

## 🛠️ Docker

### Construir a Imagem Docker

Para construir a imagem Docker da aplicação, execute o seguinte comando no diretório raiz do projeto:

```bash
docker build -t nome-da-imagem .

Para iniciar os serviços definidos no docker-compose.yml, execute:

bash
Copy code
docker-compose up


## Erros

- 400 Bad Request: Dados inválidos ou formato incorreto.
- 404 Not Found: Recurso não encontrado.
- 409 Conflict: Conflito com o estado atual do recurso.