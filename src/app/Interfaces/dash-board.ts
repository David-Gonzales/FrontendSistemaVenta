export interface VentasSemana {
  fecha: string;
  total: number;
}

export interface DashBoard {
  totalIngresos: string;
  totalVentas: number;
  totalProductos: number;
  ventasUltimaSemana: VentasSemana[];
}
