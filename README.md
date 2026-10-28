# SYNTAX.lab — Sistema de Manutenção de Equipamentos

Sistema desenvolvido para organizar clientes, técnicos, equipamentos e ordens de serviço de uma empresa de manutenção de equipamentos.


## Sobre nosso projeto

O **SYNTAX.lab** é um sistema de gerenciamento de ordens de serviço desenvolvido com o objetivo de facilitar a organização e o acompanhamento dos serviços de manutenção de equipamentos.

O projeto possui uma interface que permite acessar diferentes áreas, como cadastro de clientes, gerenciamento de técnicos, consulta de ordens de serviço e relatórios.

Além do front-end, o projeto conta com um banco de dados chamado `banco.db`, composto por cinco tabelas relacionadas entre si, responsáveis por organizar e armazenar as informações do sistema.

## Objetivos do nosso projeto

- Organizar os dados dos clientes e dos técnicos.
- Registrar informações sobre equipamentos e problemas relatados.
- Consultar e acompanhar as ordens de serviço.
- Identificar o status de cada serviço.
- Facilitar o acesso às informações por meio de uma interface organizada.
- Armazenar as informações em um banco de dados estruturado.

 
## Interface do sistema

A interface do SYNTAX.lab foi desenvolvida para apresentar as informações de forma organizada, facilitando a navegação entre as diferentes funcionalidades.

### Tela inicial — Painel de controle

A página `inicio.html` apresenta um resumo das ordens de serviço, com indicadores que mostram:

- **Total de OS:** quantidade total de ordens de serviço.
- **Concluídas:** quantidade de serviços finalizados.
- **Em andamento:** quantidade de serviços que ainda estão sendo realizados.
- **Atrasadas:** quantidade de ordens de serviço identificadas como atrasadas.

A página também possui atalhos para acessar os relatórios e outras áreas do sistema.

### tela inicial


![Tela inicial do SYNTAX.lab](prints/index.jpg.png)


# Estrutura do Front-end

O front-end é composto por 11 páginas HTML, cada uma com uma finalidade específica dentro do sistema.

## 1. `index.html` — Cadastro inicial

Página inicial de cadastro de usuários.

O formulário inclui os seguintes campos:

- Nome completo;
- E-mail;
- Senha;
- Idade, com restrição para pessoas menores de 18 anos;
- Gênero.

A página foi planejada para permitir o preenchimento dos dados necessários ao cadastro e incluir uma restrição de idade mínima de 18 anos.

### página INDEX


![Cadastro inicial](prints/cadastro)

## 2. `inicio.html` — Página inicial do sistema

Apresenta o painel principal do SYNTAX.lab.

A tela contém indicadores das ordens de serviço e atalhos para acessar diferentes áreas do sistema, permitindo uma visualização resumida das informações.


![Painel inicial](prints/inicio.jpg.png)

## 3. `cadascliente.html` — Cadastro de clientes

Página destinada ao preenchimento das informações dos clientes.

Seu objetivo é permitir o registro dos dados necessários para identificar e manter organizados os clientes atendidos pela empresa.


![Cadastro de clientes](prints/cadascliente.png)

## 4. `clientes.html` — Gerenciamento de clientes

Página que apresenta os clientes já cadastrados no sistema.

Permite consultar os registros existentes e acessar as opções disponíveis para o gerenciamento dos dados dos clientes.


![Página de clientes](prints/clientes.png)

## 5. `cadastrar.html` — Cadastro de técnicos

Página destinada ao cadastro de técnicos que fazem parte da equipe de manutenção.

Os dados cadastrados ajudam a identificar os profissionais responsáveis pela realização dos serviços.


![Cadastro de técnicos](prints/cadastrotec.png)

## 6. `tecnicos.html` — Gerenciamento de técnicos

Página utilizada para visualizar e gerenciar os técnicos cadastrados.

Também apresenta opções para acessar o cadastro e organizar as informações dos profissionais da equipe.


![Página de técnicos](prints/tecnicos.jpg)

## 7. `editar.html` — Edição de cadastros

Página destinada à edição dos dados dos clientes já cadastrados.

Também permite acessar informações relacionadas aos problemas relatados nos equipamentos e atualizar os dados dos registros, conforme as funcionalidades implementadas no sistema.


![Edição de cadastros](prints/cadastrotec.png) 

## 8. `ordem.html` — Ordens de serviço

A página apresenta informações sobre as ordens de serviço e seus detalhes.

### O que é uma Ordem de Serviço?

A Ordem de Serviço (OS) é um documento utilizado para registrar, formalizar e acompanhar a realização de um serviço contratado.

Ela informa o que será feito, quem será responsável, quais são os prazos e quais materiais ou recursos serão necessários.

É utilizada em diferentes setores, como manutenção de equipamentos, oficinas, assistência técnica, tecnologia e prestação de serviços.

### Para que serve uma OS?

As principais funções de uma ordem de serviço são:

- **Formalizar o serviço:** registrar o que foi solicitado e acordado com o cliente.
- **Acompanhar o andamento:** identificar se o serviço está pendente, em execução ou concluído.
- **Organizar os custos:** registrar materiais, peças e mão de obra.
- **Controlar prazos:** acompanhar as datas de início e conclusão.
- **Facilitar a cobrança:** fornecer informações para o controle financeiro.
- **Evitar problemas:** manter um histórico do serviço e reduzir mal-entendidos entre a empresa e o cliente.

A página reúne os registros das ordens de serviço e permite consultar informações relacionadas aos clientes, equipamentos, técnicos, prazos e status dos serviços.


![Ordens de serviço](prints/ordem.jpg.png)


## 9. `detalhes.html` — Detalhes das ordens de serviço

Página destinada à apresentação dos detalhes dos registros relacionados às ordens de serviço.

Seu objetivo é facilitar a consulta das informações dos clientes e dos serviços registrados, reunindo dados que ajudam a compreender cada atendimento.


![Detalhes das ordens de serviço](prints/detalhes.jpg.png)

## 10. `relatorios.html` — Relatórios do sistema

Página que apresenta um resumo das informações disponíveis no sistema.

Os relatórios ajudam a visualizar os dados relacionados às ordens de serviço, aos técnicos e aos clientes, facilitando a consulta e a organização das informações.


![Relatórios do sistema](prints/relatorios.png)

## 11. `sobre.html` — Sobre nós

Página destinada à apresentação dos integrantes do grupo e de suas respectivas funções no desenvolvimento do projeto.

Seu objetivo é identificar os participantes e apresentar a contribuição de cada integrante para a construção do SYNTAX.lab.


![Página sobre nós](prints/sobre.png)


# Banco de dados

O projeto utiliza o arquivo `banco.db` para armazenar as informações do sistema.

A estrutura do banco de dados foi desenvolvida utilizando o Visual Studio Code (VS Code), com os comandos de criação e inserção de dados organizados no arquivo de seed.

O banco de dados possui cinco tabelas:

1. Clientes;
2. Equipamentos;
3. Técnicos;
4. Status;
5. Ordem de Serviço.

## Arquivo de seed

A seed contém os comandos utilizados para criar as cinco tabelas e inserir as informações iniciais em cada uma delas.

Ela permite definir a estrutura do banco de dados e preparar os registros necessários para o funcionamento e os testes do sistema.

## Arquivo `banco.db`

O arquivo `banco.db` contém o banco de dados com as cinco tabelas e suas respectivas informações.


![Banco de dados do SYNTAX.lab](prints/clientesbd.jpg)


# Estrutura das tabelas

## 1. Tabela Clientes

Armazena as informações dos clientes cadastrados no sistema.

| Campo | Descrição |
|---|---|
| ID | Identificador único de cada registro. |
| Nome | Nome do cliente registrado. |
| Telefone | Telefone do cliente. |
| Email | E-mail pessoal do cliente. |

## 2. Tabela Equipamentos

Armazena os equipamentos registrados no sistema.

| Campo | Descrição |
|---|---|
| ID | Identificador único de cada registro. |
| Nome | Nome do equipamento registrado. |

## 3. Tabela Ordem de Serviço

Armazena as informações referentes aos problemas relatados e aos serviços solicitados.

| Campo | Descrição |
|---|---|
| ID | Identificador único de cada registro de ordem de serviço. |
| Descrição do problema | Descrição do problema apresentado pelo equipamento. |
| Data | Data em que o problema foi relatado. |

## 4. Tabela Status

Armazena os status utilizados para identificar a situação das ordens de serviço.

| Campo | Descrição |
|---|---|
| ID | Identificador único de cada registro. |
| Descrição | Situação da ordem de serviço, como pendente, em andamento ou concluída. |

## 5. Tabela Técnicos

Armazena as informações dos profissionais responsáveis pelos serviços de manutenção.

| Campo | Descrição |
|---|---|
| ID | Identificador único de cada técnico. |
| Nome | Nome do técnico registrado. |
| Especialidade | Área de conhecimento ou atuação do técnico. |
| Contato | Telefone ou e-mail do profissional para facilitar a comunicação. |


Adicione abaixo as capturas de tela das tabelas do banco de dados.

**Tabela Clientes**

![Tabela Clientes](prints/clientesbd.jpg)

**Tabela Equipamentos**

![Tabela Equipamentos](prints/equipamentos.jpg)

**Tabela Ordem de Serviço**

![Tabela Ordem de Serviço](prints/ordensbanco.jpg)

**Tabela Status**

![Tabela Status](prints/statusbd.jpg)

**Tabela Técnicos**

![Tabela Técnicos](prints/tecnicosbd.jpg)


# Relacionamento entre as tabelas

As tabelas se relacionam por meio das ordens de serviço, que conectam os clientes, os técnicos, os equipamentos e os status.

Esses relacionamentos permitem organizar as informações de cada atendimento e manter os registros associados.

### Relacionamentos principais

- **Clientes → Ordens de Serviço:** um cliente pode ter várias ordens de serviço.
- **Técnicos → Ordens de Serviço:** um técnico pode ser responsável por várias ordens de serviço.
- **Equipamentos → Ordens de Serviço:** um equipamento pode estar associado a várias ordens de serviço.
- **Status → Ordens de Serviço:** cada ordem de serviço possui um status que indica sua situação, como pendente, em andamento ou concluída.



![Relacionamento entre as tabelas](prints/relações.jpg)


# Tecnologias e ferramentas

As ferramentas e tecnologias utilizadas no projeto incluem:

- **HTML:** estruturação das páginas do sistema.
- **CSS:** estilização e organização visual da interface.
- **Visual Studio Code (VS Code):** ambiente utilizado para desenvolver e organizar os arquivos do projeto.
- **Banco de dados SQLite (`banco.db`):** arquivo utilizado para armazenar os registros do sistema.

> A lista apresenta as tecnologias identificadas na estrutura descrita do projeto. Outras tecnologias podem ser acrescentadas caso também tenham sido utilizadas.


# Organização dos arquivos

Uma possível organização dos arquivos do projeto é:

```text
SYNTAX.lab/
│
├── index.html
├── inicio.html
├── cadascliente.html
├── clientes.html
├── cadastrar.html
├── tecnicos.html
├── editar.html
├── ordem.html
├── detalhes.html
├── relatorios.html
├── sobre.html
│
├── style.css
│
├── banco.db
├── seed.sql
│
└── prints/
    ├── inicio.png
    ├── cadastro-inicial.png
    ├── cadascliente.png
    ├── clientes.png
    ├── cadastrar.png
    ├── tecnicos.png
    ├── editar.png
    ├── ordem.png
    ├── detalhes.png
    ├── relatorios.png
    ├── sobre.png
    ├── banco-de-dados.png
    ├── tabela-clientes.png
    ├── tabela-equipamentos.png
    ├── tabela-ordem-servico.png
    ├── tabela-status.png
    ├── tabela-tecnicos.png
    └── relacionamento-tabelas.png


**Observação:** a estrutura acima é um modelo de organização. Ajuste os nomes dos arquivos e das pastas conforme a estrutura real do projeto. Se o arquivo de seed tiver outro nome ou extensão, mantenha o nome utilizado por vocês.



# Como visualizar o projeto

1. Abra a pasta do projeto no Visual Studio Code.
2. Verifique se os arquivos HTML, o CSS e os demais arquivos estão organizados nas pastas corretas.
3. Abra o arquivo `index.html` para visualizar a página de cadastro inicial.
4. Navegue pelas páginas por meio dos menus e dos links disponíveis.
5. Para visualizar o banco de dados, utilize uma ferramenta compatível com o formato SQLite.

A navegação e as funcionalidades disponíveis dependem dos links e dos recursos implementados nos arquivos do projeto.


# Equipe do projeto

O projeto foi desenvolvido em grupo. A página `sobre.html` apresenta os integrantes e suas respectivas funções.

**Integrantes:**

- **Nome:** [Júlia Pardim Vieira]
  - **Função:** [Responsável pelo Front End]

- **Nome:** [Dafny Calvanese]
  - **Função:** [Responsável pelo Banco de Dados]

- **Nome:** [João Dantas]
  - **Função:** [Responsável pelo FIGMA e Back End]

- **Nome:** [Pietro Pansani]
  - **Função:** [Responsável pelo Back End]

# Considerações finais

O SYNTAX.lab foi desenvolvido com o propósito de facilitar a organização das informações relacionadas à manutenção de equipamentos, reunindo cadastros, ordens de serviço, técnicos, clientes e relatórios em um único sistema.

O projeto também permitiu trabalhar com a estruturação de páginas web, a organização de arquivos, a modelagem de tabelas e o relacionamento entre dados em um banco de dados.

A documentação apresenta as principais páginas do front-end e a estrutura do banco de dados, contribuindo para a compreensão e a manutenção do projeto.
