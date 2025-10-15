import React, { useState } from 'react';

function Home() {
  const [listaRefletir, setListaRefletir] = useState(false);
  const [listaDia, setListaDiaVisible] = useState(false);

  const refletir = ['Lembre-se: a preocupação nunca remove o sofrimento de amanhã, mas sim a força de hoje.', 'O segredo da paz interior é viver um dia de cada vez', 'Você não precisa resolver tudo agora. Só dar o seu melhor neste momento.', 'Nada é permanente. Nem a dor, nem a alegria. Tudo passa.', 'Respire fundo. Você já enfrentou dias piores e ainda está aqui.', 'Em vez de se preocupar com o que pode dar errado, imagine o que pode dar certo.', 'Um pequeno passo em direção à calma vale mais do que mil pensamentos sobre ela.', 'Aceitar o que não se pode mudar é o primeiro passo da liberdade.', 'Hoje, escolha ser gentil consigo mesmo.'];
  const dia = ['🌿 Dar uma volta de 10 minutos ao ar livre. Olhe o céu, o vento, o som das coisas.', '🕯️ Fazer algo devagar de propósito (um café, um banho, uma caminhada).', '📖 Ler uma página de um livro que traga paz', '💬 Falar com alguém de confiança, mesmo que só pra dizer “tô cansado”.', '🫀 Colocar uma música calma e respirar fundo por 2 minutos.', '💧 Beber um copo d’água e alongar o corpo.', '🌙 Antes de dormir, agradecer por algo simples — até mesmo por ter chegado até aqui.'];

  return (
    <div style={{display: 'flex', justifyContent: 'center', width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center'}}>
      <p style={{
        background: 'linear-gradient(to right, #ff8a00, #e52e71)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontSize: '30px',
        fontWeight: 'bold',
        marginTop:0
        }}>
        Olá, Raí! Estava criando esse site pra aprender umas coisas e decidir deixar essa mensagem para que você nunca esqueca que és mais ofrte do que qualquer um imagina!  
        Nunca se esqueça que, por mais difícil que tudo pareca estar, você não está só. 
        Abaixo deixo alguns lembretes pro dia!
      </p>
      <div>
        <button onClick={() => setListaRefletir(!listaRefletir)}>
          {listaRefletir ? 'Esconder Lembretes' : 'Mostrar Lembretes'}
        </button>
        {listaRefletir && (
          <ul>
            {refletir.map(tech => <li key={tech}>{tech}</li>)}
          </ul>
        )}
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div>
        <button onClick={() => setListaDiaVisible(!listaDia)}>
          {listaDia ? 'Esconder Para o dia' : 'Mostrar Para o dia'}
        </button>
        {listaDia && (
          <ul>
            {dia.map(item => <li key={item}>{item}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;