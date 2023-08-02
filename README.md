# FoodExplorer_Back-end

<strong> Obs: branch main está em desenvolvimento, o deploy do back funcionando está na branch Deploy_Railway_tmp </strong>
Caso não saiba mudar de branch, Use o seguinte comando apos fazer o clone do repositorio (para ir para a branch do desafio final)

´´´
git checkout -b Deploy_Railway_tmp origin/Deploy_Railway_tmp
´´´

</br>

# Deploy online nas rotas:

## Documentação em inglês
```
https://foodexplorer-br.onrender.com/docs/en   // doc no Render (funcionando)
https://foodexplorerback-end-production.up.railway.app/docs/en  // doc do Railway (off por enquanto, pois precisa pagar)
)
```

## Documentação em Português brasileiro (Doc do BACK-END com swagger, todas rotas, o que for feito aqui, vai aparecer para o front, pois estão ligados os repositorios)
```
https://foodexplorer-br.onrender.com/docs/pt-br/

https://foodexplorerback-end-production.up.railway.app/docs/pt-br    // (doc estatica, antiga, no railway, server congelado pois a versão free terminou) 
```

</br>
</br>

Comandos para testar o back-end localmente (em localhost)

Baixar as migrations para ter todo o banco de dados padrão
```
npm run migrate
```

### *Para testar as chamadas é obrigatoriamente ter pelo menos um usuario criado e cadastrado no banco de dados, pois tem middleware de autenticação para criação de pratos, favoritos entre outras rotas*

</br>

## Para ler e entender todas rotas, execute no terminal de qualquer IDE:

```
npm run dev
```

E para rodar o servidor e coloque a seguinte url em qualquer navegador:

# Documentação em inglês
```
http://localhost:3000/docs
```

# Documentação em Português brasileiro
```
http://localhost:3000/docs.br
```
