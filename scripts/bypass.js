/** * IPS Bypass Attempt Simulation (Self-Test)
 * Used to verify if 'Sessiz Olum' blocks 4th request.
 */
const testAttack = () => {
    console.log("--- Starting IPS Pressure Test ---");
    for(let i=1; i<=5; i++) {
        console.log(`Attempt ${i}: Requesting /api/secure...`);
    }
};
testAttack();
