import { ButacaModel, ButacaPayload, TipoButaca } from "./butaca.model";

const FILAS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"];

/* funcion que permite generar la matriz de butacas para ser guardada en la BD */
export function generarButacas(salaId: number): ButacaPayload[] {

    const butacas: ButacaPayload[] = [];

    FILAS.forEach((letraFila) => {
        let cantSector1 = 4, cantSector2 = 20, cantSector3 = 4;
        let tipoButaca: TipoButaca = "normal";

        if (letraFila === "J" || letraFila === "K") {
            cantSector1 = 2; cantSector2 = 10; cantSector3 = 2;
            tipoButaca = "accesible";
        }
        if (letraFila === "R" || letraFila === "S" || letraFila === "T") {
            tipoButaca = "VIP";
        }

        [cantSector1, cantSector2, cantSector3].forEach((cantidad, s) => {
            for (let b = 1; b <= cantidad; b++) {
                butacas.push({
                    salaId,
                    letraFila,
                    numero: b,
                    sector: s + 1,
                    tipo: tipoButaca,
                });
            }
        });
    });

    return butacas;
}

/* funcion que permite renderizar la matriz */
export function construirMatriz(butacas: ButacaModel[]): ButacaModel[][][] {
    return FILAS.map((letra) => {
        const sectores: ButacaModel[][] = [[], [], []];

        butacas
            .filter(b => b.letraFila === letra)
            .sort((a, b) => a.sector - b.sector || a.numero - b.numero)
            .forEach(b => sectores[b.sector - 1].push(b));

        return sectores;
    });
}