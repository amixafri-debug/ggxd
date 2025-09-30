export default class Orbit {
  constructor(a, e, periodDays, incl, mean_anomaly=0) {
    this.a = a; //semieje mayor
    this.e = e; // excentricidad real
    this.periodDays = periodDays; // periodo sideral
    this.incl = incl; // inclinación vs plano de la escena
    this.mean_anomaly = mean_anomaly
  }
  
  getRadPerDay() {
    return (2 * Math.PI)/this.periodDays // movimiento medio (rad/día)
  }

}