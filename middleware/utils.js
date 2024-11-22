let calculateCareerStats = (player) => {
    // Admin
    let years = foundPlayer.season.map(({ grade }) => grade);

    // Totals
    let gp = foundPlayer.season.map(({ gp }) => gp);
    let gs = foundPlayer.season.map(({ gs }) => gs);
    let totalGS = gs.reduce((a, b) => a + b, 0);
    let minutes = foundPlayer.yearlyTotals.map(({ min }) => min);
    let totalMP = minutes.reduce((a, b) => a + b, 0);
    const totalGP = player.season.reduce((sum, { gp }) => sum + gp, 0);
    let fgMade = foundPlayer.yearlyTotals.map(({ fgm }) => fgm);
    let pointTotal = foundPlayer.yearlyTotals.map(({ pts }) => pts);
    let totalFGM = fgMade.reduce((a, b) => a + b, 0);
    let fgAtt = foundPlayer.yearlyTotals.map(({ fga }) => fga);
    let totalFGA = fgAtt.reduce((a, b) => a + b, 0);
    let tpAtt = foundPlayer.yearlyTotals.map(({ tpa }) => tpa);
    let tpMade = foundPlayer.yearlyTotals.map(({ tpm }) => tpm);
    let totalTPA = tpAtt.reduce((a, b) => a + b, 0);
    let totalTPM = tpMade.reduce((a, b) => a + b, 0);
    let ftAtt = foundPlayer.yearlyTotals.map(({ fta }) => fta);
    let totalFTA = ftAtt.reduce((a, b) => a + b, 0);
    let ftMade = foundPlayer.yearlyTotals.map(({ ftm }) => ftm);
    let totalFTM = ftMade.reduce((a, b) => a + b, 0);
    let orb = foundPlayer.yearlyTotals.map(({ orb }) => orb);
    let totalORB = orb.reduce((a, b) => a + b, 0);
    let drb = foundPlayer.yearlyTotals.map(({ drb }) => drb);
    let totalDRB = drb.reduce((a, b) => a + b, 0);
    let ast = foundPlayer.yearlyTotals.map(({ ast }) => ast);
    let astTotal = foundPlayer.yearlyTotals.map(({ ast }) => ast);
    let totalAST = ast.reduce((a, b) => a + b, 0);
    let stl = foundPlayer.yearlyTotals.map(({ stl }) => stl);
    let totalSTL = stl.reduce((a, b) => a + b, 0);
    let blk = foundPlayer.yearlyTotals.map(({ blk }) => blk);
    let totalBLK = blk.reduce((a, b) => a + b, 0);
    let pf = foundPlayer.yearlyTotals.map(({ pf }) => pf);
    let totalPF = pf.reduce((a, b) => a + b, 0);
    let pts = foundPlayer.yearlyTotals.map(({ pts }) => pts);
    let totalPTS = pts.reduce((a, b) => a + b, 0);

    // Averages
    let pointAvg = player.season.map(({ ppg }) => ppg);
    let astAvg = foundPlayer.season.map(({ apg }) => apg);
    let rebAvg = foundPlayer.season.map(({ rpg }) => rpg);
    let mpgAvg = foundPlayer.season.map(({ mpg }) => mpg);
    let avgMPG = [];
    for (var i = 0; i < mpgAvg.length; i++) {
        avgMPG[i] = mpgAvg[i] * gp[i];
    }
    let careerMPGTemp = avgMPG.reduce((a, b) => a + b, 0);
    let careerMPG = careerMPGTemp / totalGP;
    let careerFG = totalFGM / totalFGA;
    let careerTP = totalTPM / totalTPA;
    let careerFT = totalFTM / totalFTA;
    let careerRPG = (totalORB + totalDRB) / totalGP;
    let careerAPG = totalAST / totalGP;
    let careerSPG = totalSTL / totalGP;
    let careerBPG = totalBLK / totalGP;
    let careerPPG = totalPTS / totalGP;

    return {
        gp: totalGP,
        mp: totalMP
    }

   /*pointAvgs: pointAvg,
    astAvgs: astAvg,
    rebAvgs: rebAvg,
    pointTotals: pointTotal,
    astTotals: astTotal,
    yearTotals: years,
    mpg: careerMPG,
    gp: totalGP,
    gs: totalGS,
    mp: totalMP,
    fgm: totalFGM,
    fga: totalFGA,
    tpa: totalTPA,
    tpm: totalTPM,
    fta: totalFTA,
    ftm: totalFTM,
    orb: totalORB,
    drb: totalDRB,
    ast: totalAST,
    stl: totalSTL,
    blk: totalBLK,
    pf: totalPF,
    pts: totalPTS,
    careerFG: careerFG,
    careerTP: careerTP,
    careerFT: careerFT,
    careerRPG: careerRPG,
    careerAPG: careerAPG,
    careerSPG: careerSPG,
    careerBPG: careerBPG,
    careerPPG: careerPPG,*/
}

module.exports = calculateCareerStats