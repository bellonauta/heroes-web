/******************************************************************/
/* APP HEROES - Funções/Procedimentos JS para o "Ring dos Heróis" */
/* -------------------------------------------------------------- */
/*   05/2021 - Implementação inicial(Wilson)                      */
/******************************************************************/

/**
 * Wrap para Math.max().
 * @param {number} v1 
 * @param {number v2 
 * @returns 
 */
function max(v1, v2) {
    v1 = isNaN(v1) ? 0 : v1;
    v2 = isNaN(v2) ? 0 : v2;
    //
    return Math.max(v1,v2);
}


/**
 * Define o herói vencedor do combate.
 * Regras: 1. Vence quem tiver o menor IMC(grau de sobrepeso e obesidade).
 *            O IMC é calculado dividindo o peso (em kg) pela altura ao quadrado (em metros).
 *         2. Se houver empate vence o herói favorito.
 *         2.1. Se não houver favoritos, vence o mais veloz 
 *         2.2. Se os dois combatentes forem favoritos, vence o mais veloz.
 *         2.1.1. e 2.2.1. Se os dois tiverem a mesma velocidade, vencerá sempre o 1º combatente
 * 
 * @param float pes1C Peso(kg) do 1º combatente
 * @param float alt1C Altura(M) do 1º combatente
 * @param float vel1C Velocidade(Km/H) do 1º combatente
 * @param boolean fav1C 1º combatente é favorito?
 * @param float pes2C Peso(kg) do 2º combatente
 * @param float alt2C Altura(M) do 2º combatente
 * @param float vel2C Velocidade(Km/H) do 2º combatente
 * @param boolean fav2C 2º combatente é favorito? 
 * @returns int 1 se 1º combatente for o vencedor ou 
 *              2 se 2º combatente for o vencedor.
 */
function combatWinner(pes1C, alt1C, vel1C, fav1C, pes2C, alt2C, vel2C, fav2C) {
    var ret = 0;
    var imc1C = pes1C / (max(0.01, alt1C) ** 2); 
    var imc2C = pes2C / (max(0.01, alt2C) ** 2);
    //
    if (imc1C < imc2C) {
        // 1. 
        ret = 1;
    } else if (imc2C < imc1C) {
        // 1.
        ret = 2;
    } else {
        //Empate 
        if (!(fav1C && fav2C)) {
            // 2.2.
            if (fav1C) {
                // 2.
                ret = 1 
            } else if (fav2C) {
                // 2.
                ret = 2
            }
        }
        //
        if (ret == 0) {
            // 2.1.1. e 2.2.1. 
            if (vel1C == vel2C) {
                ret = 1; 
            } else {
                // 2.1. e 2.2.  
                ret = vel1C > vel2C ? 1 : 2; 
            }
        }
    }
    //
    return ret;
}