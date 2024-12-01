// gimmickFunctions.ts
export function playRockPaperScissors(playerChoice: string) {
  const choices = ['rock', 'paper', 'scissors'];
  
  // Validasi pilihan pemain
  if (!choices.includes(playerChoice)) {
    return {
      message: 'Invalid choice!',
      resultClass: 'error-notification',
      titleColor: '',
    };
  }

  const enemyChoice = choices[Math.floor(Math.random() * choices.length)];

  let result = '';
  if (playerChoice === enemyChoice) {
    result = `It's a tie! Both chose ${playerChoice}.`;
  } else if (
    (playerChoice === 'rock' && enemyChoice === 'scissors') ||
    (playerChoice === 'scissors' && enemyChoice === 'paper') ||
    (playerChoice === 'paper' && enemyChoice === 'rock')
  ) {
    result = `You win! ${playerChoice} beats ${enemyChoice}.`;
  } else {
    result = `You lose! ${enemyChoice} beats ${playerChoice}.`;
  }

  // Tentukan kelas notifikasi dan warna judul berdasarkan hasil
  const resultClass = result.includes('win') ? 'success-notification' : result.includes('lose') ? 'error-notification' : result.includes('tie') ? 'info-notification' : '';
  const titleColor = result.includes('win') ? 'green' : result.includes('lose') ? 'red' : result.includes('tie') ? 'red' :'';

  return {
    message: result,
    resultClass,
    titleColor,
  };
}
