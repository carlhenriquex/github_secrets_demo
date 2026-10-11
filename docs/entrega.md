# Entrega: GitHub Secrets

## Problema encontrado
O valor de MENSAGEM_SECRETA estava escrito direto no main.yml. Como o arquivo
fica versionado no repositório, qualquer pessoa com acesso ao código (ou ao
histórico de commits) consegue ler o valor.

## Secret utilizado
MENSAGEM_SECRETA

## Como o Secret chegou até a aplicação
Secret (Settings > Secrets and variables > Actions) → GitHub (armazena
criptografado) → GitHub Actions (resolve ${{ secrets.MENSAGEM_SECRETA }} na
execução) → variável de ambiente MENSAGEM_SECRETA → process.env.MENSAGEM_SECRETA
no server.js.

## Evidência de execução
![Pipeline executada](img/pipeline.png)

## Respostas: Situação inicial
1. O segredo está armazenado no próprio arquivo main.yml, dentro do repositório.
2. Qualquer pessoa com acesso de leitura ao repositório (se for público, qualquer um).
3. Porque expõe a informação no código e no histórico do Git, mesmo que seja removida depois.
4. Poderia ser usada por terceiros para acessar sistemas, bancos ou serviços, causando vazamento de dados e prejuízos.

## Respostas: Questões
1. No main.yml o valor fica visível em texto puro no repositório. No GitHub Secrets ele fica criptografado, fora do código, e é mascarado (***) nos logs.
2. Nas configurações do repositório: Settings > Secrets and variables > Actions.
3. Não. O código só lê a variável de ambiente; o valor nunca deve estar no código.
4. Lê o valor da variável de ambiente MENSAGEM_SECRETA no processo Node.js, sem saber de onde ela veio.
5. Porque pipelines usam credenciais (tokens, senhas, chaves). Secrets evitam vazamento, permitem trocar o valor sem mexer no código e separam a configuração sensível do código.
6. Porque a senha ficaria visível a quem acessa o repositório e permaneceria no histórico do Git. Um vazamento daria acesso direto ao banco de dados. 