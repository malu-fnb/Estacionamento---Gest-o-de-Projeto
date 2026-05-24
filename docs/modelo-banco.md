# Modelo do Banco de Dados

## Tabelas

O sistema utiliza quatro tabelas principais:

- gatekeepers
- employees
- vehicles
- parking_records

## gatekeepers

Armazena os porteiros responsáveis pelos registros de entrada e saída.

Campos principais:

- id
- name
- phone
- email
- cpf
- password
- createdAt
- updatedAt

Regras:

- O email do porteiro deve ser único.
- O CPF do porteiro deve ser único.

## employees

Armazena os funcionários ou donos dos veículos.

Campos principais:

- id
- name
- department
- ra
- email
- phone
- createdAt
- updatedAt

Regras:

- O RA deve ser único.
- Um funcionário pode possuir vários veículos.

## vehicles

Armazena os veículos cadastrados no sistema.

Campos principais:

- id
- employeeId
- plate
- make
- model
- color
- createdAt
- updatedAt

Regras:

- A placa deve ser única.
- Cada veículo pertence a um funcionário.
- Um funcionário pode ter mais de um veículo.

## parking_records

Armazena os registros de entrada e saída.

Campos principais:

- id
- vehicleId
- gatekeeperId
- type
- timestamp
- notes
- createdAt

Regras:

- O campo type pode ser ENTRY ou EXIT.
- ENTRY representa entrada.
- EXIT representa saída.
- Se o último registro de um veículo for ENTRY, ele está dentro do estacionamento.
- Se o último registro for EXIT, ele está fora.
- A observação é opcional.

## Relacionamentos

Employee 1:N Vehicle

Vehicle 1:N ParkingRecord

Gatekeeper 1:N ParkingRecord

## Regras de negócio atendidas

- Um funcionário pode ter mais de um veículo.
- Uma placa não pode ser cadastrada mais de uma vez.
- Um veículo não pode registrar nova entrada se já estiver dentro.
- A saída é feita buscando pela placa.
- A observação no registro é opcional.