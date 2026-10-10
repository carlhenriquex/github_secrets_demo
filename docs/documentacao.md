# Documentação da atividade — GitHub Secrets

**Aluno:** Gabriel da Silva Der Garabedian
**Repositório (fork):** https://github.com/Gabriel-Garabedian/github_secrets_demo

## 1. Problema encontrado

No arquivo `.github/workflows/main.yml` (o enunciado o chama de `pipeline.yml`), a variável `MENSAGEM_SECRETA` estava escrita diretamente no código do workflow:

```yaml
env:
  MENSAGEM_SECRETA: "Minha mensagem secreta"
```

Como o workflow é versionado junto com o projeto, o valor ficava exposto no repositório e no histórico de commits.

**1. Onde o segredo está armazenado?**
Em texto puro, dentro do arquivo `main.yml`, no repositório Git (inclusive no histórico de commits).

**2. Quem poderia visualizar essa informação?**
Qualquer pessoa com acesso de leitura ao repositório. Em um repositório público, isso significa qualquer pessoa na internet, além de quem fizer fork ou clone.

**3. Por que essa prática não é recomendada?**
Porque o valor fica visível a quem tem acesso ao código, é copiado em forks e clones, permanece no histórico mesmo depois de apagado do arquivo e não há controle de acesso nem facilidade para trocar o valor (rotação). Além disso, mistura configuração sensível com código.

**4. O que poderia acontecer se fosse uma senha ou um token real?**
Alguém poderia usá-lo para acessar sistemas, bancos de dados ou serviços indevidamente. Há bots que varrem o GitHub procurando credenciais expostas. Seria necessário revogar e trocar a credencial imediatamente, pois apagá-la do arquivo não a remove do histórico.

## 2. Nome do Secret utilizado

`MENSAGEM_SECRETA` (Settings → Secrets and variables → Actions → *New repository secret*).

## 3. Como o Secret chegou até a aplicação

```text
Secret → GitHub → GitHub Actions → Variável de ambiente → Aplicação
```

1. O valor foi cadastrado como *repository secret* nas configurações do repositório. Ele fica criptografado no GitHub e não está em nenhum arquivo do projeto.
2. Quando o workflow roda, o GitHub Actions resolve a expressão `${{ secrets.MENSAGEM_SECRETA }}` e injeta o valor no passo "Executar aplicação".
3. O passo define a variável de ambiente `MENSAGEM_SECRETA` para o processo do Node.
4. A aplicação lê o valor com `process.env.MENSAGEM_SECRETA`. O código nunca contém o valor.

Alteração feita no workflow:

```yaml
- name: Executar aplicação
  env:
    MENSAGEM_SECRETA: ${{ secrets.MENSAGEM_SECRETA }}
  run: |
    cd app
    node server.js
```

## 4. Evidência de execução da pipeline

> **PREENCHER após o push:** cole aqui o link da execução na aba *Actions* e/ou um print do log.
>
> Link da execução: `https://github.com/Gabriel-Garabedian/github_secrets_demo/actions/runs/<ID>`
>
> No log, o passo "Executar aplicação" deve mostrar:
> `Secret recebido pela aplicação com sucesso.` e `Quantidade de caracteres: N`, sem exibir o texto do segredo.

## 5. Validação

- [ ] A pipeline executou com sucesso (check verde).
- [ ] A aplicação recebeu a mensagem (log "Secret recebido pela aplicação com sucesso.").
- [ ] O `main.yml` não contém mais o valor real do segredo.
- [ ] O valor do Secret não está em nenhum arquivo do código.
- [ ] O valor não aparece nos logs (o GitHub o mascara como `***`; a aplicação imprime apenas a quantidade de caracteres).

## 6. Respostas das questões

**1. Qual é a diferença entre armazenar o valor no `pipeline.yml` e no GitHub Secrets?**
No arquivo, o valor fica em texto puro, versionado e visível a quem lê o repositório. No GitHub Secrets, ele fica criptografado fora do código, só é entregue ao workflow na hora da execução e é mascarado nos logs.

**2. Onde o valor do Secret fica configurado?**
Nas configurações do repositório no GitHub: *Settings → Secrets and variables → Actions → Secrets* (*Repository secrets*).

**3. O valor do Secret deve ser colocado no código da aplicação?**
Não. A aplicação só deve ler o valor de uma variável de ambiente, sem conhecer o valor de antemão.

**4. Qual é a função de `process.env.MENSAGEM_SECRETA`?**
Ler, dentro do Node.js, o valor da variável de ambiente `MENSAGEM_SECRETA` definida no processo. Foi assim que o workflow entregou o Secret para a aplicação.

**5. Por que utilizar Secrets é importante em uma pipeline de CI/CD?**
Pipelines usam credenciais (tokens, senhas, chaves de API, acesso a nuvem). Secrets evitam que elas vão para o repositório, reduzem o risco de vazamento, permitem trocar o valor sem alterar o código e controlam quem pode gerenciá-lo.

**6. Por que seria inadequado colocar uma senha real de banco de dados direto no `.yml`?**
Porque qualquer pessoa com acesso ao repositório (e ao histórico, forks e clones) poderia ler a senha e acessar o banco. Mesmo apagando depois, ela continuaria no histórico do Git, e seria preciso trocar a senha. Com Secrets, o `.yml` guarda só a referência `${{ secrets.NOME }}`.
